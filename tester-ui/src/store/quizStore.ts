import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { QuestionId, useQuestionsStore } from "./questionsStore";

class Answer {
  answers: string[];
  isCorrect: boolean;

  constructor() {
    this.answers = [];
    this.isCorrect = false;
  }
}

interface QuizStore {
  quiz: Map<QuestionId, Answer>;
  setQuiz: (size?: number) => void;
  resetQuizAnswers: () => void;
  setAnswer: (questionId: QuestionId, answers: string[]) => boolean;
}

export const useQuizStore = create<QuizStore>()(
  persist(
    (set, get) => ({
      quiz: new Map<QuestionId, Answer>(),
      setQuiz: (size: number = 10) => {
        const newQuiz = new Map<QuestionId, Answer>();
        useQuestionsStore
          .getState()
          .getRandomQuestion(size)
          .forEach((question) => newQuiz.set(question.id, new Answer()));
        set({
          quiz: newQuiz,
        });
      },
      resetQuizAnswers: () => {
        get().quiz.forEach((_, questionId, quiz) => {
          set({
            quiz: new Map(quiz).set(questionId, new Answer()),
          });
        });
      },
      setAnswer: (questionId: string, answers: string[]) => {
        const question = useQuestionsStore()
          .getById(questionId)
          .get(questionId);
        const isCorrect =
          answers.every((answer) => question?.answers.includes(answer)) &&
          answers.length === question?.answers.length;

        set((state) => ({
          quiz: new Map(state.quiz).set(questionId, {
            answers,
            isCorrect,
          }),
        }));
        return isCorrect;
      },
    }),
    {
      name: "quiz-storage",
      storage: createJSONStorage(() => localStorage, {
        reviver: (key, value) => {
          if (key === "quiz") {
            return new Map<QuestionId, Answer>(value as [QuestionId, Answer][]);
          }
          return value;
        },
        replacer: (key, value) => {
          if (key === "quiz") {
            return Array.from(value as Map<QuestionId, Answer>);
          }
          return value;
        },
      }),
      partialize: (state) => ({ quiz: state.quiz }),
    }
  )
);
