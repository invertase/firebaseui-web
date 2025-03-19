import { describe, it, expect } from "vitest";
import { cn } from "../../../src/utils/cn";

describe("cn utility", () => {
  it("merges class names correctly", () => {
    expect(cn("class1", "class2")).toBe("class1 class2");
  });

  it("handles conditional class names", () => {
    const condition = true;
    expect(cn("base", condition && "conditional")).toBe("base conditional");
    expect(cn("base", !condition && "conditional")).toBe("base");
  });

  it("merges Tailwind classes with proper specificity", () => {
    // The twMerge function should properly handle Tailwind class conflicts
    expect(cn("p-4", "p-6")).toBe("p-6");
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("handles arrays and objects of class names", () => {
    expect(cn("base", ["class1", "class2"])).toBe("base class1 class2");
    expect(cn("base", { conditional: true, ignored: false })).toBe(
      "base conditional"
    );
  });

  it("handles null, undefined and false values", () => {
    expect(cn("base", null, undefined, false, "extra")).toBe("base extra");
  });
});
