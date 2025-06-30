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

    // Use getAllByText for "By" text that appears multiple times
    const systemElements = screen.getAllByText((content, element) => {
      return (
        (element?.textContent?.includes("By:") &&
          element?.textContent?.includes("System")) ||
        false
      );
    });
    expect(systemElements.length).toBeGreaterThan(0);

    const userElements = screen.getAllByText((content, element) => {
      return (
        (element?.textContent?.includes("By:") &&
          element?.textContent?.includes("User")) ||
        false
      );
    });
    expect(userElements.length).toBeGreaterThan(0);
  });

  it("displays game rules correctly", () => {
    render(
      <GameTemplateList
        templates={mockTemplates}
        onSelectTemplate={mockOnSelectTemplate}
      />
    );

    // Use getAllByText to handle multiple elements that match the same text
    const fizzElements = screen.getAllByText((content, element) => {
      return (
        (element?.textContent?.includes("3") &&
          element?.textContent?.includes("Fizz")) ||
        false
      );
    });
    expect(fizzElements.length).toBeGreaterThan(0);

    const buzzElements = screen.getAllByText((content, element) => {
      return (
        (element?.textContent?.includes("5") &&
          element?.textContent?.includes("Buzz")) ||
        false
      );
    });
    expect(buzzElements.length).toBeGreaterThan(0);

    const fooElements = screen.getAllByText((content, element) => {
      return (
        (element?.textContent?.includes("7") &&
          element?.textContent?.includes("Foo")) ||
        false
      );
    });
    expect(fooElements.length).toBeGreaterThan(0);
  });

  it("calls onSelectTemplate when a template is clicked", () => {
    render(
      <GameTemplateList
        templates={mockTemplates}
        onSelectTemplate={mockOnSelectTemplate}
      />
    );

    // Click the template container, not just any div
    const templateContainer = screen
      .getByText("Classic FizzBuzz")
      .closest('[class*="border-2"]');
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

    // Find the template container by using a more specific selector
    // The template container has the border classes and onClick handler
    const templateContainer = screen
      .getByText("Classic FizzBuzz")
      .closest('[class*="border-2"]');
    expect(templateContainer).toHaveClass("border-primary-500");
  });
});
