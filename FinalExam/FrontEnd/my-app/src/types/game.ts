export interface GameRule {
  divisor: number;
  replacement: string;
}

export interface GameTemplate {
  id: number;
  name: string;
  author: string;
  minRange: number;
  maxRange: number;
  createdAt: string;
  rules: GameRule[];
}

export interface CreateGameTemplateRequest {
  name: string;
  author: string;
  minRange: number;
  maxRange: number;
  rules: GameRule[];
}

export interface StartGameRequest {
  gameTemplateId: number;
  playerName: string;
  duration: number;
}

export interface GameSession {
  sessionId: number;
  gameTemplateId: number;
  gameName: string;
  playerName: string;
  duration: number;
  startedAt: string;
  rules: GameRule[];
}

export interface GameQuestion {
  number: number;
  timeStamp: string;
}

export interface SubmitAnswerRequest {
  sessionId: number;
  number: number;
  answer: string;
}

export interface SubmitAnswerResponse {
  isCorrect: boolean;
  correctAnswer: string;
  correctAnswers: number;
  incorrectAnswers: number;
}

export interface GameResult {
  sessionId: number;
  gameName: string;
  playerName: string;
  duration: number;
  correctAnswers: number;
  incorrectAnswers: number;
  totalQuestions: number;
  accuracyPercentage: number;
  startedAt: string;
  completedAt: string;
}

export interface GameState {
  session: GameSession | null;
  currentQuestion: GameQuestion | null;
  timeRemaining: number;
  isPlaying: boolean;
  score: {
    correct: number;
    incorrect: number;
  };
  gameResult: GameResult | null;
}

export interface GameSessionStats {
  sessionId: number;
  totalPossibleNumbers: number;
  numbersUsed: number;
  numbersRemaining: number;
  usedNumbers: number[];
  isCompleted: boolean;
  timeRemaining: number;
}

export interface GameEndReason {
  reason: "time_expired" | "all_numbers_used" | "user_completed" | "unknown";
  message: string;
}

export interface ApiErrorResponse {
  message: string;
  gameEnded?: boolean;
  reason?: string;
}
