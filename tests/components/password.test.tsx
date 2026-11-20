// @vitest-environment jsdom
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { PasswordField } from "../../app/features/AccountAccess";

afterEach(cleanup);
describe("password visibility", () => {
  it("starts hidden, preserves the value, changes the icon and never submits the form", async () => {
    const user = userEvent.setup();
    const submit = vi.fn((event: React.FormEvent) => event.preventDefault());
    render(
      <form onSubmit={submit}>
        <PasswordField />
      </form>,
    );
    const input = screen.getByLabelText("Password *");
    expect(input).toHaveAttribute("type", "password");
    await user.type(input, "Synthetic!2026");
    const toggle = screen.getByRole("button", {
      name: "Show password",
    });
    const hiddenIcon = toggle.querySelector("svg")!.innerHTML;
    expect(toggle).toHaveAttribute("type", "button");
    expect(toggle).toHaveAttribute("aria-controls", input.id);
    await user.click(toggle);
    expect(input).toHaveAttribute("type", "text");
    expect(input).toHaveValue("Synthetic!2026");
    expect(toggle).toHaveAccessibleName("Hide password");
    expect(toggle).toHaveAttribute("aria-pressed", "true");
    expect(toggle.querySelector("svg")!.innerHTML).not.toBe(hiddenIcon);
    await user.click(toggle);
    expect(input).toHaveAttribute("type", "password");
    expect(input).toHaveValue("Synthetic!2026");
    expect(submit).not.toHaveBeenCalled();
  });

  it("supports keyboard toggles without changing the independent confirmation field", async () => {
    const user = userEvent.setup();
    render(
      <>
        <PasswordField newCredential />
        <PasswordField
          label="Confirm password"
          name="confirmPassword"
          newCredential
        />
      </>,
    );
    const password = screen.getByLabelText("Password *");
    const confirmation = screen.getByLabelText("Confirm password *");
    await user.type(password, "Synthetic!2026");
    await user.type(confirmation, "Synthetic!2026");
    const first = screen.getByRole("button", {
      name: "Show password",
    });
    first.focus();
    await user.keyboard("{Enter}");
    expect(password).toHaveAttribute("type", "text");
    expect(confirmation).toHaveAttribute("type", "password");
    await user.keyboard(" ");
    expect(password).toHaveAttribute("type", "password");
    await user.click(
      screen.getByRole("button", { name: "Show confirm password" }),
    );
    expect(password).toHaveAttribute("type", "password");
    expect(confirmation).toHaveAttribute("type", "text");
    expect(confirmation).toHaveValue("Synthetic!2026");
    expect(password).toHaveAttribute("minlength", "8");
    expect(confirmation).toHaveAttribute("autocomplete", "new-password");
  });
});
