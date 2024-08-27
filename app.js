//app.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));

const games = new Map();

class Game {
    constructor(id) {
        this.id = id;
        this.board = Array(5).fill().map(() => Array(5).fill(null));
        this.players = [];
        this.currentTurn = 0;
        this.spectators = new Set();
        this.chatHistory = [];
        this.moveHistory = [];
    }

    addPlayer(player) {
        if (this.players.length < 2) {
            this.players.push(player);
            return true;
        }
        return false;
    }

    addSpectator(spectatorId) {
        this.spectators.add(spectatorId);
    }

    removeSpectator(spectatorId) {
        this.spectators.delete(spectatorId);
    }

    initializeBoard(playerIndex, characters) {
        const row = playerIndex === 0 ? 0 : 4;
        characters.forEach((char, col) => {
            this.board[row][col] = `${playerIndex === 0 ? 'A' : 'B'}-${char}`;
        });
    }

    makeMove(playerIndex, move) {
        const [charName, direction] = move.split(':');
        const [type, number] = charName.split('');
        
        let charPos;
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                if (this.board[i][j] === `${playerIndex === 0 ? 'A' : 'B'}-${charName}`) {
                    charPos = [i, j];
                    break;
                }
            }
            if (charPos) break;
        }

        if (!charPos) return false; // Character doesn't exist

        let newPos;
        switch (type) {
            case 'P':
                newPos = this.movePawn(charPos, direction, playerIndex);
                break;
            case 'H':
                if (number === '1') {
                    newPos = this.moveHero1(charPos, direction, playerIndex);
                } else if (number === '2') {
                    newPos = this.moveHero2(charPos, direction, playerIndex);
                } else if (number === '3') {
                    newPos = this.moveHero3(charPos, direction, playerIndex);
                }
                break;
        }

        if (!newPos) return false; // Invalid move

        // Move the character and remove any opponent's character at the destination
        const capturedPiece = this.board[newPos[0]][newPos[1]];
        this.board[newPos[0]][newPos[1]] = this.board[charPos[0]][charPos[1]];
        this.board[charPos[0]][charPos[1]] = null;

        this.currentTurn = (this.currentTurn + 1) % 2;
        
        const result = { success: true, capturedPiece };
        
        // Add move to history
        const lastMove = {
            player: playerIndex === 0 ? 'A' : 'B',
            move: move
        };
        if (capturedPiece) {
            lastMove.captured = capturedPiece;
        }
        this.addMoveToHistory(lastMove);
        
        return result;
    }

    movePawn(pos, direction, playerIndex) {
        const [row, col] = pos;
        const newPos = this.getNewPosition(row, col, direction, 1, playerIndex);
        if (!this.isValidPosition(newPos) || this.isOccupiedByFriendly(newPos, playerIndex)) return null;
        return newPos;
    }

    moveHero1(pos, direction, playerIndex) {
        const [row, col] = pos;
        const newPos = this.getNewPosition(row, col, direction, 2, playerIndex);
        if (!this.isValidPosition(newPos) || this.isOccupiedByFriendly(newPos, playerIndex)) return null;
        this.removeOpponentsInPath(pos, newPos, playerIndex);
        return newPos;
    }

    moveHero2(pos, direction, playerIndex) {
        const [row, col] = pos;
        let newPos;
        switch (direction) {
            case 'FL': newPos = [row - 2, col - 2]; break;
            case 'FR': newPos = [row - 2, col + 2]; break;
            case 'BL': newPos = [row + 2, col - 2]; break;
            case 'BR': newPos = [row + 2, col + 2]; break;
            default: return null;
        }
        if (!this.isValidPosition(newPos) || this.isOccupiedByFriendly(newPos, playerIndex)) return null;
        this.removeOpponentsInPath(pos, newPos, playerIndex);
        return newPos;
    }

    moveHero3(pos, direction, playerIndex) {
        const [row, col] = pos;
        let newPos;
        switch (direction) {
            case 'FL': newPos = [row - 2, col - 1]; break;
            case 'FR': newPos = [row - 2, col + 1]; break;
            case 'BL': newPos = [row + 2, col - 1]; break;
            case 'BR': newPos = [row + 2, col + 1]; break;
            case 'RF': newPos = [row - 1, col + 2]; break;
            case 'RB': newPos = [row + 1, col + 2]; break;
            case 'LF': newPos = [row - 1, col - 2]; break;
            case 'LB': newPos = [row + 1, col - 2]; break;
            default: return null;
        }
        if (!this.isValidPosition(newPos) || this.isOccupiedByFriendly(newPos, playerIndex)) return null;
        // Hero3 only removes opponent at the final position, so we don't need to call removeOpponentsInPath
        return newPos;
    }

    getNewPosition(row, col, direction, steps, playerIndex) {
        const isPlayerA = playerIndex === 0;
        switch (direction) {
            case 'L': return [row, col - steps];
            case 'R': return [row, col + steps];
            case 'F': return [row + (isPlayerA ? steps : -steps), col];
            case 'B': return [row + (isPlayerA ? -steps : steps), col];
            default: return null;
        }
    }

    isValidPosition([row, col]) {
        return row >= 0 && row < 5 && col >= 0 && col < 5;
    }

    isOccupiedByFriendly([row, col], playerIndex) {
        const cell = this.board[row][col];
        return cell && cell.startsWith(playerIndex === 0 ? 'A' : 'B');
    }

    removeOpponentsInPath(start, end, playerIndex) {
        const [startRow, startCol] = start;
        const [endRow, endCol] = end;
        const rowStep = Math.sign(endRow - startRow);
        const colStep = Math.sign(endCol - startCol);
        let currentRow = startRow + rowStep;
        let currentCol = startCol + colStep;

        while (currentRow !== endRow || currentCol !== endCol) {
            if (this.board[currentRow][currentCol] && !this.isOccupiedByFriendly([currentRow, currentCol], playerIndex)) {
                this.board[currentRow][currentCol] = null;
            }
            currentRow += rowStep;
            currentCol += colStep;
        }
    }

    checkWinner() {
        const players = ['A', 'B'];
        for (let player of players) {
            if (!this.board.some(row => row.some(cell => cell && cell.startsWith(player)))) {
                return players.find(p => p !== player);
            }
        }
        return null;
    }

    addChatMessage(sender, message) {
        const chatMessage = { sender, message, timestamp: new Date() };
        this.chatHistory.push(chatMessage);
        return chatMessage;
    }

    addMoveToHistory(move) {
        this.moveHistory.push(move);
    }
}

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('createGame', () => {
        const gameId = Math.random().toString(36).substr(2, 5);
        games.set(gameId, new Game(gameId));
        socket.join(gameId);
        socket.emit('gameCreated', gameId);
    });

    socket.on('joinGame', (gameId) => {
        const game = games.get(gameId);
        if (game && game.addPlayer(socket.id)) {
            socket.join(gameId);
            socket.emit('gameJoined', gameId);
            if (game.players.length === 2) {
                io.to(gameId).emit('gameReady', game.players);
            }
        } else {
            socket.emit('gameJoinError', 'Game not found or full');
        }
    });

    socket.on('spectateGame', (gameId) => {
        const game = games.get(gameId);
        if (game) {
            game.addSpectator(socket.id);
            socket.join(gameId);
            socket.emit('spectatingGame', {
                gameId: gameId,
                board: game.board,
                chatHistory: game.chatHistory,
                moveHistory: game.moveHistory
            });
            socket.to(gameId).emit('spectatorJoined', socket.id);
        } else {
            socket.emit('spectateError', 'Game not found');
        }
    });

    socket.on('initializeBoard', ({ gameId, characters }) => {
        const game = games.get(gameId);
        if (game) {
            const playerIndex = game.players.indexOf(socket.id);
            game.initializeBoard(playerIndex, characters);
            if (game.board[0].every(cell => cell !== null) && game.board[4].every(cell => cell !== null)) {
                io.to(gameId).emit('gameStart', game.board);
            }
        }
    });

    socket.on('move', ({ gameId, move }) => {
        const game = games.get(gameId);
        if (game && game.players[game.currentTurn] === socket.id) {
            const playerIndex = game.players.indexOf(socket.id);
            const result = game.makeMove(playerIndex, move);
            if (result.success) {
                const lastMove = {
                    player: playerIndex === 0 ? 'A' : 'B',
                    move: move
                };
                if (result.capturedPiece) {
                    lastMove.captured = result.capturedPiece;
                }
                io.to(gameId).emit('gameUpdate', {
                    board: game.board,
                    lastMove: lastMove
                });
                const winner = game.checkWinner();
                if (winner) {
                    io.to(gameId).emit('gameOver', winner);
                }
            } else {
                socket.emit('invalidMove', 'Invalid move. Please try again.');
            }
        } else {
            socket.emit('invalidMove', 'It\'s not your turn or the game doesn\'t exist.');
        }
    });

    socket.on('chatMessage', ({ gameId, message }) => {
        const game = games.get(gameId);
        if (game) {
            const sender = game.players.includes(socket.id) ? 
                (game.players.indexOf(socket.id) === 0 ? 'Player 1' : 'Player 2') : 
                'Spectator';
            const chatMessage = game.addChatMessage(sender, message);
            io.to(gameId).emit('chatUpdate', chatMessage);
        }
    });

    socket.on('backToHome', (gameId) => {
        const game = games.get(gameId);
        if (game) {
            io.to(gameId).emit('backToHome');
            games.delete(gameId);
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
        games.forEach((game, gameId) => {
            if (game.players.includes(socket.id)) {
                // Handle player disconnection
                io.to(gameId).emit('playerDisconnected', socket.id);
            } else if (game.spectators.has(socket.id)) {
                game.removeSpectator(socket.id);
                io.to(gameId).emit('spectatorLeft', socket.id);
            }
        });
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));