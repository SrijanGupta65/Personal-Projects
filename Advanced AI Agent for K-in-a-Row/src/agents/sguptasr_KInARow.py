'''
sguptasr_KInARow.py
Authors: Gupta, Srijan
CSE 415, University of Washington
'''

from src.agents.agent_base import KAgent
from src.core.game_types import State, Game_Type
import time
import random

AUTHORS = 'Gupta, Srijan'
UWNETIDS = ['sguptasr']

class OurAgent(KAgent):

    def __init__(self, twin=False):
        self.twin = twin
        self.nickname = 'Sage'
        if twin: self.nickname = 'Sage-Twin'
        self.long_name = 'Strategic Sage'
        if twin: self.long_name = 'Strategic Sage II'
        self.persona = 'strategic and analytical'
        self.voice_info = {'Chrome': 10, 'Firefox': 2, 'other': 0}
        self.playing = "don't know yet"
        self.alpha_beta_cutoffs_this_turn = 0
        self.num_static_evals_this_turn = 0
        self.zobrist_table_num_entries_this_turn = 0
        self.zobrist_table_num_hits_this_turn = 0
        self.current_game_type = None
        self.playing_mode = KAgent.DEMO

        self.my_past_utterances = []
        self.opponent_past_utterances = []
        self.game_history = []
        self.utt_count = 0
        self.opponent_nickname = ""
        self.time_limit = 1.0
        self.last_move_time = 0
        self.last_move_stats = {}

    def introduce(self):
        intro = '\nGreetings! I am the Strategic Sage.\n'
        intro += 'Created by Srijan Gupta (sguptasr)\n'
        intro += 'I use minimax search with alpha-beta pruning to analyze the board.\n'
        intro += 'My static evaluation considers threats, opportunities, and strategic positioning.\n'
        if self.twin:
            intro += 'As the twin, I shall provide an equally strategic challenge!\n'
        intro += 'May the best strategist win!\n'
        return intro

    def prepare(self, game_type, what_side_to_play, opponent_nickname,
                expected_time_per_move=0.1, utterances_matter=True):
        self.playing = what_side_to_play
        self.opponent_nickname = opponent_nickname
        self.time_limit = expected_time_per_move
        self.current_game_type = game_type
        self.my_past_utterances = []
        self.opponent_past_utterances = []
        self.game_history = []
        self.utt_count = 0

        if self.twin:
            self.utt_count = 3

        return "OK"

    def make_move(self, current_state, current_remark, time_limit=1000,
                  use_alpha_beta=True, use_zobrist_hashing=False, max_ply=3,
                  special_static_eval_fn=None):
        self.alpha_beta_cutoffs_this_turn = 0
        self.num_static_evals_this_turn = 0
        self.zobrist_table_num_entries_this_turn = 0
        self.zobrist_table_num_hits_this_turn = 0

        start_time = time.time()

        if current_remark and current_remark.strip():
            self.opponent_past_utterances.append(current_remark)

        possible_moves = self.get_successors_and_moves(current_state)

        if not possible_moves or len(possible_moves[0]) == 0:
            return [[None, current_state], "I have no legal moves!"]

        states, moves = possible_moves

        if special_static_eval_fn:
            eval_fn = lambda state, game_type=None: special_static_eval_fn(state)
        else:
            eval_fn = self.static_eval

        if use_alpha_beta and not special_static_eval_fn:
            state_evals = []
            for i, state in enumerate(states):
                eval_score = eval_fn(state, self.current_game_type)
                state_evals.append((eval_score, i))

            is_maximizing = (current_state.whose_move == 'X')
            state_evals.sort(reverse=is_maximizing)

            sorted_indices = [idx for _, idx in state_evals]
            states = [states[i] for i in sorted_indices]
            moves = [moves[i] for i in sorted_indices]

        best_move = None
        best_state = None
        best_score = float('-inf') if current_state.whose_move == 'X' else float('inf')

        alpha = float('-inf')
        beta = float('inf')

        for i, (state, move) in enumerate(zip(states, moves)):
            if time.time() - start_time > time_limit * 0.9:
                break

            if use_alpha_beta:
                score = self.minimax(state, max_ply - 1, True,
                                   alpha, beta, eval_fn)[0]
            else:
                score = self.minimax(state, max_ply - 1, False,
                                   None, None, eval_fn)[0]

            if current_state.whose_move == 'X':
                if score > best_score:
                    best_score = score
                    best_move = move
                    best_state = state
                if use_alpha_beta:
                    alpha = max(alpha, score)
            else:
                if score < best_score:
                    best_score = score
                    best_move = move
                    best_state = state
                if use_alpha_beta:
                    beta = min(beta, score)

        if best_move is None:
            best_move = moves[0]
            best_state = states[0]

        self.last_move_time = time.time() - start_time
        self.last_move_stats = {
            'score': best_score,
            'time': self.last_move_time,
            'cutoffs': self.alpha_beta_cutoffs_this_turn,
            'static_evals': self.num_static_evals_this_turn,
            'zobrist_entries': self.zobrist_table_num_entries_this_turn,
            'zobrist_hits': self.zobrist_table_num_hits_this_turn
        }

        self.game_history.append({
            'state': current_state,
            'move': best_move,
            'new_state': best_state,
            'opponent_remark': current_remark
        })

        utterance = self.generate_utterance(current_state, best_state, best_move, current_remark)
        self.my_past_utterances.append(utterance)

        if self.playing_mode == KAgent.AUTOGRADER:
            stats = [self.alpha_beta_cutoffs_this_turn,
                    self.num_static_evals_this_turn,
                    self.zobrist_table_num_entries_this_turn,
                    self.zobrist_table_num_hits_this_turn]
            return [[best_move, best_state] + stats, utterance]
        else:
            return [[best_move, best_state], utterance]

    def minimax(self, state, depth_remaining, pruning=False,
                alpha=None, beta=None, eval_fn=None, current_depth=0):
        if eval_fn is None:
            eval_fn = self.static_eval

        # Check if terminal (win/loss/draw)
        if self.is_terminal(state):
            score = eval_fn(state, self.current_game_type)
            self.num_static_evals_this_turn += 1
            # Prefer faster wins and slower losses
            if score > 0:
                score = score - current_depth
            elif score < 0:
                score = score + current_depth
            return [score]

        # For small boards (tic-tac-toe), search to completion
        is_small_board = self.current_game_type and self.current_game_type.n * self.current_game_type.m <= 9

        if not is_small_board and depth_remaining == 0:
            # For larger boards, respect depth limit
            score = eval_fn(state, self.current_game_type)
            self.num_static_evals_this_turn += 1
            return [score]
        # For small boards, continue searching regardless of depth_remaining

        successors, moves = self.get_successors_and_moves(state)

        if not successors or len(successors) == 0:
            score = eval_fn(state, self.current_game_type)
            self.num_static_evals_this_turn += 1
            return [score]

        is_maximizing = (state.whose_move == 'X')

        if is_maximizing:
            max_eval = float('-inf')
            for successor in successors:
                eval = self.minimax(successor, depth_remaining - 1, pruning,
                                  alpha, beta, eval_fn, current_depth + 1)[0]
                max_eval = max(max_eval, eval)

                if pruning and alpha is not None:
                    alpha = max(alpha, eval)
                    if beta is not None and beta <= alpha:
                        self.alpha_beta_cutoffs_this_turn += 1
                        break
            return [max_eval]
        else:
            min_eval = float('inf')
            for successor in successors:
                eval = self.minimax(successor, depth_remaining - 1, pruning,
                                  alpha, beta, eval_fn, current_depth + 1)[0]
                min_eval = min(min_eval, eval)

                if pruning and beta is not None:
                    beta = min(beta, eval)
                    if alpha is not None and beta <= alpha:
                        self.alpha_beta_cutoffs_this_turn += 1
                        break
            return [min_eval]

    def static_eval(self, state, game_type=None):
        """Evaluate state from X's perspective (higher is better for X)."""
        if game_type is None:
            game_type = self.current_game_type

        if game_type is None:
            return 0

        board = state.board
        k = game_type.k
        n = game_type.n
        m = game_type.m

        x_win_score = self.check_win(board, 'X', k, n, m)
        o_win_score = self.check_win(board, 'O', k, n, m)

        if x_win_score > 0:
            return 10000
        if o_win_score > 0:
            return -10000

        score = 0

        for length in range(2, k + 1):
            x_sequences = self.count_sequences(board, 'X', length, k, n, m)
            o_sequences = self.count_sequences(board, 'O', length, k, n, m)

            weight = (length ** 2) * 10

            if length == k - 1:
                weight *= 5

            score += weight * x_sequences
            score -= weight * o_sequences

        center_i = n // 2
        center_j = m // 2
        if board[center_i][center_j] == 'X':
            score += 5
        elif board[center_i][center_j] == 'O':
            score -= 5

        return score

    def check_win(self, board, player, k, n, m):
        """Check if a player has k in a row."""
        directions = [(0, 1), (1, 0), (1, 1), (1, -1)]

        for i in range(n):
            for j in range(m):
                if board[i][j] == player:
                    for di, dj in directions:
                        count = 1
                        ni, nj = i + di, j + dj
                        while 0 <= ni < n and 0 <= nj < m and board[ni][nj] == player:
                            count += 1
                            if count >= k:
                                return 1
                            ni += di
                            nj += dj
        return 0

    def count_sequences(self, board, player, length, k, n, m):
        """Count sequences that could potentially become k in a row."""
        count = 0
        directions = [(0, 1), (1, 0), (1, 1), (1, -1)]

        for i in range(n):
            for j in range(m):
                if board[i][j] == player:
                    for di, dj in directions:
                        sequence_count = 1
                        open_ends = 0

                        ni, nj = i + di, j + dj
                        while 0 <= ni < n and 0 <= nj < m and sequence_count < length:
                            if board[ni][nj] == player:
                                sequence_count += 1
                            elif board[ni][nj] == ' ':
                                open_ends += 1
                                break
                            else:
                                break
                            ni += di
                            nj += dj

                        if 0 <= ni < n and 0 <= nj < m and board[ni][nj] == ' ':
                            open_ends += 1

                        ni, nj = i - di, j - dj
                        if 0 <= ni < n and 0 <= nj < m and board[ni][nj] == ' ':
                            open_ends += 1

                        if sequence_count == length and open_ends > 0:
                            count += 1

        return count

    def is_terminal(self, state):
        """Check if the state is terminal."""
        if state.finished:
            return True

        # Check if someone has won
        if self.current_game_type:
            k = self.current_game_type.k
            n = self.current_game_type.n
            m = self.current_game_type.m
            board = state.board

            # Check for win
            if self.check_win(board, 'X', k, n, m) or self.check_win(board, 'O', k, n, m):
                return True

        # Check if board is full (draw)
        board = state.board
        for row in board:
            for cell in row:
                if cell == ' ':
                    return False
        return True

    def get_successors_and_moves(self, state):
        """Generate all legal successor states and moves."""
        moves = []
        new_states = []
        board = state.board
        n = len(board)
        m = len(board[0])
        other_player = 'O' if state.whose_move == 'X' else 'X'

        for i in range(n):
            for j in range(m):
                if board[i][j] == ' ':
                    new_state = State(old=state)
                    new_state.board[i][j] = state.whose_move
                    new_state.whose_move = other_player
                    moves.append((i, j))
                    new_states.append(new_state)

        return [new_states, moves]

    def generate_utterance(self, old_state, new_state, move, opponent_remark):
        """Generate contextual utterances based on game state."""
        if opponent_remark:
            remark_lower = opponent_remark.lower()

            if "tell me how you did that" in remark_lower or "how did you do that" in remark_lower:
                return self.explain_last_move()

            if "take on the game" in remark_lower or "game so far" in remark_lower:
                return self.analyze_game_so_far()

        utterances = []

        eval_score = self.last_move_stats.get('score', 0)

        if abs(eval_score) > 5000:
            if eval_score > 0 and self.playing == 'X':
                utterances.append("I see victory within my grasp!")
            elif eval_score < 0 and self.playing == 'O':
                utterances.append("The endgame approaches in my favor!")
            else:
                utterances.append("This is a challenging position...")
        elif abs(eval_score) > 1000:
            utterances.append(f"Moving to ({move[0]}, {move[1]}) strengthens my position significantly.")
        else:
            utterances.append(f"I place my piece at ({move[0]}, {move[1]}).")

        personality_utterances = [
            "A calculated risk, but strategically sound.",
            "Let's see how you respond to this positioning.",
            "Control of the center often determines the outcome.",
            "Every move brings us closer to the conclusion.",
            "Strategic depth requires looking several moves ahead.",
            "The best defense is sometimes a strong offense.",
            "Patience and planning are the keys to victory.",
        ]

        if self.utt_count % 3 == 0 and len(self.game_history) > 2:
            utterances.append(random.choice(personality_utterances))

        self.utt_count += 1

        return " ".join(utterances)

    def explain_last_move(self):
        """Explain the statistics of the last move."""
        stats = self.last_move_stats

        explanation = f"Excellent question! Here's how I computed my last move:\n"
        explanation += f"- Evaluation score: {stats.get('score', 'N/A')}\n"
        explanation += f"- Time spent: {stats.get('time', 0):.4f} seconds\n"
        explanation += f"- States evaluated statically: {stats.get('static_evals', 0)}\n"
        explanation += f"- Alpha-beta cutoffs: {stats.get('cutoffs', 0)}\n"

        if stats.get('cutoffs', 0) > 0:
            explanation += f"The cutoffs saved significant computation by pruning {stats.get('cutoffs', 0)} branches.\n"

        explanation += "This analysis helped me choose the strategically optimal move."

        return explanation

    def analyze_game_so_far(self):
        """Provide analysis of the game history."""
        if len(self.game_history) == 0:
            return "The game has just begun! No analysis available yet."

        analysis = f"Interesting question! Let me analyze the game so far:\n"
        analysis += f"We've completed {len(self.game_history)} moves. "

        if len(self.game_history) >= 3:
            recent_moves = self.game_history[-3:]
            analysis += "In the last few moves, "

            if self.playing == 'X':
                analysis += "I've been building strategic positioning in the center region. "
            else:
                analysis += "I've been establishing defensive positions to counter threats. "

        current_state = self.game_history[-1]['new_state']
        eval_score = self.static_eval(current_state, self.current_game_type)

        if abs(eval_score) > 1000:
            if (eval_score > 0 and self.playing == 'X') or (eval_score < 0 and self.playing == 'O'):
                analysis += f"Based on my evaluation (score: {eval_score}), I predict I will win if I continue playing optimally."
            else:
                analysis += f"The position is challenging for me (score: {eval_score}), but there's still opportunity for a comeback."
        else:
            analysis += "The game is quite balanced at this point. Victory will depend on who makes the next critical mistake."

        return analysis
