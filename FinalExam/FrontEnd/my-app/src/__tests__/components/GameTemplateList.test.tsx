import GameTemplateList from "@/components/GameTemplateList";
import { GameTemplate } from "@/types/game";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";

const mockTemplates: GameTemplate[] = [
  {
    id: 1,
    name: "Classic FizzBuzz",
    author: "System",
    minRange: 1,
    maxRange: 100,
    createdAt: "2025-01-01T00:00:00Z",
    rules: [
      { divisor: 3, replacement: "Fizz" },
      { divisor: 5, replacement: "Buzz" },
    ],
  },
  {
    id: 2,
    name: "Custom Game",
    author: "User",
    minRange: 1,
    maxRange: 50,
    createdAt: "2025-01-02T00:00:00Z",
    rules: [{ divisor: 7, replacement: "Foo" }],
  },
];

describe("GameTemplateList", () => {
  const mockOnSelectTemplate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all game templates", () => {
    render(
      <GameTemplateList
        templates={mockTemplates}
        onSelectTemplate={mockOnSelectTemplate}
      />
    );

    expect(screen.getByText("Classic FizzBuzz")).toBeInTheDocument();
    expect(screen.getByText("Custom Game")).toBeInTheDocument();

    // Check for "By" text and author names separately since they are in different spans
    expect(screen.getAllByText("By")).toHaveLength(2);
    expect(screen.getByText("System")).toBeInTheDocument();
    expect(screen.getByText("User")).toBeInTheDocument();
  });

  it("displays game rules correctly", () => {
    render(
      <GameTemplateList
        templates={mockTemplates}
        onSelectTemplate={mockOnSelectTemplate}
      />
    );

    // Check for individual rule components - they are in separate spans
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText('"Fizz"')).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText('"Buzz"')).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
    expect(screen.getByText('"Foo"')).toBeInTheDocument();
  });

  it("calls onSelectTemplate when a template is clicked", () => {
    render(
      <GameTemplateList
        templates={mockTemplates}
        onSelectTemplate={mockOnSelectTemplate}
      />
    );

    // Click the template container - find it by class name
    const templateContainer = screen
      .getByText("Classic FizzBuzz")
      .closest('[class*="template-card"]');
    fireEvent.click(templateContainer!);
    expect(mockOnSelectTemplate).toHaveBeenCalledWith(mockTemplates[0]);
  });

  it("highlights selected template", () => {
    render(
      <GameTemplateList
        templates={mockTemplates}
        onSelectTemplate={mockOnSelectTemplate}
        selectedTemplateId={1}
      />
    );

    // Find the selected template container
    const templateContainer = screen
      .getByText("Classic FizzBuzz")
      .closest('[class*="template-card"]');
    expect(templateContainer).toHaveClass("template-card-selected");
  });
});
