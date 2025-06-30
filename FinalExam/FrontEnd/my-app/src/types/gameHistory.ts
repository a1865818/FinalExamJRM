export interface GameHistoryItem {
  sessionId: number;
  playerName: string;
  gameName: string;
  gameTemplateId: number;
  startedAt: string;
  completedAt?: string;
  duration: number;
  correctAnswers: number;
  incorrectAnswers: number;
  totalQuestions: number;
  accuracyPercentage: number;
  score: number;
}

export interface GameHistoryRequest {
  page?: number;
  pageSize?: number;
  playerName?: string;
  gameTemplateId?: number;
  sortBy?: string;
  sortOrder?: string;
  startDate?: string;
  endDate?: string;
}

export interface PaginatedGameHistoryResponse {
  games: GameHistoryItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface GameRule {
  divisor: number;
  replacement: string;
}

export interface GameAnswer {
  number: number;
  playerAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

export interface GameHistoryResponse {
  sessionId: number;
  playerName: string;
  gameName: string;
  gameTemplateId: number;
  startedAt: string;
  completedAt: string;
  duration: number;
  correctAnswers: number;
  incorrectAnswers: number;
  totalQuestions: number;
  accuracyPercentage: number;
  score: number;
  rules: GameRule[];
  answers: GameAnswer[];
}

export interface GameStatsResponse {
  totalGamesPlayed: number;
  totalPlayersCount: number;
  averageAccuracy: number;
  gameTemplateStats: GameTemplateStats[];
  mostPopularGame: GameTemplateStats;
}

export interface GameTemplateStats {
  gameTemplateId: number;
  gameName: string;
  timesPlayed: number;
  averageAccuracy: number;
  averageScore: number;
}

export interface PlayerGameHistoryResponse {
  playerName: string;
  totalGamesPlayed: number;
  totalCorrectAnswers: number;
  totalIncorrectAnswers: number;
  overallAccuracy: number;
  firstGamePlayed: string;
  lastGamePlayed: string;
  gameHistory: GameHistoryResponse[];
}
