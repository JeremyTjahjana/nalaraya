import { describe, it, expect } from "vitest";
import {
  equipment,
  introQuestions,
  gradeIntroduction,
  completionKey,
  readCompletion,
  saveCompletion,
} from "./introduction";
import { tools } from "./lab";

describe("introductory course", () => {
  it("keeps twenty general tools separate from experimental chemicals", () => {
    expect(equipment).toHaveLength(20);
    expect(new Set(equipment.map((item) => item.id)).size).toBe(20);
    expect(
      equipment.some((item) =>
        ["naoh", "hcl", "indicator", "water"].includes(item.id),
      ),
    ).toBe(false);
    expect(tools.some((item) => item.id === "mortar")).toBe(false);
  });
  it("rejects incomplete or invalid answers", () => {
    for (const answers of [
      [],
      [-1, 0, 2, 1, 2],
      [1, 0, 2, 1],
      [1, 0, 2, 1, 3],
      [1.5, 0, 2, 1, 2],
    ])
      expect(gradeIntroduction(answers)).toBeNull();
  });
  it("grades failure, the four-answer boundary, perfection, and retries independently", () => {
    expect(gradeIntroduction([0, 1, 0, 0, 0])).toEqual({
      score: 0,
      passed: false,
      incorrect: [0, 1, 2, 3, 4],
    });
    expect(gradeIntroduction([0, 0, 2, 1, 2])).toEqual({
      score: 4,
      passed: true,
      incorrect: [0],
    });
    expect(
      gradeIntroduction(introQuestions.map((question) => question.answer)),
    ).toEqual({ score: 5, passed: true, incorrect: [] });
    expect(gradeIntroduction([0, 1, 2, 1, 2])?.passed).toBe(false);
  });
  it("restores completion and handles unavailable storage", () => {
    const values = new Map<string, string>();
    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => {
        values.set(key, value);
      },
    };
    expect(readCompletion(storage)).toBe(false);
    expect(saveCompletion(storage)).toBe(true);
    expect(values.get(completionKey)).toBe("true");
    expect(readCompletion(storage)).toBe(true);
    const blocked = {
      getItem: () => {
        throw Error("blocked");
      },
      setItem: () => {
        throw Error("blocked");
      },
    };
    expect(readCompletion(blocked)).toBe(false);
    expect(saveCompletion(blocked)).toBe(false);
  });
});
