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
    expect(screen.getByLabelText(/min range/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/max range/i)).toBeInTheDocument();
    expect(screen.getByText(/game rules/i)).toBeInTheDocument();
  });

  it("starts with one default rule", () => {
    render(<CreateGameForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const divisorInputs = screen.getAllByPlaceholderText("Divisor");
    const replacementInputs =
      screen.getAllByPlaceholderText("Replacement word");

    expect(divisorInputs).toHaveLength(1);
    expect(replacementInputs).toHaveLength(1);
    expect(divisorInputs[0]).toHaveValue(3);
  });

  it("allows adding and removing rules", async () => {
    render(<CreateGameForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    // Add a rule
    fireEvent.click(screen.getByText("+ Add Rule"));

    await waitFor(() => {
      expect(screen.getAllByPlaceholderText("Divisor")).toHaveLength(2);
    });

    // Remove a rule (Remove button should appear when there are multiple rules)
    const removeButtons = screen.getAllByText("Remove");
    expect(removeButtons).toHaveLength(2);

    fireEvent.click(removeButtons[0]);

    await waitFor(() => {
      expect(screen.getAllByPlaceholderText("Divisor")).toHaveLength(1);
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
    fireEvent.change(screen.getByPlaceholderText("Replacement word"), {
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
