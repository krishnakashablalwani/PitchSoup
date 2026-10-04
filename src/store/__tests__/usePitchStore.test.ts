import { describe, it, expect, beforeEach } from "vitest";
import { usePitchStore } from "../usePitchStore";

describe("usePitchStore", () => {
  beforeEach(() => {
    usePitchStore.setState({
      startupName: "",
      problem: "",
      solution: "",
      targetMarket: "",
      deckData: null,
      qnaHistory: [],
    });
  });

  it("should initialize with default empty values", () => {
    const state = usePitchStore.getState();
    expect(state.startupName).toBe("");
    expect(state.problem).toBe("");
    expect(state.solution).toBe("");
    expect(state.targetMarket).toBe("");
    expect(state.deckData).toBeNull();
    expect(state.qnaHistory).toEqual([]);
  });

  it("should set form data properly", () => {
    usePitchStore.getState().setFormData({
      startupName: "SoupAI",
      problem: "Founders fail to pitch clearly",
      solution: "AI Pitch Deck & Coach",
      targetMarket: "First-time founders",
    });

    const state = usePitchStore.getState();
    expect(state.startupName).toBe("SoupAI");
    expect(state.problem).toBe("Founders fail to pitch clearly");
    expect(state.solution).toBe("AI Pitch Deck & Coach");
    expect(state.targetMarket).toBe("First-time founders");
  });

  it("should set deck data properly", () => {
    const mockDeck = {
      startupName: "SoupAI",
      oneLiner: "Cook the best pitch",
      slides: [
        {
          slideNumber: 1,
          title: "The Problem",
          headline: "Pitching is hard",
          bulletPoints: ["Point 1", "Point 2"],
          keyMetricOrTip: "High failure rate",
        },
      ],
    };

    usePitchStore.getState().setDeckData(mockDeck);
    expect(usePitchStore.getState().deckData).toEqual(mockDeck);
  });

  it("should append QnA items and update the last answer", () => {
    const store = usePitchStore.getState();
    store.addQnA({ question: "What is your defensible moat?" });

    expect(usePitchStore.getState().qnaHistory).toHaveLength(1);
    expect(usePitchStore.getState().qnaHistory[0].question).toBe("What is your defensible moat?");

    usePitchStore.getState().updateLastAnswer("Proprietary dataset and network effects.");
    expect(usePitchStore.getState().qnaHistory[0].founderAnswer).toBe("Proprietary dataset and network effects.");
  });

  it("should update the last score and feedback", () => {
    const store = usePitchStore.getState();
    store.addQnA({ question: "Explain unit economics", founderAnswer: "CAC is $100, LTV is $1200" });

    usePitchStore.getState().updateLastScore(9, "Excellent LTV to CAC ratio.");

    const lastQnA = usePitchStore.getState().qnaHistory[0];
    expect(lastQnA.score).toBe(9);
    expect(lastQnA.feedback).toBe("Excellent LTV to CAC ratio.");
  });

  it("should safely handle updates when QnA history is empty", () => {
    expect(() => {
      usePitchStore.getState().updateLastAnswer("Answer with no questions");
      usePitchStore.getState().updateLastScore(10, "No question exists");
    }).not.toThrow();

    expect(usePitchStore.getState().qnaHistory).toEqual([]);
  });
});
