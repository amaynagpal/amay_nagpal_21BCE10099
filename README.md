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
- One player clicks the "Create Game" button, which generates a unique game code.
- The other player and spectators can join the game using the generated code.

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


## Game Pictures
### Landing page:
<img width="960" alt="image" src="https://github.com/user-attachments/assets/fb17095f-dc48-4c7f-9032-ac2e0f316ca7">

### Code generation:
<img width="960" alt="image" src="https://github.com/user-attachments/assets/76a7d94b-38ed-4a72-a9b1-19efc857b17b">

### After joining the game with code:
<img width="960" alt="image" src="https://github.com/user-attachments/assets/7f81a2d1-561e-4418-8c6a-81bfc8554c4e">

### Starting the game:
<img width="960" alt="image" src="https://github.com/user-attachments/assets/819e2ca8-d439-42d0-8279-a28355627532">
<img width="960" alt="image" src="https://github.com/user-attachments/assets/ee8a120a-be9c-4cbb-a31d-057f1744616a">

### During the Game:
<img width="960" alt="image" src="https://github.com/user-attachments/assets/8544d820-18e8-4e3a-9e52-7dde459f2175">
<img width="960" alt="image" src="https://github.com/user-attachments/assets/bc928ebb-18c5-47e1-b4d0-039bba603b43">
<img width="960" alt="image" src="https://github.com/user-attachments/assets/1bc35958-8510-4d44-a491-867db807afbf">

### After Winning the game:
<img width="960" alt="win" src="https://github.com/user-attachments/assets/95d129f5-7813-41da-bd0b-a322d73295e1">
<img width="960" alt="win3" src="https://github.com/user-attachments/assets/40e9c7a2-0c57-4122-9002-53becf461146">
<img width="960" alt="win2" src="https://github.com/user-attachments/assets/642116c8-662e-4bb9-b5df-96562fa3a602">





