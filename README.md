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
![Screenshot 2024-08-27 082214](https://github.com/user-attachments/assets/ef80a6c6-4b14-47f1-b356-ad3179766641)

### Code generation:
<img width="960" alt="image" src="https://github.com/user-attachments/assets/16dad257-d9fe-4f0a-babb-0b24321ed1d1">

### After joining the game with code:
<img width="960" alt="image" src="https://github.com/user-attachments/assets/86d44b95-ee03-4686-95d4-559f8846dcec">

### Starting the game:
<img width="960" alt="image" src="https://github.com/user-attachments/assets/93d2254a-f544-4dc0-92c1-5c241e792dd3">
<img width="960" alt="image" src="https://github.com/user-attachments/assets/b1552fa6-bf3a-4d96-9861-2eda6f96e204">

### During the Game:
<img width="960" alt="image" src="https://github.com/user-attachments/assets/339faa21-7afb-45a1-a930-bf34222d8d94">
<img width="960" alt="image" src="https://github.com/user-attachments/assets/bbba011a-26a1-46d0-9145-4044e4c9eb55">
<img width="960" alt="image" src="https://github.com/user-attachments/assets/a23f55a0-3a15-4004-974c-8cd108031e52">

### After Winning the game:
<img width="960" alt="win" src="https://github.com/user-attachments/assets/eb669245-1751-4bd4-8e3e-ecde9ae227a0">
<img width="960" alt="win3" src="https://github.com/user-attachments/assets/7ae47b95-a382-4e86-909e-edda0f213071">
<img width="960" alt="win2" src="https://github.com/user-attachments/assets/eade9fd9-c99f-42c8-ba59-623d126543c2">







