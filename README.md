# Turn-Based Chess-Like Game

## Overview

This project is a turn-based chess-like game played on a 5x5 grid, designed with a server-client architecture. The game involves two players who control a team of characters with distinct movement patterns, competing to eliminate all of the opponent's characters.

## Features

- **Real-Time Gameplay**: Utilizes WebSockets for real-time communication between the server and clients.
- **Interactive UI**: A web-based user interface for an engaging gaming experience.
- **Character Variety**: Players can choose from different types of characters, each with unique movement and combat abilities.
- **Dynamic Game Flow**: Alternating turns, combat mechanics, and game state updates are all handled efficiently.

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js with WebSocket for real-time communication

## Installation and Setup

### Prerequisites

- Node.js (Ensure Node.js is installed on your machine)

### Steps to Run the Project

## Setup Instructions
1. Clone the repository.
2. Install dependencies using `npm install`after navigating in project directory.
3. Run the server with `node app.js` in VS Code.
4. Open your browser and navigate to http://localhost:3000 to start playing the game.

## How to Play

### Game Setup
- The game is played between two players on a 5x5 grid.
- Players arrange their characters on their respective starting rows.
- Each player controls a team of 5 characters, choosing from Pawns, Hero1, Hero2, and Hero3.

### Characters and Movement

1. **Pawn**: Moves one block in any direction.
   - Move commands: `L` (Left), `R` (Right), `F` (Forward), `B` (Backward)
   
2. **Hero1**: Moves two blocks straight in any direction, eliminating any character in its path.
   - Move commands: `L`, `R`, `F`, `B`
   
3. **Hero2**: Moves two blocks diagonally in any direction, eliminating any character in its path.
   - Move commands: `FL` (Forward-Left), `FR` (Forward-Right), `BL` (Backward-Left), `BR` (Backward-Right)

4. **Hero3**: Moves two blocks straight and one block to the side in a single turn, eliminating only the character at its final landing position.
   - Move commands:
     - `FL` (2 steps Forward, 1 step Left)
     - `FR` (2 steps Forward, 1 step Right)
     - `BL` (2 steps Backward, 1 step Left)
     - `BR` (2 steps Backward, 1 step Right)
     - `RF` (2 steps Right, 1 step Forward)
     - `RB` (2 steps Right, 1 step Backward)
     - `LF` (2 steps Left, 1 step Forward)
     - `LB` (2 steps Left, 1 step Backward)

### Game Flow
- **Turns**: Players alternate turns, making one move per turn.
- **Combat**: Moving into an opponent's space removes their character.
- **Winning**: The game ends when one player eliminates all opponent characters.

## Bonus Features

- **Additional Character Types**: Introduce Hero3 with unique movement patterns.
- **Team Composition**: Allow players to choose different team setups.
- **Spectator Mode**: Enable others to watch ongoing games.
- **In-Game Chat**: Communicate with your opponent during the game.


