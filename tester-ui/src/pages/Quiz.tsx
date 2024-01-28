import {
  Button,
  Checkbox,
  CheckboxGroup,
  Radio,
  RadioGroup,
} from "@nextui-org/react";
import { useQuizStore } from "../store/quizStore";
import { useMemo, useState } from "react";
import { useQuestionsStore } from "../store/questionsStore";

function Quiz() {
  const quiz = useQuizStore((state) => state.quiz);
  const setQuiz = useQuizStore((state) => state.setQuiz);
  const getQuestionsById = useQuestionsStore((state) => state.getById);

  const questionIds = useMemo(() => Array.from(quiz.keys()), [quiz]);
  const questions = useMemo(() => getQuestionsById(...questionIds), [quiz]);

  const [index, setIndex] = useState(0);
  const currentQuestion = useMemo(
    () => questions.get(questionIds[index]),
    [questionIds, index]
  );

  if (!currentQuestion) return "Loading";

  const AnswerGroupComponent =
    currentQuestion.answers.length === 1 ? RadioGroup : CheckboxGroup;
  const AnswerSelectionComponent =
    currentQuestion.answers.length === 1 ? Radio : Checkbox;

  return (
    <>
      <p>Quiz: {JSON.stringify(Array.from(quiz.keys()))}</p>
      <Button onClick={() => setQuiz(10)}>setQuiz</Button>

      <p>{currentQuestion.question}</p>
      <AnswerGroupComponent>
        {currentQuestion.choices.map((choice) => {
          return (
            <AnswerSelectionComponent value={choice.letter}>
              {choice.letter}. {choice.text}
            </AnswerSelectionComponent>
          );
        })}
      </AnswerGroupComponent>
    </>
  );
}

export default Quiz;
