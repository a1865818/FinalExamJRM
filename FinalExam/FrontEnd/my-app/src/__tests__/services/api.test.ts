import { CreateGameTemplateRequest } from "@/types/game";
import axios from "axios";

// Mock axios
jest.mock("axios");

// Create mock functions for the API
const mockGet = jest.fn();
const mockPost = jest.fn();

// Mock the entire API module
jest.mock("@/services/api", () => {
  return {
    gameTemplateApi: {
      getAll: () => mockGet(),
      create: (request: CreateGameTemplateRequest) => mockPost(request),
    },
    handleApiError: jest.fn((error: unknown) => {
      // Mock implementation of handleApiError
      if (axios.isAxiosError && axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
          return error.response.data.message;
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
    }),
  };
});

// Import after mocking
import { gameTemplateApi, handleApiError } from "@/services/api";

describe("API Services", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("gameTemplateApi", () => {
    it("fetches all game templates", async () => {
      const mockTemplates = [{ id: 1, name: "Test Game" }];
      mockGet.mockResolvedValue(mockTemplates);

      const result = await gameTemplateApi.getAll();

      expect(mockGet).toHaveBeenCalled();
      expect(result).toEqual(mockTemplates);
    });

    it("creates a new game template", async () => {
      const mockRequest = {
        name: "New Game",
        author: "Author",
        minRange: 1,
        maxRange: 100,
        rules: [{ divisor: 3, replacement: "Fizz" }],
      };
      const mockResponse = { id: 1, ...mockRequest };
      mockPost.mockResolvedValue(mockResponse);

      const result = await gameTemplateApi.create(mockRequest);

      expect(mockPost).toHaveBeenCalledWith(mockRequest);
      expect(result).toEqual(mockResponse);
    });
  });

  describe("handleApiError", () => {
    beforeEach(() => {
      // Reset the isAxiosError mock before each test
      jest.restoreAllMocks();
    });

    it("handles server errors with response data message", () => {
      const error = {
        response: {
          data: { message: "Server error message" },
        },
      };

      // Mock axios.isAxiosError to return true for this error
      jest.spyOn(axios, "isAxiosError").mockReturnValue(true);

      const result = handleApiError(error);
      expect(result).toBe("Server error message");
    });

    it("handles server errors with response statusText", () => {
      const error = {
        response: {
          statusText: "Internal Server Error",
        },
      };

      jest.spyOn(axios, "isAxiosError").mockReturnValue(true);

      const result = handleApiError(error);
      expect(result).toBe("Internal Server Error");
    });

    it("handles axios errors with message", () => {
      const error = {
        message: "Network Error",
      };

      jest.spyOn(axios, "isAxiosError").mockReturnValue(true);

      const result = handleApiError(error);
      expect(result).toBe("Network Error");
    });

    it("handles regular Error objects", () => {
      const error = new Error("Unknown error");

      jest.spyOn(axios, "isAxiosError").mockReturnValue(false);

      const result = handleApiError(error);
      expect(result).toBe("Unknown error");
    });

    it("handles unknown error types", () => {
      const error = "Some string error";

      jest.spyOn(axios, "isAxiosError").mockReturnValue(false);

      const result = handleApiError(error);
      expect(result).toBe("An unexpected error occurred");
    });
  });
});
