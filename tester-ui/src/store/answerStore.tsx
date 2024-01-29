import { create } from "zustand";
import { QuestionId, useQuestionsStore } from "./questionsStore";
import { createJSONStorage, persist } from "zustand/middleware";
import isEqual from "lodash/isEqual";
import sortBy from "lodash/sortBy";

const ANSWER_HISTORY_LENGTH = 5;

export type Answer = {
  userAnswers: string[];
  isCorrect: boolean;
};

interface AnswerStore {
  answerHistoryMap: Map<QuestionId, Answer[]>;
  setUserAnswers: (questionId: QuestionId, answers: string[]) => boolean;
  getMostRecentAnswer: (questionId: QuestionId) => Answer | undefined;
}

export const useAnswerStore = create<AnswerStore>()(
  persist(
    (set, get) => ({
      answerHistoryMap: new Map<QuestionId, Answer[]>(),
      setUserAnswers: (questionId: string, userAnswers: string[]) => {
        const question = useQuestionsStore
          .getState()
          .getById(questionId)
          .get(questionId);
        const isCorrect = isEqual(
          sortBy(question?.answers),
          sortBy(userAnswers)
        );

        let answerHistory = get().answerHistoryMap.get(questionId) ?? [];
        answerHistory.unshift({ userAnswers, isCorrect });
        answerHistory = answerHistory.slice(0, ANSWER_HISTORY_LENGTH);

        set((state) => ({
          answerHistoryMap: new Map(state.answerHistoryMap).set(
            questionId,
            answerHistory
          ),
        }));
        return isCorrect;
      },
      getMostRecentAnswer: (questionId: string) =>
        get().answerHistoryMap.get(questionId)?.[0],
    }),
    {
      name: "quiz-storage",
      storage: createJSONStorage(() => localStorage, {
        reviver: (key, value) => {
          if (key === "answerHistoryMap") {
            return new Map<QuestionId, Answer>(value as [QuestionId, Answer][]);
          }
          return value;
        },
        replacer: (key, value) => {
          if (key === "answerHistoryMap") {
            return Array.from(value as Map<QuestionId, Answer>);
          }
          return value;
        },
      }),
      partialize: (state) => ({ answerHistoryMap: state.answerHistoryMap }),
    }
  )
);
