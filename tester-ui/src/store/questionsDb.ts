import questions from "../assets/questions.json";
import Dexie, { Table } from "dexie";

type Question = {
  id: string;
  question: string;
  choices: { text: string; letter: string }[];
  answers: string[];
};

class QuestionsDatabase extends Dexie {
  public questions!: Table<Question, string>;

  public constructor() {
    super("QuestionsDatabase");
    this.version(1).stores({
      questions: "++id,question,choices,answers",
    });

    this.questions.count().then((count) => {
      if (count === 0) this.questions.bulkAdd(questions);
    });
  }
}

export const db = new QuestionsDatabase();
