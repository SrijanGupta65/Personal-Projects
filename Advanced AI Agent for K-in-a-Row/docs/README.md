# K-in-a-Row Game Showcase

An interactive K-in-a-Row game system with AI agents and customizable game modes.

## Quick Start

Run the game with:
```bash
python3 Game_Master_Offline.py
```

## Features

### 1. HTML Transcript Generation
When prompted, choose whether to generate an HTML file of the game transcript. The HTML file will include:
- Complete move history
- Visual board states
- Player utterances
- Game result

### 2. Game Modes

Choose from 4 different game modes:

**1. Tic-Tac-Toe**
- Classic 3-in-a-row on a 3x3 board
- Quick games, perfect for testing

**2. Five-in-a-Row**
- 5-in-a-row on a 7x7 board
- Corner squares are forbidden (marked with '-')
- Tournament configuration

**3. Cassini**
- 5-in-a-row on a 7x8 board
- Includes "Saturn" obstacles that cannot be crossed
- Pre-placed pieces add complexity

**4. Custom**
- Choose your own board size (rows x columns)
- Choose your own k value (how many in a row to win)
- System validates that board is large enough for k value
- Perfect for experimenting with different game variants

### 3. Game Type Options

Choose who plays:

**1. Player vs AI**
- You play as X (first player)
- Strategic Sage AI plays as O (second player)
- Enter moves as 'row,col' format (e.g., '2,3')
- Board positions are 0-indexed

**2. Random player vs AI**
- Random player plays as X (first player)
- Strategic Sage AI plays as O (second player)
- Watch how the AI responds to random moves

**3. AI vs AI**
- Strategic Sage AI plays as X (first player)
- SportsCaster AI plays as O (second player)
- Tournament-style matchup between two intelligent agents

## File Contents

### Core System Files
- `Game_Master_Offline.py` - Main game runner with interactive setup
- `game_types.py` - Game mode definitions (TTT, FIAR, Cassini)
- `agent_base.py` - Base class for AI agents
- `winTesterForK.py` - Win detection logic
- `gameToHTML.py` - HTML transcript generator

### Image Assets
- `X32.png` - X piece image
- `O32.png` - O piece image
- `gray32.png` - Empty square image
- `black32.png` - Forbidden/obstacle square image

### AI Agents
- `sguptasr_KInARow.py` - Strategic Sage AI (minimax with alpha-beta pruning)
- `RandomPlayer.py` - Random move AI
- `kchua220_KInARow.py` - SportsCaster AI (friend's agent)

## Example Play Sessions

### Playing as Human vs AI
```
python3 Game_Master_Offline.py

Do you want to generate an HTML transcript? (y/n): y
Select a game mode:
1. Tic-Tac-Toe
2. Five-in-a-Row
3. Cassini
4. Custom
Enter your choice (1-4): 1

Select game type:
1. Player vs AI
2. Random player vs AI
3. AI vs AI
Enter your choice (1-3): 1

[Game starts - you enter moves as '0,0', '1,2', etc.]
```

### Creating a Custom 4x4 Board with 4-in-a-Row
```
python3 Game_Master_Offline.py

Do you want to generate an HTML transcript? (y/n): n
Select a game mode:
1. Tic-Tac-Toe
2. Five-in-a-Row
3. Cassini
4. Custom
Enter your choice (1-4): 4

Custom Game Configuration:
Enter k (how many in a row to win): 4
Enter number of rows: 4
Enter number of columns: 4

Select game type:
1. Player vs AI
2. Random player vs AI
3. AI vs AI
Enter your choice (1-3): 2

[Game starts with your custom configuration]
```

## AI Agent Features

### Strategic Sage AI (sguptasr_KInARow.py)
- **Algorithm**: Minimax with alpha-beta pruning
- **Static Evaluation**: Counts sequences and evaluates strategic positions
- **Dialog System**: Context-aware utterances based on game state
  - Detects blocking moves
  - Recognizes threats
  - Varies responses to prevent repetition
- **Extra Features**:
  - Child ordering by static evaluation
  - Move explanation on request
  - Game analysis capabilities

### SportsCaster AI (kchua220_KInARow.py)
- **Persona**: Energetic sports commentator
- **Features**: Entertaining commentary with varied expressions
- **Style**: Enthusiastic play-by-play narration

## Notes

- All game boards use 0-indexed positions (top-left is 0,0)
- HTML transcripts are saved in the current directory
- Human player always plays as X (first player)
- The game validates all moves for legality
- Forbidden squares (marked '-') cannot be played on
- Games end on win or when board is full (draw)

## Requirements

- Python 3.x
- All files must be in the same directory
- No external dependencies required

## Credits

- Base game system: University of Washington CSE 415
- Strategic Sage AI: Srijan Gupta (sguptasr)
- SportsCaster AI: Kevin Chua (kchua220)
- Game Master modifications: Srijan Gupta

---

Enjoy playing K-in-a-Row!
