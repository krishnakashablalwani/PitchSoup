import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { exportAsCSV, exportAsPDF } from "../export";

describe("export utility", () => {
  let createdElements: any[] = [];
  let appendChildSpy: any;
  let removeChildSpy: any;

  beforeEach(() => {
    createdElements = [];
    // Mock URL methods
    global.URL.createObjectURL = vi.fn().mockReturnValue("blob:mock-url");
    global.URL.revokeObjectURL = vi.fn();

    // Mock document.createElement
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, "createElement").mockImplementation((tagName: string) => {
      const el = originalCreateElement(tagName);
      if (tagName === "a") {
        el.click = vi.fn();
        createdElements.push(el);
      }
      return el;
    });

    appendChildSpy = vi.spyOn(document.body, "appendChild");
    removeChildSpy = vi.spyOn(document.body, "removeChild");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("exportAsCSV", () => {
    it("should do nothing if data is empty or null", () => {
      exportAsCSV([], "empty");
      // @ts-expect-error test null
      exportAsCSV(null, "null-data");
      expect(appendChildSpy).not.toHaveBeenCalled();
    });

    it("should generate proper CSV and trigger download", () => {
      const sampleData = [
        { name: "Alpha", metric: "100k", notes: 'Includes "quotes" and, commas' },
        { name: "Beta", metric: "250k", notes: "Simple notes" },
      ];

      exportAsCSV(sampleData, "test-export");

      expect(createdElements.length).toBe(1);
      const link = createdElements[0];
      expect(link.download).toBe("test-export.csv");
      expect(link.href).toBe("blob:mock-url");
      expect(link.click).toHaveBeenCalled();
      expect(appendChildSpy).toHaveBeenCalledWith(link);
      expect(removeChildSpy).toHaveBeenCalledWith(link);
      expect(global.URL.revokeObjectURL).toHaveBeenCalledWith("blob:mock-url");
    });
  });

  describe("exportAsPDF", () => {
    it("should return early if the target element does not exist", async () => {
      const getElementSpy = vi.spyOn(document, "getElementById").mockReturnValue(null);
      await exportAsPDF("non-existent-id", "test-doc");
      expect(getElementSpy).toHaveBeenCalledWith("non-existent-id");
    });
  });
});
