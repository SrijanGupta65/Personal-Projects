def print_board(board):
    """Display the tic-tac-toe board with a nice visual format."""
    print("\n")
    print("     |     |     ")
    print(f"  {board[0]}  |  {board[1]}  |  {board[2]}  ")
    print("     |     |     ")
    print("-----+-----+-----")
    print("     |     |     ")
    print(f"  {board[3]}  |  {board[4]}  |  {board[5]}  ")
    print("     |     |     ")
    print("-----+-----+-----")
    print("     |     |     ")
    print(f"  {board[6]}  |  {board[7]}  |  {board[8]}  ")
    print("     |     |     ")
    print("\n")


def print_positions():
    """Show the position numbers for reference."""
    print("\nPosition numbers:")
    print("     |     |     ")
    print("  1  |  2  |  3  ")
    print("     |     |     ")
    print("-----+-----+-----")
    print("     |     |     ")
    print("  4  |  5  |  6  ")
    print("     |     |     ")
    print("-----+-----+-----")
    print("     |     |     ")
    print("  7  |  8  |  9  ")
    print("     |     |     ")
    print("\n")


def check_winner(board):
    """Check if there's a winner."""
    # All possible winning combinations
    win_combinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],  # Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8],  # Columns
        [0, 4, 8], [2, 4, 6]              # Diagonals
    ]

    for combo in win_combinations:
        if board[combo[0]] == board[combo[1]] == board[combo[2]] != ' ':
            return board[combo[0]]
    return None


def is_board_full(board):
    """Check if the board is full (tie game)."""
    return ' ' not in board


def get_available_moves(board):
    """Return list of available positions (0-indexed)."""
    return [i for i in range(9) if board[i] == ' ']


def evaluate_board(board):
    """Evaluate the board state. Returns +10 for AI win, -10 for human win, 0 for tie/ongoing."""
    winner = check_winner(board)
    if winner == 'O':  # AI wins
        return 10
    elif winner == 'X':  # Human wins
        return -10
    return 0


def minimax(board, depth, is_maximizing):
    """
    Minimax algorithm to find the optimal move.
    - is_maximizing: True if AI's turn (O), False if human's turn (X)
    - Returns the best score achievable from this state
    """
    score = evaluate_board(board)

    # Terminal states
    if score == 10:  # AI won
        return score - depth  # Prefer faster wins
    if score == -10:  # Human won
        return score + depth  # Prefer slower losses
    if is_board_full(board):  # Tie
        return 0

    if is_maximizing:
        # AI's turn - maximize score
        best_score = -1000
        for move in get_available_moves(board):
            board[move] = 'O'
            score = minimax(board, depth + 1, False)
            board[move] = ' '  # Undo move
            best_score = max(best_score, score)
        return best_score
    else:
        # Human's turn - minimize score (assume optimal play)
        best_score = 1000
        for move in get_available_moves(board):
            board[move] = 'X'
            score = minimax(board, depth + 1, True)
            board[move] = ' '  # Undo move
            best_score = min(best_score, score)
        return best_score


def get_ai_move(board):
    """Use minimax algorithm to find the best move for AI (O)."""
    print("AI is thinking...")
    best_score = -1000
    best_move = None

    for move in get_available_moves(board):
        board[move] = 'O'
        score = minimax(board, 0, False)
        board[move] = ' '  # Undo move

        if score > best_score:
            best_score = score
            best_move = move

    print(f"AI chose position {best_move + 1} (score: {best_score})")
    return best_move


def get_player_move(board, player):
    """Get a valid move from the player."""
    while True:
        try:
            move = input(f"Player {player}, enter position (1-9): ")
            move = int(move)

            if move < 1 or move > 9:
                print("Please enter a number between 1 and 9.")
                continue

            # Convert to 0-indexed
            index = move - 1

            if board[index] != ' ':
                print("That position is already taken. Choose another.")
                continue

            return index
        except ValueError:
            print("Invalid input. Please enter a number between 1 and 9.")
        except KeyboardInterrupt:
            print("\n\nGame cancelled.")
            exit(0)


def play_game():
    """Main game loop."""
    print("\n=== TIC TAC TOE ===")
    print("\nChoose game mode:")
    print("1. Player vs Player")
    print("2. Player vs AI (you are X, AI is O)")

    while True:
        try:
            mode = input("\nEnter 1 or 2: ")
            if mode in ['1', '2']:
                ai_mode = (mode == '2')
                break
            print("Please enter 1 or 2.")
        except KeyboardInterrupt:
            print("\n\nGame cancelled.")
            exit(0)

    board = [' '] * 9
    current_player = 'X'

    print_positions()
    if ai_mode:
        print("You are X, AI is O. You go first!")
    else:
        print("Let's play! X goes first.")

    while True:
        # Display current board
        print_board(board)

        # Get move (either from player or AI)
        if ai_mode and current_player == 'O':
            move = get_ai_move(board)
        else:
            move = get_player_move(board, current_player)

        board[move] = current_player

        # Check for winner
        winner = check_winner(board)
        if winner:
            print_board(board)
            if ai_mode:
                if winner == 'X':
                    print("🎉 You win! Great job! 🎉")
                else:
                    print("AI wins! Better luck next time!")
            else:
                print(f"🎉 Player {winner} wins! 🎉")
            break

        # Check for tie
        if is_board_full(board):
            print_board(board)
            print("It's a tie! Good game!")
            break

        # Switch players
        current_player = 'O' if current_player == 'X' else 'X'

    # Ask to play again
    play_again = input("\nPlay again? (y/n): ").lower()
    if play_again == 'y':
        play_game()
    else:
        print("Thanks for playing!")


if __name__ == "__main__":
    play_game()
