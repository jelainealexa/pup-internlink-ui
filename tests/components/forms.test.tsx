// @vitest-environment jsdom
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { Field, SaveForm } from "../../app/components/ui";
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn() }),
  usePathname: () => "/dashboard",
  useSearchParams: () => new URLSearchParams(),
}));
afterEach(cleanup);
describe("accessible persisted-operation forms", () => {
  it("associates labels and required markers with inputs", () => {
    render(<Field label="First name" name="firstName" />);
    expect(screen.getByLabelText("First name *")).toBeRequired();
  });
  it("preserves user input and focuses useful failure feedback", async () => {
    const user = userEvent.setup();
    render(
      <SaveForm
        save={async () => {
          throw new Error("Duplicate student identifier");
        }}
      >
        <Field label="Student ID" name="studentNumber" />
      </SaveForm>,
    );
    await user.type(screen.getByLabelText("Student ID *"), "SYN-001");
    await user.click(screen.getByRole("button", { name: /^Save$/ }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Duplicate student identifier",
    );
    expect(screen.getByLabelText("Student ID *")).toHaveValue("SYN-001");
    expect(screen.getByRole("alert")).toHaveFocus();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
  it("prevents repeated submissions and reports success after the operation resolves", async () => {
    let resolve!: () => void;
    const save = vi.fn(
      () =>
        new Promise<void>((r) => {
          resolve = r;
        }),
    );
    const { container } = render(
      <SaveForm save={save}>
        <Field label="Name" name="name" value="Synthetic" />
      </SaveForm>,
    );
    const form = container.querySelector("form")!;
    fireEvent.submit(form);
    fireEvent.submit(form);
    expect(save).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "Saving…" })).toBeDisabled();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    resolve();
    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent("Changes saved."),
    );
  });
});
