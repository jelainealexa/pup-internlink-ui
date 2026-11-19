// @vitest-environment jsdom
import React from "react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { createSeed } from "../../app/lib/seed";
import { Students } from "../../app/features/Students";
const state = vi.hoisted(() => ({ app: {} as Record<string, unknown> }));
vi.mock("../../app/components/AppProvider", () => ({
  useApp: () => state.app,
}));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));
afterEach(cleanup);
beforeEach(async () => {
  const db = await createSeed(new Date("2032-04-15T12:00:00Z"));
  state.app = {
    db,
    account: db.accounts[0],
    mutate: vi.fn(),
    setNotice: vi.fn(),
  };
});
it.each(["program", "yearLevel"])(
  "IV-13 preserves a legitimate existing %s value in the edit form",
  (field) => {
    const db = state.app.db as Awaited<ReturnType<typeof createSeed>>;
    const student = db.students[0];
    const value = field === "program" ? "BS Audit Studies" : "2nd Year";
    student[field as "program" | "yearLevel"] = value;
    render(<Students id={student.id} action="edit" />);
    expect(
      screen.getByLabelText(field === "program" ? "Program *" : "Year level *"),
    ).toHaveValue(value);
  },
);
