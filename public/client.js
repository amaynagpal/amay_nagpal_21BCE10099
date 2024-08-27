const socket = io();

const gameControls = document.getElementById('gameControls');
const gameInfo = document.getElementById('gameInfo');
const gameBoard = document.getElementById('gameBoard');
const moveOptions = document.getElementById('moveOptions');
const moveHistory = document.getElementById('moveHistory');
const gameStatus = document.getElementById('gameStatus');
const chatContainer = document.getElementById('chatContainer');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendChatBtn = document.getElementById('sendChatBtn');

const createGameBtn = document.getElementById('createGame');
const joinGameBtn = document.getElementById('joinGame');
const spectateGameBtn = document.getElementById('spectateGame');
const gameIdInput = document.getElementById('gameIdInput');
const backToHomeBtn = document.getElementById('backToHomeBtn');

let currentGame = null;
let playerIndex = null;
let isMyTurn = false;
let selectedCharacter = null;
let moveCount = 0;
let isSpectator = false;

createGameBtn.addEventListener('click', () => {
    socket.emit('createGame');
});

joinGameBtn.addEventListener('click', () => {
    const gameId = gameIdInput.value.trim();
    if (gameId) {
        socket.emit('joinGame', gameId);
    } else {
        alert('Please enter a valid Game ID');
    }
});

spectateGameBtn.addEventListener('click', () => {
    const gameId = gameIdInput.value.trim();
    if (gameId) {
        socket.emit('spectateGame', gameId);
    } else {
        alert('Please enter a valid Game ID to spectate');
    }
});

backToHomeBtn.addEventListener('click', () => {
    if (currentGame) {
        socket.emit('backToHome', currentGame);
    }
    resetGameState();
});

sendChatBtn.addEventListener('click', sendChatMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendChatMessage();
    }
});

function sendChatMessage() {
    const message = chatInput.value.trim();
    if (message && currentGame) {
        socket.emit('chatMessage', { gameId: currentGame, message: message });
        chatInput.value = '';
    }
}

socket.on('gameCreated', (gameId) => {
    updateGameStatus(`Game created. Game ID: ${gameId}`);
    currentGame = gameId;
});

socket.on('gameJoined', (gameId) => {
    updateGameStatus(`Joined game: ${gameId}`);
    currentGame = gameId;
});

socket.on('gameJoinError', (error) => {
    updateGameStatus(`Error: ${error}`);
});

socket.on('spectatingGame', (data) => {
    currentGame = data.gameId;
    isSpectator = true;
    renderBoard(data.board);
    updateGameStatus(`Spectating game: ${data.gameId}`);
    gameControls.style.display = 'none';
    chatContainer.style.display = 'block';
    
    moveHistory.innerHTML = '';
    moveCount = 0;
    
    if (data.moveHistory) {
        data.moveHistory.forEach(move => updateMoveHistory(move));
    }
});

socket.on('spectateError', (error) => {
    updateGameStatus(`Error: ${error}`);
});

socket.on('gameReady', (players) => {
    playerIndex = players.indexOf(socket.id);
    updateGameStatus(`Game ready. You are Player ${playerIndex + 1}. Set up your characters.`);
    gameControls.style.display = 'none';
    chatContainer.style.display = 'block';
    setupCharacters();
});

socket.on('gameStart', (board) => {
    renderBoard(board);
    isMyTurn = playerIndex === 0;
    updateTurnInfo();
    updateGameStatus('Game Started');
});

socket.on('gameUpdate', (data) => {
    renderBoard(data.board);
    if (!isSpectator) {
        isMyTurn = !isMyTurn;
        updateTurnInfo();
    }
    updateMoveHistory(data.lastMove);
});

socket.on('invalidMove', (message) => {
    updateGameStatus(`Invalid move: ${message}. Try again.`);
});

socket.on('gameOver', (winner) => {
    updateGameStatus(`Game Over! Player ${winner} wins!`);
    isMyTurn = false;
    backToHomeBtn.style.display = 'block';
});

socket.on('chatUpdate', (chatMessage) => {
    addChatMessage(chatMessage);
});

socket.on('playerDisconnected', (playerId) => {
    updateGameStatus(`Player disconnected. Game ended.`);
    isMyTurn = false;
});

socket.on('backToHome', () => {
    resetGameState();
});

function addChatMessage(chatMessage) {
    const messageElement = document.createElement('div');
    messageElement.className = 'chat-message';
    messageElement.textContent = `${chatMessage.sender}: ${chatMessage.message}`;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function setupCharacters() {
    gameBoard.innerHTML = '';
    const setupInfo = document.createElement('div');
    setupInfo.textContent = 'Enter your 5 characters (P for Pawn, H1 for Hero1, H2 for Hero2, H3 for Hero3) separated by commas:';
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'e.g., P,P,H1,H2,H3';
    const button = document.createElement('button');
    button.textContent = 'Set up';
    button.addEventListener('click', () => {
        const characters = input.value.split(',').map(c => c.trim());
        if (characters.length === 5 && characters.every(c => ['P', 'H1', 'H2', 'H3'].includes(c))) {
            socket.emit('initializeBoard', { gameId: currentGame, characters });
        } else {
            alert('Invalid setup. Please enter 5 valid characters.');
        }
    });
    gameBoard.appendChild(setupInfo);
    gameBoard.appendChild(input);
    gameBoard.appendChild(button);
}

function renderBoard(board) {
    gameBoard.innerHTML = '';
    board.forEach((row, i) => {
        row.forEach((cell, j) => {
            const cellElement = document.createElement('div');
            cellElement.className = 'cell';
            if (cell) {
                const [player, type] = cell.split('-');
                cellElement.textContent = type;
                cellElement.setAttribute('data-player', player);
            }
            cellElement.addEventListener('click', () => handleCellClick(i, j, cell));
            gameBoard.appendChild(cellElement);
        });
    });
}

function handleCellClick(row, col, cell) {
    if (!isMyTurn || isSpectator) return;

    if (selectedCharacter) {
        makeMove(selectedCharacter, row, col);
        selectedCharacter = null;
    } else if (cell && cell.startsWith(playerIndex === 0 ? 'A' : 'B')) {
        selectCharacter(row, col, cell);
    }
}

function selectCharacter(row, col, character) {
    selectedCharacter = { row, col, character };
    showMoveOptions(character);
}

function showMoveOptions(character) {
    moveOptions.innerHTML = '';
    const [playerPrefix, charType] = character.split('-');
    let moves;

    if (charType.startsWith('P')) {
        moves = ['L', 'R', 'F', 'B'];
    } else if (charType === 'H1') {
        moves = ['L', 'R', 'F', 'B'];
    } else if (charType === 'H2') {
        moves = ['FL', 'FR', 'BL', 'BR'];
    } else if (charType === 'H3') {
        moves = ['FL', 'FR', 'BL', 'BR', 'RF', 'RB', 'LF', 'LB'];
    }

    moves.forEach(move => {
        const button = document.createElement('button');
        button.textContent = move;
        button.addEventListener('click', () => makeMove(selectedCharacter, null, null, move));
        moveOptions.appendChild(button);
    });
}

function makeMove(selected, targetRow, targetCol, moveDirection) {
    let move;
    if (moveDirection) {
        move = `${selected.character.split('-')[1]}:${moveDirection}`;
    } else {
        const rowDiff = targetRow - selected.row;
        const colDiff = targetCol - selected.col;
        const direction = getDirection(rowDiff, colDiff, selected.character.split('-')[1]);
        if (!direction) {
            alert('Invalid move');
            return;
        }
        move = `${selected.character.split('-')[1]}:${direction}`;
    }
    
    socket.emit('move', { gameId: currentGame, move });
    moveOptions.innerHTML = '';
}

function getDirection(rowDiff, colDiff, charType) {
    const isPlayerA = playerIndex === 0;
    if (charType.startsWith('P')) {
        if (Math.abs(rowDiff) + Math.abs(colDiff) !== 1) return null;
        if (rowDiff === (isPlayerA ? -1 : 1)) return 'F';
        if (rowDiff === (isPlayerA ? 1 : -1)) return 'B';
        if (colDiff === -1) return 'L';
        if (colDiff === 1) return 'R';
    } else if (charType === 'H1') {
        if (Math.abs(rowDiff) + Math.abs(colDiff) !== 2) return null;
        if (rowDiff === (isPlayerA ? -2 : 2)) return 'F';
        if (rowDiff === (isPlayerA ? 2 : -2)) return 'B';
        if (colDiff === -2) return 'L';
        if (colDiff === 2) return 'R';
    } else if (charType === 'H2') {
        if (Math.abs(rowDiff) !== 2 || Math.abs(colDiff) !== 2) return null;
        if (rowDiff === (isPlayerA ? -2 : 2) && colDiff === -2) return 'FL';
        if (rowDiff === (isPlayerA ? -2 : 2) && colDiff === 2) return 'FR';
        if (rowDiff === (isPlayerA ? 2 : -2) && colDiff === -2) return 'BL';
        if (rowDiff === (isPlayerA ? 2 : -2) && colDiff === 2) return 'BR';
    } else if (charType === 'H3') {
        if (Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 1) {
            if (rowDiff === (isPlayerA ? -2 : 2) && colDiff === -1) return 'FL';
            if (rowDiff === (isPlayerA ? -2 : 2) && colDiff === 1) return 'FR';
            if (rowDiff === (isPlayerA ? 2 : -2) && colDiff === -1) return 'BL';
            if (rowDiff === (isPlayerA ? 2 : -2) && colDiff === 1) return 'BR';
        } else if (Math.abs(rowDiff) === 1 && Math.abs(colDiff) === 2) {
            if (rowDiff === (isPlayerA ? -1 : 1) && colDiff === 2) return 'RF';
            if (rowDiff === (isPlayerA ? 1 : -1) && colDiff === 2) return 'RB';
            if (rowDiff === (isPlayerA ? -1 : 1) && colDiff === -2) return 'LF';
            if (rowDiff === (isPlayerA ? 1 : -1) && colDiff === -2) return 'LB';
        }
    }
    return null;
}

function updateGameStatus(message) {
    gameStatus.textContent = message;
}

function updateTurnInfo() {
    updateGameStatus(isMyTurn ? "It's your turn" : "Waiting for opponent's move");
}

function updateMoveHistory(lastMove) {
    if (lastMove) {
        moveCount++;
        const moveEntry = document.createElement('div');
        moveEntry.textContent = `${moveCount}. ${lastMove.player === 'A' ? 'Player 1' : 'Player 2'}: ${lastMove.move}`;
        if (lastMove.captured) {
            moveEntry.textContent += ` (Captured ${lastMove.captured})`;
            moveEntry.style.color = '#e74c3c'; // Highlight captures in red
        }
        moveHistory.appendChild(moveEntry);
        moveHistory.scrollTop = moveHistory.scrollHeight;
    }
}

function resetGameState() {
    currentGame = null;
    playerIndex = null;
    isMyTurn = false;
    selectedCharacter = null;
    moveCount = 0;
    isSpectator = false;
    gameBoard.innerHTML = '';
    moveOptions.innerHTML = '';
    moveHistory.innerHTML = '';
    chatMessages.innerHTML = '';
    backToHomeBtn.style.display = 'none';
    gameControls.style.display = 'block';
    chatContainer.style.display = 'none';
    updateGameStatus('Welcome to the game! Create or join a game to start playing.');
}