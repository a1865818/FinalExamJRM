import {
  CreateGameTemplateRequest,
  GameQuestion,
  GameResult,
  GameSession,
  GameSessionStats,
  GameTemplate,
  StartGameRequest,
  SubmitAnswerRequest,
  SubmitAnswerResponse,
} from "@/types/game";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const gameTemplateApi = {
  // Get all game templates
  getAll: async (): Promise<GameTemplate[]> => {
    const response = await apiClient.get<GameTemplate[]>("/gametemplate");
    return response.data;
  },

  // Get game template by ID
  getById: async (id: number): Promise<GameTemplate> => {
    const response = await apiClient.get<GameTemplate>(`/gametemplate/${id}`);
    return response.data;
  },

  // Create new game template
  create: async (request: CreateGameTemplateRequest): Promise<GameTemplate> => {
    const response = await apiClient.post<GameTemplate>(
      "/gametemplate",
      request
    );
    return response.data;
  },

  // Update existing game template
  update: async (
    id: number,
    request: CreateGameTemplateRequest
  ): Promise<GameTemplate> => {
    const response = await apiClient.put<GameTemplate>(
      `/gametemplate/${id}`,
      request
    );
    return response.data;
  },

  // Delete game template
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/gametemplate/${id}`);
  },
};

export const gameSessionApi = {
  // Start a new game session
  start: async (request: StartGameRequest): Promise<GameSession> => {
    const response = await apiClient.post<GameSession>(
      "/gamesession/start",
      request
    );
    return response.data;
  },

  // Get game session by ID
  getById: async (sessionId: number): Promise<GameSession> => {
    const response = await apiClient.get<GameSession>(
      `/gamesession/${sessionId}`
    );
    return response.data;
  },

  // Get next question for the session
  getNextQuestion: async (sessionId: number): Promise<GameQuestion | null> => {
    try {
      const response = await apiClient.get<GameQuestion>(
        `/gamesession/${sessionId}/question`
      );
      return response.data;
    } catch (error) {
      // Check if this is a 400 error indicating game completion
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        const errorMessage =
          typeof error.response.data === "string"
            ? error.response.data
            : error.response.data?.message || error.message;

        // Check if this indicates the game should be completed
        if (
          errorMessage.toLowerCase().includes("all numbers") ||
          errorMessage.toLowerCase().includes("no available numbers") ||
          errorMessage.toLowerCase().includes("completed") ||
          errorMessage.toLowerCase().includes("expired") ||
          errorMessage.toLowerCase().includes("not active")
        ) {
          // Return null to indicate game completion - no error thrown
          console.log("Game should complete:", errorMessage);
          return null;
        }
      }
      // Re-throw the original error if it's not a game completion scenario
      throw error;
    }
  },

  // Submit an answer
  submitAnswer: async (
    request: SubmitAnswerRequest
  ): Promise<SubmitAnswerResponse> => {
    const response = await apiClient.post<SubmitAnswerResponse>(
      "/gamesession/answer",
      request
    );
    return response.data;
  },

  // Complete the game and get results
  complete: async (sessionId: number): Promise<GameResult> => {
    const response = await apiClient.post<GameResult>(
      `/gamesession/${sessionId}/complete`
    );
    return response.data;
  },

  // Check if game session is still active
  checkStatus: async (sessionId: number): Promise<boolean> => {
    const response = await apiClient.get<boolean>(
      `/gamesession/${sessionId}/status`
    );
    return response.data;
  },

  // Get session statistics
  getStats: async (sessionId: number): Promise<GameSessionStats> => {
    const response = await apiClient.get<GameSessionStats>(
      `/gamesession/${sessionId}/stats`
    );
    return response.data;
  },
};

// Utility function to handle API errors
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    // Handle specific HTTP status codes with better messages
    if (error.response?.status === 400) {
      // Bad Request - validation errors or inactive session
      if (typeof error.response.data === "string") {
        return error.response.data;
      }
      if (error.response.data?.message) {
        return error.response.data.message;
      }
      // Check for specific game completion scenarios
      if (
        error.response.data &&
        error.response.data.includes &&
        (error.response.data.includes("not active") ||
          error.response.data.includes("completed") ||
          error.response.data.includes("expired") ||
          error.response.data.includes("already answered") ||
          error.response.data.includes("duplicate") ||
          error.response.data.includes("all numbers") ||
          error.response.data.includes("No available numbers"))
      ) {
        return error.response.data;
      }
      return "Please check your input and try again";
    }

    if (error.response?.status === 409) {
      // Conflict - typically name already exists or duplicate answer
      if (typeof error.response.data === "string") {
        return error.response.data;
      }
      if (error.response.data?.message) {
        return error.response.data.message;
      }
      return "A conflict occurred - this might be a duplicate operation";
    }

    if (error.response?.status === 404) {
      // Not Found
      if (typeof error.response.data === "string") {
        return error.response.data;
      }
      if (error.response.data?.message) {
        return error.response.data.message;
      }
      return "The requested resource was not found";
    }

    // Try to extract message from various response formats
    if (typeof error.response?.data === "string") {
      return error.response.data;
    }
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.response?.data?.title) {
      return error.response.data.title;
    }
    if (error.response?.statusText) {
      return error.response.statusText;
    }
    if (error.message) {
      return error.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred";
};
