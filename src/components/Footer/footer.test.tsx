import { render, screen } from "@testing-library/react";
import { Footer } from "./";

describe("Footer", () => {
  it("is rendered correctly", () => {
    render(<Footer />);
    expect(screen.getByRole('footer')).toBeInTheDocument();
  });
});
