import CreateGameForm from "@/components/CreateGameForm";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

describe("CreateGameForm", () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders form fields correctly", () => {
    render(<CreateGameForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    expect(screen.getByLabelText(/game name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/author name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/minimum number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/maximum number/i)).toBeInTheDocument();
    expect(screen.getByText(/game rules/i)).toBeInTheDocument();
  });

  it("starts with one default rule", () => {
    render(<CreateGameForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const divisorInputs = screen.getAllByPlaceholderText("e.g., 3, 5, 7");
    const replacementInputs = screen.getAllByPlaceholderText(
      "e.g., Fizz, Buzz, Boom"
    );

    expect(divisorInputs).toHaveLength(1);
    expect(replacementInputs).toHaveLength(1);
    expect(divisorInputs[0]).toHaveValue(3);
  });

  it("allows adding and removing rules", async () => {
    render(<CreateGameForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    // Add a rule
    fireEvent.click(screen.getByText("Add Rule"));

    await waitFor(() => {
      expect(screen.getAllByPlaceholderText("e.g., 3, 5, 7")).toHaveLength(2);
    });

    // Remove a rule (Remove button should appear when there are multiple rules)
    // The remove buttons are trash icons, not text
    const removeButtons = screen.getAllByTitle("Remove rule");
    expect(removeButtons).toHaveLength(2);

    fireEvent.click(removeButtons[0]);

    await waitFor(() => {
      expect(screen.getAllByPlaceholderText("e.g., 3, 5, 7")).toHaveLength(1);
    });
  });

  it("submits form with correct data", async () => {
    render(<CreateGameForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    // Fill form
    fireEvent.change(screen.getByLabelText(/game name/i), {
      target: { value: "Test Game" },
    });
    fireEvent.change(screen.getByLabelText(/author name/i), {
      target: { value: "Test Author" },
    });
    fireEvent.change(screen.getByPlaceholderText("e.g., Fizz, Buzz, Boom"), {
      target: { value: "Fizz" },
    });

    // Submit form
    fireEvent.click(screen.getByText("Create Game"));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: "Test Game",
        author: "Test Author",
        minRange: 1,
        maxRange: 100,
        rules: [{ divisor: 3, replacement: "Fizz" }],
      });
    });
  });

  it("calls onCancel when cancel button is clicked", () => {
    render(<CreateGameForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    fireEvent.click(screen.getByText("Cancel"));
    expect(mockOnCancel).toHaveBeenCalled();
  });
});
