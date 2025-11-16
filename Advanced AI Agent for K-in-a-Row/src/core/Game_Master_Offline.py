'''GameMasterOffline.py based on GameMaster.py

 Updated Oct. 29, 2025. Previously updated
 Jan. 30, 2025 and Nov. 17, 2024.
 See the test function at the end for how to customize
 the runs: choice of games and agents.

(C) University of Washington and S. Tanimoto, 2025.

'''

from time import sleep
USE_HTML = True
if USE_HTML: from src.utils import gameToHTML

from src.core.winTesterForK import winTesterForK

from src.core.game_types import TTT, FIAR, Cassini, State, Game_Type

TIME_PER_MOVE = 1.0 # In seconds
INITIAL_STATE = TTT.initial_state
ALLOW_CERTAIN_IMPORTS = True

# Establish global variables, with defaults for now.
K = None
N = None
M = None
TURN_LIMIT = None

# To be called from WebGameAgent if using the web:
def set_game(game_type):
    global K, GAME_TYPE, TURN_LIMIT, N, M, INITIAL_STATE
    K = game_type.k
    N = game_type.n
    M = game_type.m
    GAME_TYPE = game_type
    TURN_LIMIT = game_type.turn_limit
    INITIAL_STATE = game_type.initial_state

PLAYERX = None
PLAYERO = None
def set_players(px, po):
    global PLAYERX, PLAYERO
    PLAYERX = px
    PLAYERO = po

FINISHED = False
def runGame():
    currentState = INITIAL_STATE
    player1 = PLAYERX
    player2 = PLAYERO

    if USE_HTML:
        gameToHTML.startHTML(player1.nickname, player2.nickname, GAME_TYPE.short_name, 1)

    # Prepare players silently (suppress output)
    import sys
    import io
    old_stdout = sys.stdout
    sys.stdout = io.StringIO()

    try:
        p1comment = player1.prepare(GAME_TYPE, 'X', player2.nickname)
    except Exception as e:
        sys.stdout = old_stdout
        report = 'Player 1 ('+player1.nickname+' failed to prepare, and loses by default.'
        renderCommentary(report)
        if USE_HTML: gameToHTML.reportResult(report)
        report = 'Congratulations to Player 2 ('+player2.nickname+')!'
        renderCommentary(report)
        if USE_HTML: gameToHTML.reportResult(report)
        if USE_HTML: gameToHTML.endHTML()
        return
    try:
        p2comment = player2.prepare(GAME_TYPE, 'O', player1.nickname)
    except Exception as e:
        sys.stdout = old_stdout
        report = 'Player 2 ('+player2.nickname+' failed to prepare, and loses by default.'
        renderCommentary(report)
        if USE_HTML: gameToHTML.reportResult(report)
        report = 'Congratulations to Player 1 ('+player1.nickname+')!'
        renderCommentary(report)
        if USE_HTML: gameToHTML.reportResult(report)
        if USE_HTML: gameToHTML.endHTML()
        return

    # Restore stdout
    sys.stdout = old_stdout

    currentRemark = "The game is starting."
    if USE_HTML: gameToHTML.stateToHTML(currentState)
    XsTurn = True
    name = None
    global FINISHED
    FINISHED = False
    turnCount = 0
    printState(currentState)
    while not FINISHED:
        who = currentState.whose_move
        if XsTurn:
            playerResult = player1.make_move(currentState, currentRemark, TIME_PER_MOVE)
            name = player1.nickname
            XsTurn = False
        else:
            playerResult = player2.make_move(currentState, currentRemark, TIME_PER_MOVE)
            name = player2.nickname
            XsTurn = True
        moveAndState, currentRemark = playerResult
        if moveAndState==None:
            FINISHED = True; continue
        move, currentState = moveAndState
        moveReport = "Move is by "+who+" to "+str(move)
        renderCommentary(moveReport)
        utteranceReport = name +' says: '+currentRemark
        renderCommentary(utteranceReport)
        if USE_HTML: gameToHTML.reportResult(moveReport)
        if USE_HTML: gameToHTML.reportResult(utteranceReport)
        possibleWin = winTesterForK(currentState, move, K)
        if possibleWin != "No win":
            FINISHED = True
            currentState.finished = True
            printState(currentState)
            if USE_HTML: gameToHTML.stateToHTML(currentState, finished=True)
            renderCommentary(possibleWin)
            if USE_HTML: gameToHTML.reportResult(possibleWin)
            if USE_HTML: gameToHTML.endHTML()
            return
        printState(currentState)
        if USE_HTML: gameToHTML.stateToHTML(currentState)
        turnCount += 1
        if turnCount == TURN_LIMIT: FINISHED=True
        else:
            sleep(WAIT_TIME_AFTER_MOVES) # NOT TOO FAST.
    printState(currentState)
    if USE_HTML: gameToHTML.stateToHTML(currentState)
    who = currentState.whose_move
    renderCommentary("Game over; it's a draw.")
    if USE_HTML: gameToHTML.reportResult("Game Over; it's a draw")
    if USE_HTML: gameToHTML.endHTML()

def printState(s):
    global FINISHED
    board = s.board
    who = s.whose_move
    horizontalBorder = "+"+3*M*"-"+"+"
    renderCommentary(horizontalBorder)
    for row in board:
        line = "|"
        for item in row:
            line += " "+item+" "
        line += "|"
        renderCommentary(line)
    renderCommentary(horizontalBorder)
    if not FINISHED:
      renderCommentary("It is "+who+"'s turn to move.\n")

# Temporary function.  Remove when other channels are working.
def renderCommentary(stuff):
    print(stuff)

def render_move_and_state(move, state):
   # NOTE: THIS DEFN WILL BE OVERWRITTEN WHEN USED ON THE WEB.
   print(move, state)

def render_utterance(who, utterance):
   # NOTE: THIS DEFN WILL BE OVERWRITTEN WHEN USED ON THE WEB.
   print(who+' says: '+utterance)

# Not used in offline version:
#def async_runGame():
#    fut = ensure_future(runGame())

WAIT_TIME_AFTER_MOVES = 0.01
def set_wait_time(t):
    global WAIT_TIME_AFTER_MOVES
    WAIT_TIME_AFTER_MOVES = float(t)

# Human Player Class
class HumanPlayer:
    def __init__(self):
        self.nickname = "Human Player"
        self.game_type = None
        self.side = None

    def introduce(self):
        return "I am a human player!"

    def prepare(self, game_type, side, opponent_nickname):
        self.game_type = game_type
        self.side = side
        return "Ready to play!"

    def make_move(self, current_state, opponent_remark, time_limit):
        """Get move from human player via console input."""
        print("\n" + "="*50)
        print(f"Your turn! You are playing as {self.side}")
        print("="*50)

        board = current_state.board
        n = len(board)
        m = len(board[0])

        while True:
            try:
                move_input = input(f"Enter your move as 'row,col' (0-{n-1}, 0-{m-1}): ").strip()

                parts = move_input.split(',')
                if len(parts) != 2:
                    print("Invalid format. Please use 'row,col' format (e.g., '2,3')")
                    continue

                i = int(parts[0].strip())
                j = int(parts[1].strip())

                # Check if move is within bounds
                if i < 0 or i >= n or j < 0 or j >= m:
                    print(f"Move out of bounds! Please enter row 0-{n-1} and col 0-{m-1}")
                    continue

                # Check if position is available
                if board[i][j] != ' ':
                    print(f"Position ({i},{j}) is already occupied! Choose another position.")
                    continue

                # Make the move
                from src.core.game_types import State
                new_state = State(old=current_state)
                new_state.board[i][j] = self.side
                new_state.change_turn()

                utterance = f"I place my piece at ({i}, {j})."

                return ((i, j), new_state), utterance

            except ValueError:
                print("Invalid input! Please enter numbers only (e.g., '2,3')")
            except KeyboardInterrupt:
                print("\nGame interrupted by user.")
                return None, "Game interrupted."
            except Exception as e:
                print(f"Error: {e}. Please try again.")

def interactive_setup():
    """Interactive setup for the game."""
    print("\n" + "="*60)
    print("Welcome to K-in-a-Row Game!")
    print("="*60)

    # 1. Ask about HTML transcript
    global USE_HTML
    while True:
        html_choice = input("\nDo you want to generate an HTML transcript? (y/n): ").strip().lower()
        if html_choice in ['y', 'yes']:
            USE_HTML = True
            print("HTML transcript will be generated.")
            break
        elif html_choice in ['n', 'no']:
            USE_HTML = False
            print("No HTML transcript will be generated.")
            break
        else:
            print("Invalid choice. Please enter 'y' or 'n'.")

    # 2. Ask about game mode
    print("\n" + "-"*60)
    print("Select a game mode:")
    print("1. Tic-Tac-Toe (3-in-a-row on 3x3 board)")
    print("2. Five-in-a-Row (5-in-a-row on 7x7 board, corners forbidden)")
    print("3. Cassini (5-in-a-row on 7x8 board with obstacles)")
    print("4. Custom (choose your own board size and k value)")
    print("-"*60)

    game_type = None
    while True:
        try:
            mode_choice = input("Enter your choice (1-4): ").strip()

            if mode_choice == '1':
                game_type = TTT
                print(f"Selected: {TTT.long_name}")
                break
            elif mode_choice == '2':
                game_type = FIAR
                print(f"Selected: {FIAR.long_name}")
                break
            elif mode_choice == '3':
                game_type = Cassini
                print(f"Selected: {Cassini.long_name}")
                break
            elif mode_choice == '4':
                # Custom game setup
                print("\nCustom Game Configuration:")
                while True:
                    try:
                        k_val = int(input("Enter k (how many in a row to win): ").strip())
                        if k_val < 3:
                            print("k must be at least 3!")
                            continue
                        break
                    except ValueError:
                        print("Please enter a valid number!")

                while True:
                    try:
                        n_val = int(input("Enter number of rows: ").strip())
                        if n_val < k_val:
                            print(f"Number of rows must be at least {k_val}!")
                            continue
                        break
                    except ValueError:
                        print("Please enter a valid number!")

                while True:
                    try:
                        m_val = int(input("Enter number of columns: ").strip())
                        if m_val < k_val:
                            print(f"Number of columns must be at least {k_val}!")
                            continue
                        break
                    except ValueError:
                        print("Please enter a valid number!")

                # Create custom game type
                custom_initial_state_data = [[[' ' for _ in range(m_val)] for _ in range(n_val)], "X"]
                turn_limit = n_val * m_val
                game_type = Game_Type(
                    f"{k_val}-in-a-Row on {n_val}x{m_val} Board",
                    f"{k_val}-in-a-Row",
                    k_val,
                    n_val,
                    m_val,
                    custom_initial_state_data,
                    turn_limit,
                    1.0
                )
                print(f"Custom game created: {game_type.long_name}")
                break
            else:
                print("Invalid choice. Please enter 1, 2, 3, or 4.")
        except Exception as e:
            print(f"Error: {e}. Please try again.")

    set_game(game_type)

    # 3. Ask about opponent
    print("\n" + "-"*60)
    print("Select game type:")
    print("1. Player vs AI")
    print("2. Random player vs AI")
    print("3. AI vs AI")
    print("-"*60)

    playerX = None
    playerO = None

    while True:
        try:
            opponent_choice = input("Enter your choice (1-3): ").strip()

            if opponent_choice == '1':
                # Human vs AI
                playerX = HumanPlayer()
                from src.agents import sguptasr_KInARow
                playerO = sguptasr_KInARow.OurAgent()
                break
            elif opponent_choice == '2':
                # Random Player vs AI
                from src.agents import RandomPlayer
                from src.agents import sguptasr_KInARow
                playerX = RandomPlayer.OurAgent()
                playerO = sguptasr_KInARow.OurAgent()
                break
            elif opponent_choice == '3':
                # AI vs AI
                from src.agents import sguptasr_KInARow
                from src.agents import kchua220_KInARow
                playerX = sguptasr_KInARow.OurAgent()
                playerO = kchua220_KInARow.OurAgent()
                break
            else:
                print("Invalid choice. Please enter 1, 2, or 3.")
        except ImportError as e:
            print(f"Error importing agent: {e}")
            print("Make sure all agent files are in the same directory.")
            return None
        except Exception as e:
            print(f"Error: {e}. Please try again.")

    set_players(playerX, playerO)
    return True

def test():
    # Interactive test
    print("\n" + "="*60)
    print("K-in-a-Row Game - Interactive Mode")
    print("="*60)

    if interactive_setup():
        print("\n" + "="*60)
        print("Starting the game...")
        print("="*60 + "\n")
        runGame()
        print("\n" + "="*60)
        print("Game finished! Thank you for playing!")
        print("="*60)
    else:
        print("Setup failed. Exiting.")

if __name__ == '__main__':
    test()

