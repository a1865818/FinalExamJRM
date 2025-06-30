import {
  GameHistoryRequest,
  GameHistoryResponse,
  GameStatsResponse,
  PaginatedGameHistoryResponse,
  PlayerGameHistoryResponse,
} from "@/types/gameHistory";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const gameHistoryApi = {
  // Get game history with pagination and filtering
  getGameHistory: async (
    request: GameHistoryRequest
  ): Promise<PaginatedGameHistoryResponse> => {
    const params = new URLSearchParams();

    if (request.page) params.append("page", request.page.toString());
    if (request.pageSize)
      params.append("pageSize", request.pageSize.toString());
    if (request.playerName) params.append("playerName", request.playerName);
    if (request.gameTemplateId)
      params.append("gameTemplateId", request.gameTemplateId.toString());
    if (request.sortBy) params.append("sortBy", request.sortBy);
    if (request.sortOrder) params.append("sortOrder", request.sortOrder);
    if (request.startDate) params.append("startDate", request.startDate);
    if (request.endDate) params.append("endDate", request.endDate);

    const response = await apiClient.get<PaginatedGameHistoryResponse>(
      `/gamehistory?${params.toString()}`
    );
    return response.data;
  },

  // Get game history for a specific player
  getPlayerHistory: async (
    playerName: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedGameHistoryResponse> => {
    const response = await apiClient.get<PaginatedGameHistoryResponse>(
      `/gamehistory/player/${encodeURIComponent(
        playerName
      )}?page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  },

  // Get comprehensive player profile data
  getPlayerProfile: async (
    playerName: string
  ): Promise<PlayerGameHistoryResponse> => {
    const response = await apiClient.get<PlayerGameHistoryResponse>(
      `/gamehistory/player/${encodeURIComponent(playerName)}`
    );
    return response.data;
  },

  // Get game history statistics
  getStatistics: async (): Promise<{
    totalGames: number;
    totalPlayers: number;
    averageAccuracy: number;
    averageDuration: number;
  }> => {
    const response = await apiClient.get(`/gamehistory/statistics`);
    return response.data;
  },

  // Get comprehensive game statistics
  getGameStats: async (): Promise<GameStatsResponse> => {
    const response = await apiClient.get(`/gamehistory/stats`);
    return response.data;
  },

  // Get top players by performance
  getTopPlayers: async (limit: number = 10): Promise<string[]> => {
    const response = await apiClient.get(
      `/gamehistory/top-players?limit=${limit}`
    );
    return response.data;
  },

  // Get recent games
  getRecentGames: async (
    limit: number = 10
  ): Promise<GameHistoryResponse[]> => {
    const response = await apiClient.get(`/gamehistory/recent?limit=${limit}`);
    return response.data;
  },
};
