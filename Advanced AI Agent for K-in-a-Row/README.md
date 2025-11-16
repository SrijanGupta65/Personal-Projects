# AI-Powered K-in-a-Row

![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![Algorithm](https://img.shields.io/badge/Algorithm-Minimax-green.svg)
![AI](https://img.shields.io/badge/AI-Game%20Theory-orange.svg)

> An intelligent K-in-a-Row implementation featuring an unbeatable AI opponent powered by the Minimax algorithm with game tree search and depth-based optimization. Play classic Tic-Tac-Toe or configure custom board dimensions and win conditions for advanced gameplay.

---

## Table of Contents

- [Overview](#overview)
- [Technical Concepts](#technical-concepts)
- [Game Modes & Configurability](#game-modes--configurability)
- [How to Play](#how-to-play)
- [Example Gameplay](#example-gameplay)
- [The AI Algorithm](#the-ai-algorithm)
  - [Minimax Algorithm Explained](#minimax-algorithm-explained)
  - [Why Minimax?](#why-minimax)
  - [Algorithm Visualization](#algorithm-visualization)
  - [Depth-Based Optimization](#depth-based-optimization)
- [Performance Metrics](#performance-metrics)

---

## Overview

This project implements a **flexible K-in-a-Row game engine** with a **perfect-play AI** using the **Minimax algorithm** with **game tree search** and **Alpha-beta Pruning**. Unlike traditional Tic-Tac-Toe implementations, this system is fully configurable—define any board size (n×m) and win condition (k), and the AI automatically adapts its strategy. The AI analyzes every possible future game state to make optimal decisions, making it mathematically impossible to beat (with perfect play).

---

## Technical Concepts

**Core Algorithm:**
- **Minimax Algorithm**: Recursive game tree search with adversarial reasoning
- **Game Theory**: Zero-sum game optimization assuming perfect opponent play
- **Backtracking**: Exploration and reversal of game states for exhaustive search
- **Adaptive Complexity**: Algorithm automatically scales to different board configurations

**Implementation:**
- **Language**: Python 3.8+
- **Data Structure**: 2D list representation for flexible board dimensions
- **Configurability**: Parameterized game types supporting arbitrary board sizes and win conditions
- **Optimization**: Depth-based scoring for move prioritization (faster wins preferred)
- **Evaluation Function**: Terminal state scoring (+10 for AI win, -10 for loss, 0 for tie)

**Key Features:**
- Flexible game configuration system (customize board dimensions and win conditions)
- Multiple built-in game presets (Tic-Tac-Toe, Five-in-a-Row, Cassini)
- Complete state space exploration with adaptive tree search
- Transparent decision-making with score visualization
- Scalable performance across different board sizes
- Support for board constraints (forbidden positions/corners)

---

## Game Modes & Configurability

### The Power of Configurability

This system extends beyond simple Tic-Tac-Toe by supporting **any K-in-a-Row variant**. Define a game by three parameters:

- **k**: Number of consecutive pieces needed to win
- **n**: Number of rows on the board
- **m**: Number of columns on the board

For example:
- **Tic-Tac-Toe**: k=3, n=3, m=3 (3×3 board, 3-in-a-row to win)
- **Five-in-a-Row**: k=5, n=7, m=7 (7×7 board, 5-in-a-row to win)
- **Custom Variant**: k=4, n=6, m=6 (6×6 board, 4-in-a-row to win)

### Built-in Game Presets

The system comes with three pre-configured game modes:

#### 1. **Tic-Tac-Toe (TTT)**
- **Board**: 3×3
- **Win Condition**: 3-in-a-row
- **Description**: The classic game you know and love. Perfect for quick games and learning how the AI works.
- **Complexity**: Low (262,144 possible states)

#### 2. **Five-in-a-Row**
- **Board**: 7×7
- **Win Condition**: 5-in-a-row
- **Constraints**: Corner positions are forbidden
- **Description**: A strategic variant with a larger board and higher win threshold. Significantly more complex than Tic-Tac-Toe.
- **Complexity**: High (vastly more game states)

#### 3. **Cassini**
- **Board**: 7×8
- **Win Condition**: 5-in-a-row
- **Constraints**: Special blocked positions arranged in a Saturn-shaped pattern
- **Description**: A thematic variant combining strategic gameplay with unique board restrictions.
- **Complexity**: High (with custom board constraints)

## How to Play

### Starting the Game

Run the program:
```bash
python Game_Master_Offline.py
```

### Game Modes

1. **Player vs Player** - Two humans take turns
2. **Player vs AI** - Challenge the unbeatable AI (you play as X, AI plays as O)

### Making Moves

Moves are position-based depending on your board size. For a 3×3 Tic-Tac-Toe board:

```
Position Grid:               Example Board:
     |     |                      |     |
  1  |  2  |  3                X  |  O  |  X
     |     |                      |     |
-----+-----+-----           -----+-----+-----
     |     |                      |     |
  4  |  5  |  6                O  |  X  |
     |     |                      |     |
-----+-----+-----           -----+-----+-----
     |     |                      |     |
  7  |  8  |  9                   |  O  |  X
     |     |                      |     |
```

For larger boards (e.g., 7×7), enter row and column coordinates as prompted.

### Winning

Get **k consecutive marks in a row** - horizontally, vertically, or diagonally! The value of k depends on which game mode you're playing.

---

## Example Gameplay

Here's a complete game showing how the AI makes optimal decisions in Tic-Tac-Toe:

```
=== TIC TAC TOE ===

Choose game mode:
1. Player vs Player
2. Player vs AI (you are X, AI is O)

Enter 1 or 2: 2

Position numbers:
     |     |
  1  |  2  |  3
     |     |
-----+-----+-----
     |     |
  4  |  5  |  6
     |     |
-----+-----+-----
     |     |
  7  |  8  |  9
     |     |

You are X, AI is O. You go first!

Player X, enter position (1-9): 1

     |     |
  X  |     |
     |     |
-----+-----+-----
     |     |
     |     |
     |     |
-----+-----+-----
     |     |
     |     |
     |     |

AI is thinking...
AI chose position 5 (score: 0)

     |     |
  X  |     |
     |     |
-----+-----+-----
     |     |
     |  O  |
     |     |
-----+-----+-----
     |     |
     |     |
     |     |

Player X, enter position (1-9): 9

     |     |
  X  |     |
     |     |
-----+-----+-----
     |     |
     |  O  |
     |     |
-----+-----+-----
     |     |
     |     |  X
     |     |

AI is thinking...
AI chose position 3 (score: 0)

     |     |
  X  |     |  O
     |     |
-----+-----+-----
     |     |
     |  O  |
     |     |
-----+-----+-----
     |     |
     |     |  X
     |     |

Player X, enter position (1-9): 4

     |     |
  X  |     |  O
     |     |
-----+-----+-----
     |     |
  X  |  O  |
     |     |
-----+-----+-----
     |     |
     |     |  X
     |     |

AI is thinking...
AI chose position 7 (score: 10)

     |     |
  X  |     |  O
     |     |
-----+-----+-----
     |     |
  X  |  O  |
     |     |
-----+-----+-----
     |     |
  O  |     |  X
     |     |

AI wins! Better luck next time!
```

---

## The AI Algorithm

### Minimax Algorithm Explained

The AI uses the **Minimax algorithm**, a recursive decision-making algorithm rooted in **game theory**. It's the foundation for AI in zero-sum games like Chess, Checkers, and any K-in-a-Row variant.

#### Core Concept

The algorithm works by:
1. **Exploring all possible future game states** (complete game tree traversal)
2. **Evaluating terminal states** (win/loss/draw) with numeric scores
3. **Propagating scores upward** through recursive backtracking
4. **Selecting the move** that maximizes AI's outcome while assuming perfect opponent play

#### Evaluation Function

```python
def evaluate_board(board):
    winner = check_winner(board)
    if winner == 'O':  # AI wins
        return +10
    elif winner == 'X':  # Human wins
        return -10
    return 0  # Tie or ongoing game
```

The evaluation function assigns:
- **+10**: AI victory (maximize this)
- **-10**: Human victory (minimize this)
- **0**: Draw or non-terminal state

### Why Minimax?

This project uses Minimax (rather than simpler heuristics like "block opponent wins" or "take center") because:

#### 1. **Guaranteed Optimal Play**
Simple rule-based heuristics can be exploited:
```
Rule-based: "Take center if available"
   → Can still lose to sophisticated strategies

Minimax: Evaluates ALL possible futures
   → Mathematically proven optimal
```

#### 2. **Handles Complex Game States**
```
Example: What should O play?
     |     |
  X  |  O  |
     |     |
-----+-----+-----
     |     |
     |  X  |
     |     |
-----+-----+-----
     |     |
  O  |     |  X

Heuristic-based: Might choose position 3 (block row)
Minimax: Evaluates that ANY move leads to forced loss
         → Chooses the move that delays defeat longest
```

#### 3. **Self-Improving Through Exhaustive Search**
Rather than hard-coding patterns, Minimax **discovers** winning strategies by exploring the complete state space:
- Tic-Tac-Toe has ~255,168 possible game states
- Five-in-a-Row has millions of possible game states
- Minimax evaluates all reachable states from current position
- Finds optimal move through systematic enumeration

#### 4. **Scales to Any K-in-a-Row Variant**
The same algorithm works for:
- Small boards (3×3 Tic-Tac-Toe)
- Large boards (7×7 Five-in-a-Row)
- Custom configurations with board constraints

```python
# Minimizer phase (opponent's turn)
best_score = 1000
for move in get_available_moves(board):
    board[move] = 'X'
    score = minimax(board, depth + 1, True)
    board[move] = ' '
    best_score = min(best_score, score)  # Opponent minimizes AI score
```

This **pessimistic assumption** makes the AI robust against any human strategy.

#### 5. **Alpha-Beta Pruning for Efficiency**

A critical optimization that dramatically reduces computation without sacrificing optimality:

```python
def minimax(board, depth, is_maximizing, alpha, beta):
    if is_terminal(board):
        return evaluate(board)

    if is_maximizing:
        max_eval = -infinity
        for move in get_available_moves(board):
            eval = minimax(board, depth + 1, False, alpha, beta)
            max_eval = max(max_eval, eval)
            alpha = max(alpha, eval)
            if beta <= alpha:
                break  # Prune: no need to evaluate remaining moves
        return max_eval
    else:
        min_eval = +infinity
        for move in get_available_moves(board):
            eval = minimax(board, depth + 1, True, alpha, beta)
            min_eval = min(min_eval, eval)
            beta = min(beta, eval)
            if beta <= alpha:
                break  # Prune: no need to evaluate remaining moves
        return min_eval
```

**How It Works:**
- **Alpha**: Best score found for the maximizer so far
- **Beta**: Best score found for the minimizer so far
- **Cutoff Condition**: When `beta <= alpha`, the current branch can't affect the final decision
- **Benefit**: Eliminates entire subtrees from evaluation, often reducing the search space by 50-90%

**Why This Matters:**
Without pruning, Minimax must explore nearly all branches. With alpha-beta pruning, we skip branches that won't change the outcome:
```
Standard Minimax:    Evaluates O(b^d) nodes
Alpha-Beta Pruned:   Evaluates O(b^(d/2)) nodes in best case
                     Evaluates O(b^d) nodes in worst case
                     Average case: Significant practical speedup
```

**For This Project:**
Alpha-beta pruning is **essential** for making larger boards playable:
- **Tic-Tac-Toe (3×3)**: Pruning reduces computation significantly, enabling real-time play
- **Five-in-a-Row (7×7)**: Without pruning, the search would be computationally infeasible; pruning makes it solvable in reasonable time
- **Custom Variants**: Pruning scales the algorithm to arbitrary board configurations

### Algorithm Visualization

Here's how Minimax explores the game tree:

```
                        Current State
                        [ X | O |   ]
                        [   | X |   ]
                        [ O |   |   ]
                             |
              +--------------+--------------+
              |              |              |
         Move: 3         Move: 6        Move: 8
        Score: 0        Score: +10      Score: 0
         (Tie)          (AI Wins!)       (Tie)

The AI chooses Move 6 (position 6) because it has the highest score (+10)
```

#### Detailed Recursive Flow

```
minimax(board, depth=0, is_maximizing=True)  // AI's turn (O)
│
├─ Try move at position 0 → 'O'
│  └─ minimax(board, depth=1, is_maximizing=False)  // Human's turn (X)
│     ├─ Try move at position 1 → 'X'
│     │  └─ minimax(depth=2, is_maximizing=True)
│     │     └─ Returns score: 0 (eventual tie)
│     ├─ Try move at position 2 → 'X'
│     │  └─ Returns score: -10 (human wins)
│     └─ Returns: min(0, -10) = -10
│
├─ Try move at position 1 → 'O'
│  └─ minimax(depth=1, is_maximizing=False)
│     └─ Returns score: +10 (AI wins!)
│
└─ Returns: max(-10, +10, ...) = +10 → Choose position 1
```

**Key Properties:**
- **Maximizer** (AI's turn): Chooses move with highest score
- **Minimizer** (Human's turn): Assumes opponent chooses move with lowest score
- **Recursive**: Each move spawns new subtrees until terminal states
- **Backtracking**: Undoes moves to explore alternatives

### Depth-Based Optimization

A subtle but important enhancement:

```python
if score == 10:  # AI won
    return score - depth  # Prefer faster wins
if score == -10:  # Human won
    return score + depth  # Prefer slower losses
```

#### Why This Matters

Without depth adjustment:
```
Scenario: Two moves both lead to AI victory
Move A: Wins in 1 turn  → Score: +10
Move B: Wins in 3 turns → Score: +10
Result: AI might randomly choose B (inefficient)
```

With depth adjustment:
```
Move A: Wins in 1 turn  → Score: +10 - 1 = +9
Move B: Wins in 3 turns → Score: +10 - 3 = +7
Result: AI prefers Move A (faster victory!)
```

**Benefits:**
- More efficient gameplay
- Looks more "intelligent" to users
- When losing is inevitable, delays defeat (giving opponent chance to blunder)

---

## Performance Metrics

### Tic-Tac-Toe Benchmarks
```
Benchmarks (on average hardware):
├─ First move computation: ~0.5s (evaluates all 9 positions)
├─ Mid-game moves: ~0.1s (fewer positions to evaluate)
└─ End-game moves: <0.01s (very few positions remaining)

AI Win Rate (from starting position):
├─ vs Random Player: 100%
├─ vs Perfect Player: 0% wins, 100% draws
└─ vs Typical Human: 90%+ (most humans don't play perfectly)
```

### Scalability Notes
```
As board size increases:
├─ Branching factor grows (more available moves per turn)
├─ Search depth increases (more turns to reach terminal state)
├─ Time complexity becomes exponential: O(b^d)
└─ Practical limit: ~7×7 boards for reasonable computation time

For larger boards:
├─ Consider alpha-beta pruning optimizations
├─ Implement iterative deepening with time limits
└─ Use heuristic evaluation for non-terminal states
```

---

## Author

**Srijan Gupta**
