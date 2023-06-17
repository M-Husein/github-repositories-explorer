import { render, screen } from "@testing-library/react";
import { Main } from "./";

describe("Main", () => {
  it("is rendered correctly", () => {
    render(
      <Main>
        <h1>Title main</h1>
      </Main>
    );
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
