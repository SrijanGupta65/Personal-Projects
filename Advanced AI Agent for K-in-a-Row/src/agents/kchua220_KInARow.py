'''
kchua220_KInARow.py
Authors: Chuang, Kevin


An agent for playing "K-in-a-Row with Forbidden Squares" and related games.
CSE 415, University of Washington


THIS IS A TEMPLATE WITH STUBS FOR THE REQUIRED FUNCTIONS.
YOU CAN ADD WHATEVER ADDITIONAL FUNCTIONS YOU NEED IN ORDER
TO PROVIDE A GOOD STRUCTURE FOR YOUR IMPLEMENTATION.


'''


from src.agents.agent_base import KAgent
from src.core.game_types import State, Game_Type


AUTHORS = 'Chuang, Kevin'
UWNETIDS = ['kchua220'] # The first UWNetID here should
# match the one in the file name, e.g., janiesmith99_KInARow.py.


import time # You'll probably need this to avoid losing a
# game due to exceeding a time limit.


# Create your own type of agent by subclassing KAgent:


class OurAgent(KAgent):  # Keep the class name "OurAgent" so a game master
   # knows how to instantiate your agent class.


   def __init__(self, twin=False):
       super().__init__()
       self.twin = twin
       self.nickname = 'SportsCaster'
       if twin: self.nickname += '2'
       self.long_name = 'The Sports Commentator'
       if twin: self.long_name += ' Junior'
       self.persona = 'enthusiastic sports announcer'
       self.voice_info = {'Chrome': 10, 'Firefox': 2, 'other': 0}
       self.playing = "don't know yet" # e.g., "X" or "O".
       self.alpha_beta_cutoffs_this_turn = 0
       self.num_static_evals_this_turn = 0
       self.zobrist_table_num_entries_this_turn = 0
       self.zobrist_table_num_hits_this_turn = 0
       self.current_game_type = None
       self.playing_mode = KAgent.DEMO
       self.opponent_nickname = None
       self.time_limit = 1.0
       self.start_time = None
       self.zobrist_table = {}
       self.zobrist_random_numbers = None
       self.use_llm = False
       self.llm_model = None
       self.move_history = []


   def introduce(self):
       intro = f'\nWelcome, welcome, welcome! My name is {self.long_name}!\n'
       intro += f'Created by {AUTHORS}.\n'
       intro += 'Get ready for some exciting K-in-a-Row action!\n'
       if self.twin:
           intro += "I'm the color commentator for this match!\n"
       return intro


   # Receive and acknowledge information about the game from
   # the game master:
   def prepare(self, game_type, what_side_to_play, opponent_nickname,
           expected_time_per_move=0.1, utterances_matter=True):
  
       # Extra Credit C: Import LLM API only in DEMO mode when utterances matter
       if utterances_matter and self.playing_mode == KAgent.DEMO:
           try:
               import google.generativeai as genai
              
               API_KEY = "AIzaSyDM7EjB1OmfxP6mwrHV8ywzhnS_ULGV6qM"
               genai.configure(api_key=API_KEY)
               self.llm_model = genai.GenerativeModel('gemini-2.5-flash')
               self.use_llm = True
               print(f"✓ {self.nickname} initialized with Gemini AI for enhanced commentary!")
           except Exception as e:
               print(f"Could not initialize LLM: {e}")
               print(f"{self.nickname} will use standard commentary.")
               self.use_llm = False
       else:
           self.use_llm = False
          
       self.current_game_type = game_type
       self.playing = what_side_to_play
       self.opponent_nickname = opponent_nickname
       self.time_limit = expected_time_per_move
       self.move_history = []  # Reset move history
      
       # Initialize Zobrist random numbers for hashing
       self.initialize_zobrist_table(game_type)
      
       return "OK"
 
   # The core of your agent's ability should be implemented here:            
   def make_move(self, current_state, current_remark, time_limit=1000,
               use_alpha_beta=True,
               use_zobrist_hashing=False, max_ply=3,
               special_static_eval_fn=None,
               use_child_ordering=True):
      
       self.start_time = time.time()
       self.alpha_beta_cutoffs_this_turn = 0
       self.num_static_evals_this_turn = 0
       self.zobrist_table_num_entries_this_turn = 0  # Reset
       self.zobrist_table_num_hits_this_turn = 0     # Reset
      
       # Clear zobrist table at start of each move
       if use_zobrist_hashing:
           self.zobrist_table = {}
      
       # Store the special eval function if provided (for autograder)
       self.special_eval_fn = special_static_eval_fn
      
       # Find all legal moves
       legal_moves = self.get_legal_moves(current_state)
      
       if not legal_moves:
           return [[None, current_state], "No legal moves available!"]
      
       # Order moves if using alpha-beta
       if use_alpha_beta and use_child_ordering:
           ordered_moves = self.order_moves_by_eval(current_state, legal_moves)
       else:
           ordered_moves = legal_moves
      
       # Use minimax to find best move
       best_move = None
       best_score = float('-inf') if current_state.whose_move == 'X' else float('inf')
      
       for move in ordered_moves:
           new_state = self.make_move_on_board(current_state, move)
          
           # Call minimax with zobrist flag
           if use_alpha_beta:
               score, _ = self.minimax(new_state, max_ply - 1, True,
                                   float('-inf'), float('inf'), use_zobrist_hashing)
           else:
               score, _ = self.minimax(new_state, max_ply - 1, False,
                                   None, None, use_zobrist_hashing)
          
           # Choose best move based on player
           if current_state.whose_move == 'X':
               if score > best_score:
                   best_score = score
                   best_move = move
           else:
               if score < best_score:
                   best_score = score
                   best_move = move
      
       # Make the move
       final_state = self.make_move_on_board(current_state, best_move)
      
       # Calculate elapsed time
       elapsed_time = time.time() - self.start_time
      
       # Check if opponent asked for explanation
       if current_remark and "tell me how you did that" in current_remark.lower():
           utterance = self.explain_last_move(best_move, elapsed_time)
       else:
           utterance = self.generate_utterance(current_state, best_move)
      
       # Return format depends on mode
       if self.playing_mode == KAgent.AUTOGRADER:
           stats = [self.alpha_beta_cutoffs_this_turn,
                   self.num_static_evals_this_turn,
                   self.zobrist_table_num_entries_this_turn,
                   self.zobrist_table_num_hits_this_turn]
           return [[best_move, final_state] + stats, utterance]
       else:
           return [[best_move, final_state], utterance]




       # The main adversarial search function:
   def minimax(self, state, depth_remaining, pruning=False, alpha=None, beta=None,
               use_zobrist=False):  # Add this parameter
       """
       Minimax algorithm with optional alpha-beta pruning and Zobrist hashing.
       """
      
       # Check time limit
       if self.start_time and (time.time() - self.start_time) > (self.time_limit * 0.8):
           score = self.static_eval(state, self.current_game_type)
           return [score, None]
      
       # ZOBRIST LOOKUP: Check if we've seen this state before
       if use_zobrist:
           found, cached_score = self.lookup_zobrist(state, depth_remaining)
           if found:
               return [cached_score, None]
      
       # Base case: depth limit or terminal state
       if depth_remaining == 0 or self.is_terminal(state):
           score = self.static_eval(state, self.current_game_type)
          
           # ZOBRIST STORE: Save this evaluation
           if use_zobrist:
               self.store_zobrist(state, score, depth_remaining)
          
           return [score, None]
      
       legal_moves = self.get_legal_moves(state)
      
       if not legal_moves:
           score = self.static_eval(state, self.current_game_type)
          
           if use_zobrist:
               self.store_zobrist(state, score, depth_remaining)
          
           return [score, None]
      
       # Maximizing player (X)
       if state.whose_move == 'X':
           max_score = float('-inf')
           best_move = None
          
           for move in legal_moves:
               new_state = self.make_move_on_board(state, move)
               score, _ = self.minimax(new_state, depth_remaining - 1, pruning,
                                   alpha, beta, use_zobrist)
              
               if score > max_score:
                   max_score = score
                   best_move = move
              
               if pruning and alpha is not None:
                   alpha = max(alpha, score)
                   if beta is not None and beta <= alpha:
                       self.alpha_beta_cutoffs_this_turn += 1
                       break
          
           # ZOBRIST STORE: Save this evaluation
           if use_zobrist:
               self.store_zobrist(state, max_score, depth_remaining)
          
           return [max_score, best_move]
      
       # Minimizing player (O)
       else:
           min_score = float('inf')
           best_move = None
          
           for move in legal_moves:
               new_state = self.make_move_on_board(state, move)
               score, _ = self.minimax(new_state, depth_remaining - 1, pruning,
                                   alpha, beta, use_zobrist)
              
               if score < min_score:
                   min_score = score
                   best_move = move
              
               if pruning and beta is not None:
                   beta = min(beta, score)
                   if alpha is not None and beta <= alpha:
                       self.alpha_beta_cutoffs_this_turn += 1
                       break
          
           # ZOBRIST STORE: Save this evaluation
           if use_zobrist:
               self.store_zobrist(state, min_score, depth_remaining)
          
           return [min_score, best_move]
   def static_eval(self, state, game_type=None):
       """
       Static evaluation function.
       Values should be higher when the states are better for X,
       lower when better for O.
       """
       self.num_static_evals_this_turn += 1
      
       # Use special eval function if provided (autograder mode)
       if self.special_eval_fn:
           return self.special_eval_fn(state, game_type)
      
       # Use game_type parameter if provided, otherwise use instance variable
       gt = game_type if game_type else self.current_game_type
       if not gt:
           return 0
      
       k = gt.k
       board = state.board
       n_rows = len(board)
       n_cols = len(board[0])
      
       # Check for wins
       x_win = self.check_win(state, 'X', k)
       o_win = self.check_win(state, 'O', k)
      
       if x_win:
           return 10000
       if o_win:
           return -10000
      
       # Evaluate based on threats and opportunities
       x_score = 0
       o_score = 0
      
       # Check all possible lines of length k
       for i in range(n_rows):
           for j in range(n_cols):
               # Horizontal lines
               if j <= n_cols - k:
                   x_count, o_count, empty = self.count_line(board, i, j, 0, 1, k)
                   x_score += self.score_line(x_count, o_count, empty, k)
                   o_score += self.score_line(o_count, x_count, empty, k)
              
               # Vertical lines
               if i <= n_rows - k:
                   x_count, o_count, empty = self.count_line(board, i, j, 1, 0, k)
                   x_score += self.score_line(x_count, o_count, empty, k)
                   o_score += self.score_line(o_count, x_count, empty, k)
              
               # Diagonal (down-right)
               if i <= n_rows - k and j <= n_cols - k:
                   x_count, o_count, empty = self.count_line(board, i, j, 1, 1, k)
                   x_score += self.score_line(x_count, o_count, empty, k)
                   o_score += self.score_line(o_count, x_count, empty, k)
              
               # Diagonal (down-left)
               if i <= n_rows - k and j >= k - 1:
                   x_count, o_count, empty = self.count_line(board, i, j, 1, -1, k)
                   x_score += self.score_line(x_count, o_count, empty, k)
                   o_score += self.score_line(o_count, x_count, empty, k)
      
       return x_score - o_score


   def count_line(self, board, start_i, start_j, di, dj, length):
       """Count X's, O's, and empty spaces in a line."""
       x_count = 0
       o_count = 0
       empty = 0
      
       for step in range(length):
           i = start_i + step * di
           j = start_j + step * dj
           cell = board[i][j]
          
           if cell == 'X':
               x_count += 1
           elif cell == 'O':
               o_count += 1
           elif cell == ' ':
               empty += 1
           # '-' (forbidden) doesn't count
      
       return x_count, o_count, empty


   def score_line(self, my_count, opp_count, empty, k):
       """Score a line based on pieces and potential."""
       # Can't win on this line if opponent has pieces
       if opp_count > 0:
           return 0
      
       # Can't win if not enough spaces
       if my_count + empty < k:
           return 0
      
       # Score based on how close to winning
       if my_count == k - 1:
           return 100  # One away from winning
       elif my_count == k - 2:
           return 10   # Two away
       elif my_count == k - 3:
           return 3    # Three away
       else:
           return 1    # Potential
  
   def check_win(self, state, player, k):
       """Check if player has k in a row."""
       board = state.board
       n_rows = len(board)
       n_cols = len(board[0])
      
       for i in range(n_rows):
           for j in range(n_cols):
               if board[i][j] != player:
                   continue
              
               # Check horizontal
               if j <= n_cols - k:
                   if all(board[i][j+x] == player for x in range(k)):
                       return True
              
               # Check vertical
               if i <= n_rows - k:
                   if all(board[i+x][j] == player for x in range(k)):
                       return True
              
               # Check diagonal (down-right)
               if i <= n_rows - k and j <= n_cols - k:
                   if all(board[i+x][j+x] == player for x in range(k)):
                       return True
              
               # Check diagonal (down-left)
               if i <= n_rows - k and j >= k - 1:
                   if all(board[i+x][j-x] == player for x in range(k)):
                       return True
      
       return False


   def get_legal_moves(self, state):
       """Get all legal moves from current state."""
       moves = []
       board = state.board
      
       for i in range(len(board)):
           for j in range(len(board[0])):
               if board[i][j] == ' ':
                   moves.append((i, j))
      
       return moves


   def make_move_on_board(self, state, move):
       """Create new state with move applied."""
       new_state = State(old=state)
       i, j = move
       new_state.board[i][j] = state.whose_move
       new_state.change_turn()
       return new_state


   def is_terminal(self, state):
       """Check if state is terminal."""
       if not self.current_game_type:
           return False
      
       k = self.current_game_type.k
      
       # Check for win
       if self.check_win(state, 'X', k) or self.check_win(state, 'O', k):
           return True
      
       # Check for draw (no legal moves)
       return len(self.get_legal_moves(state)) == 0


   def generate_utterance(self, state, move):
       """
       Generate a sports commentator style utterance.
       Extra Credit C: Uses LLM in DEMO mode for dynamic, context-aware commentary.
       """
       player = state.whose_move
       i, j = move
      
       # If LLM is not available, use fallback utterances
       if not self.use_llm:
           utterances = [
               f"And {player} makes a strong move to row {i+1}, column {j+1}!",
               f"Excellent positioning by {player} at ({i+1}, {j+1})!",
               f"{player} stakes their claim on the board!",
               f"What a play! {player} moves to ({i+1}, {j+1})!",
               f"{player} is setting up for something big!",
               f"The crowd goes wild as {player} plays ({i+1}, {j+1})!",
           ]
           import random
           return random.choice(utterances)
      
       # Use LLM for dynamic commentary
       return self.generate_llm_utterance(state, move, player)


   def generate_llm_utterance(self, state, move, player):
       """
       Generate commentary using Gemini LLM with game context.
       Extra Credit C: Creates dynamic, context-aware sports commentary.
       """
       try:
           i, j = move
          
           # Different prompt styles to try
           prompts = [
               f"Describe placing a piece at row {i+1}, column {j+1} in an exciting way.",
               f"Write commentary for a move to position {i+1},{j+1}.",
               f"Create enthusiasm for a strategic board game move."
           ]
          
           import random
           prompt = random.choice(prompts)
          
           # Call Gemini API with minimal constraints
           response = self.llm_model.generate_content(prompt)
          
           utterance = response.text.strip() if response.text else None
          
           if utterance and len(utterance) > 5:
               # Success! Add player context
               if player not in utterance and str(i+1) not in utterance:
                   utterance = f"{player} {utterance.lower()}"
               self.move_history.append(f"{player} to ({i+1},{j+1})")
               return utterance
           else:
               raise Exception("Empty response")
          
       except:
           # Enhanced fallback with variety
           templates = [
               f"{player} claims position ({i+1}, {j+1}) brilliantly!",
               f"Masterful play by {player} at ({i+1}, {j+1})!",
               f"{player} strategically places at ({i+1}, {j+1})!",
               f"Bold move to ({i+1}, {j+1}) by {player}!",
           ]
           import random
           return random.choice(templates)


   def describe_board_state(self, state):
       """
       Create a brief description of the current board state for LLM context.
       """
       board = state.board
       x_count = sum(row.count('X') for row in board)
       o_count = sum(row.count('O') for row in board)
      
       # Check for near-wins
       k = self.current_game_type.k
       x_threats = self.count_threats(state, 'X', k)
       o_threats = self.count_threats(state, 'O', k)
      
       desc = f"Board has {x_count} X pieces and {o_count} O pieces."
      
       if x_threats > 0:
           desc += f" X has {x_threats} potential winning line(s)!"
       if o_threats > 0:
           desc += f" O has {o_threats} potential winning line(s)!"
      
       return desc


   def count_threats(self, state, player, k):
       """
       Count how many lines have k-1 pieces for the player (threats).
       """
       board = state.board
       n_rows = len(board)
       n_cols = len(board[0])
       threats = 0
      
       for i in range(n_rows):
           for j in range(n_cols):
               # Check all directions
               if j <= n_cols - k:
                   player_count, opp_count, empty = self.count_line(board, i, j, 0, 1, k)
                   if player_count == k - 1 and opp_count == 0 and empty > 0:
                       threats += 1
              
               if i <= n_rows - k:
                   player_count, opp_count, empty = self.count_line(board, i, j, 1, 0, k)
                   if player_count == k - 1 and opp_count == 0 and empty > 0:
                       threats += 1
              
               if i <= n_rows - k and j <= n_cols - k:
                   player_count, opp_count, empty = self.count_line(board, i, j, 1, 1, k)
                   if player_count == k - 1 and opp_count == 0 and empty > 0:
                       threats += 1
              
               if i <= n_rows - k and j >= k - 1:
                   player_count, opp_count, empty = self.count_line(board, i, j, 1, -1, k)
                   if player_count == k - 1 and opp_count == 0 and empty > 0:
                       threats += 1
      
       return threats
   def explain_last_move(self, move, time_taken):
       """Explain the reasoning behind the last move. Extra Credit Feature D: Responds to "tell me how you did that"""
       i, j = move
       explanation = f"Great question! Here's the breakdown of my move to ({i+1}, {j+1}):\n"
       explanation += f"- I evaluated {self.num_static_evals_this_turn} different board positions\n"
       explanation += f"- My alpha-beta pruning made {self.alpha_beta_cutoffs_this_turn} cutoffs, "
       explanation += f"saving me from evaluating unnecessary branches\n"
       explanation += f"- Total computation time: {time_taken:.4f} seconds\n"
       explanation += f"- This move maximizes my strategic advantage based on threat analysis "
       explanation += f"and positioning for a {self.current_game_type.k}-in-a-row!"
       return explanation




   def order_moves_by_eval(self, state, moves):
       """
       Order moves by strategic heuristic - center control and threats.
       Extra Credit A: This improves alpha-beta pruning efficiency.
       Uses a fast heuristic instead of full static eval for better performance.
       """
       board = state.board
       n_rows = len(board)
       n_cols = len(board[0])
       center_row = n_rows // 2
       center_col = n_cols // 2
      
       def score_move(move):
           """Score a move based on quick heuristics"""
           i, j = move
           score = 0
          
           # Priority 1: Center control (center squares are more valuable)
           distance_to_center = abs(i - center_row) + abs(j - center_col)
           score -= distance_to_center * 10  # Negative distance = higher score for center
          
           # Priority 2: Adjacent to existing pieces (likely to create threats)
           adjacent_pieces = 0
           for di in [-1, 0, 1]:
               for dj in [-1, 0, 1]:
                   if di == 0 and dj == 0:
                       continue
                   ni, nj = i + di, j + dj
                   if 0 <= ni < n_rows and 0 <= nj < n_cols:
                       if board[ni][nj] in ['X', 'O']:
                           adjacent_pieces += 1
           score += adjacent_pieces * 5
          
           return score
      
       # Sort moves by score (higher is better)
       return sorted(moves, key=score_move, reverse=True)


   def initialize_zobrist_table(self, game_type):
       """
       Initialize Zobrist random numbers for hashing board states.
       Extra Credit B: Creates unique random numbers for each piece at each position.
       """
       import random
       random.seed(42)  # Fixed seed for consistency
      
       n_rows = game_type.n
       n_cols = game_type.m
      
       # Create random numbers for X and O at each board position
       self.zobrist_random_numbers = {}
       for i in range(n_rows):
           for j in range(n_cols):
               self.zobrist_random_numbers[(i, j, 'X')] = random.getrandbits(64)
               self.zobrist_random_numbers[(i, j, 'O')] = random.getrandbits(64)


   def compute_zobrist_hash(self, state):
       """
       Compute Zobrist hash for a given state.
       Extra Credit B: XOR random numbers for all pieces on board.
       """
       hash_value = 0
       board = state.board
      
       for i in range(len(board)):
           for j in range(len(board[0])):
               piece = board[i][j]
               if piece in ['X', 'O']:
                   hash_value ^= self.zobrist_random_numbers[(i, j, piece)]
      
       return hash_value


   def lookup_zobrist(self, state, depth_remaining):
       """
       Look up a state in the Zobrist hash table.
       Returns (found, score) where found is True if state was in table.
       """
       hash_value = self.compute_zobrist_hash(state)
      
       if hash_value in self.zobrist_table:
           stored_score, stored_depth = self.zobrist_table[hash_value]
           # Only use cached value if it was computed at equal or greater depth
           if stored_depth >= depth_remaining:
               self.zobrist_table_num_hits_this_turn += 1
               return (True, stored_score)
      
       return (False, None)


   def store_zobrist(self, state, score, depth_remaining):
       """
       Store a state evaluation in the Zobrist hash table.
       """
       hash_value = self.compute_zobrist_hash(state)
       self.zobrist_table[hash_value] = (score, depth_remaining)
       self.zobrist_table_num_entries_this_turn += 1


# OPTIONAL THINGS TO KEEP TRACK OF:


#  WHO_MY_OPPONENT_PLAYS = other(WHO_I_PLAY)
#  MY_PAST_UTTERANCES = []
#  OPPONENT_PAST_UTTERANCES = []
#  UTTERANCE_COUNT = 0
#  REPEAT_COUNT = 0 or a table of these if you are reusing different utterances