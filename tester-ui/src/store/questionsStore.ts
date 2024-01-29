import questions from "../assets/questions.json";
import { create } from "zustand";
import shuffle from "lodash/shuffle";

export type Question = {
  id: string;
  question: string;
  choices: { text: string; letter: string }[];
  answers: string[];
};

export type QuestionId = Question["id"];

interface QuestionsStore {
  size: number;
  getById: (...questionIds: QuestionId[]) => Map<QuestionId, Question>;
  getRandomQuestion: (quantity: number) => Question[];
  getQuestions: (offset: number, limit: number) => Question[];
}

const questionsMap = new Map<QuestionId, Question>();
questions.forEach((question) => questionsMap.set(question.id, question));

export const useQuestionsStore = create<QuestionsStore>(() => ({
  size: questions.length,
  getById: (...questionIds: QuestionId[]) => {
    const q = new Map<QuestionId, Question>();
    questionIds.forEach((id) => {
      if (!questionsMap.has(id)) {
        throw new Error(`question id not found: ${id}`);
      }
      q.set(id, questionsMap.get(id)!);
    });
    return q;
  },
  getRandomQuestion: (quantity: number = 1) => {
    const maxLength = questions.length;
    if (quantity >= maxLength) {
      quantity = maxLength;
    }
    return shuffle(questions).slice(0, quantity);
  },
  getQuestions: (offset: number, limit: number) =>
    questions.slice(offset, limit),
}));
