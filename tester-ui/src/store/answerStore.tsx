import { create } from "zustand";
import { QuestionId, useQuestionsStore } from "./questionsStore";
import { createJSONStorage, persist } from "zustand/middleware";

const ANSWER_HISTORY_LENGTH = 5;

export class Answer {
  answers: string[];
  isCorrect: boolean;

  constructor(answers: string[] = [], isCorrect: boolean = false) {
    this.answers = answers;
    this.isCorrect = isCorrect;
  }
}

interface AnswerStore {
  answerHistoryMap: Map<QuestionId, Answer[]>;
  setAnswer: (questionId: QuestionId, answers: string[]) => boolean;
  getMostRecentAnswer: (questionId: QuestionId) => Answer | undefined;
}

export const useAnswerStore = create<AnswerStore>()(
  persist(
    (set, get) => ({
      answerHistoryMap: new Map<QuestionId, Answer[]>(),
      setAnswer: (questionId: string, answers: string[]) => {
        const question = useQuestionsStore()
          .getById(questionId)
          .get(questionId);
        const isCorrect =
          answers.every((answer) => question?.answers.includes(answer)) &&
          answers.length === question?.answers.length;

        let answerHistory = get().answerHistoryMap.get(questionId) ?? [];
        answerHistory.unshift(new Answer(answers, isCorrect));
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
