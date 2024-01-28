import { Button } from "@nextui-org/react";
import { useQuizStore } from "../store/quizStore";
import { useEffect, useMemo } from "react";
import {
  Question,
  QuestionId,
  useQuestionsStore,
} from "../store/questionsStore";

function Quiz() {
  const quiz = useQuizStore((state) => state.quiz);
  const setQuiz = useQuizStore((state) => state.setQuiz);
  const getQuestionsById = useQuestionsStore((state) => state.getById);

  const questions = useMemo(() => {
    const ids = Array.from(quiz.keys());
    return getQuestionsById(...ids);
  }, [quiz]);

  return (
    <>
      <p>Quiz: {JSON.stringify(Array.from(quiz.keys()))}</p>
      <Button onClick={() => setQuiz(10)}>setQuiz</Button>

      {Array.from(questions.values()).map((question) => {
        return (
          <div key={question?.id}>
            <p>{question.question}</p>
            <p>{JSON.stringify(Array.from(question.choices))}</p>
          </div>
        );
      })}
    </>
  );
}

export default Quiz;
