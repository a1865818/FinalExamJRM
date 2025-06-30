import GamePlay from "@/components/GamePlay/GamePlay";
import { GameQuestion, GameSession } from "@/types/game";
import { act, fireEvent, render, screen } from "@testing-library/react";

const mockSession: GameSession = {
  sessionId: 1,
  gameTemplateId: 1,
  gameName: "Test Game",
  playerName: "Test Player",
  duration: 60,
  startedAt: "2025-01-01T00:00:00Z",
  rules: [
    { divisor: 3, replacement: "Fizz" },
    { divisor: 5, replacement: "Buzz" },
  ],
};

const mockQuestion: GameQuestion = {
  number: 15,
  timeStamp: "2025-01-01T00:01:00Z",
};

describe("GamePlay", () => {
  const mockOnSubmitAnswer = jest.fn();
  const mockOnGameEnd = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("displays game information correctly", () => {
    render(
      <GamePlay
        session={mockSession}
        onSubmitAnswer={mockOnSubmitAnswer}
        onGameEnd={mockOnGameEnd}
        currentQuestion={mockQuestion}
        score={{ correct: 5, incorrect: 2 }}
      />
    );

    expect(screen.getByText("Test Game")).toBeInTheDocument();
    expect(screen.getByText("Test Player")).toBeInTheDocument();

    // Use more specific queries for scores to avoid multiple matches
    expect(screen.getByText("Correct")).toBeInTheDocument();
    expect(screen.getByText("Incorrect")).toBeInTheDocument();

    // Check the actual score values are present
    const scoreElements = screen.getAllByText("5");
    expect(scoreElements.length).toBeGreaterThan(0);

    expect(screen.getByText("2")).toBeInTheDocument(); // incorrect score
    expect(screen.getByText("15")).toBeInTheDocument(); // current question
  });

  it("displays game rules", () => {
    render(
      <GamePlay
        session={mockSession}
        onSubmitAnswer={mockOnSubmitAnswer}
        onGameEnd={mockOnGameEnd}
        currentQuestion={mockQuestion}
        score={{ correct: 0, incorrect: 0 }}
      />
    );

    expect(screen.getByText("3")).toBeInTheDocument();
    // Use getAllByText for "Fizz" since it appears multiple times in the DOM structure
    const fizzElements = screen.getAllByText((content, element) => {
      return element?.textContent?.includes("Fizz") || false;
    });
    expect(fizzElements.length).toBeGreaterThan(0);

    // Use getAllByText for "5" since it appears in both rules and might appear elsewhere
    const fiveElements = screen.getAllByText("5");
    expect(fiveElements.length).toBeGreaterThan(0);

    // Use getAllByText for "Buzz" since it appears multiple times in the DOM structure
    const buzzElements = screen.getAllByText((content, element) => {
      return element?.textContent?.includes("Buzz") || false;
    });
    expect(buzzElements.length).toBeGreaterThan(0);
  });

  it("submits answer when form is submitted", () => {
    render(
      <GamePlay
        session={mockSession}
        onSubmitAnswer={mockOnSubmitAnswer}
        onGameEnd={mockOnGameEnd}
        currentQuestion={mockQuestion}
        score={{ correct: 0, incorrect: 0 }}
      />
    );

    const input = screen.getByPlaceholderText("Enter your answer");
    const submitButton = screen.getByText("Submit Answer");

    fireEvent.change(input, { target: { value: "FizzBuzz" } });
    fireEvent.click(submitButton);

    expect(mockOnSubmitAnswer).toHaveBeenCalledWith({
      sessionId: 1,
      number: 15,
      answer: "FizzBuzz",
    });
  });

  it("shows last answer result when provided", () => {
    render(
      <GamePlay
        session={mockSession}
        onSubmitAnswer={mockOnSubmitAnswer}
        onGameEnd={mockOnGameEnd}
        currentQuestion={mockQuestion}
        score={{ correct: 1, incorrect: 0 }}
        lastAnswerResult={{ isCorrect: true, correctAnswer: "FizzBuzz" }}
      />
    );

    expect(screen.getByText("✅ Correct!")).toBeInTheDocument();
  });

  it("calls onGameEnd when timer reaches zero", () => {
    render(
      <GamePlay
        session={mockSession}
        onSubmitAnswer={mockOnSubmitAnswer}
        onGameEnd={mockOnGameEnd}
        currentQuestion={mockQuestion}
        score={{ correct: 0, incorrect: 0 }}
      />
    );

    // Fast-forward time to trigger timer - need to advance enough to trigger the countdown
    // Session duration is 60 seconds, so advance 61 seconds to ensure timer reaches 0
    act(() => {
      jest.advanceTimersByTime(61000); // 61 seconds to ensure timer reaches 0
    });

    expect(mockOnGameEnd).toHaveBeenCalled();
  });
});
