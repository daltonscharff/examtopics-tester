import {
  Button,
  Checkbox,
  CheckboxGroup,
  Radio,
  RadioGroup,
} from "@nextui-org/react";
import { useCallback, useMemo, useState } from "react";
import {
  Question,
  QuestionId,
  useQuestionsStore,
} from "../store/questionsStore";
import { useParams } from "react-router-dom";
import { Answer } from "../store/answerStore";
import isEqual from "lodash/isEqual";
import sortBy from "lodash/sortBy";

type QuizAnswer = Answer & { isSubmitted: boolean };

function Quiz() {
  const { questionRange } = useParams();
  const getQuestions = useQuestionsStore((state) => state.getQuestions);

  const [begin, end] = questionRange!.split("...");
  const questions = getQuestions(
    parseInt(begin, 10) - 1,
    parseInt(end, 10) - 1
  );

  const [index, setIndex] = useState(0);
  const [quizAnswerMap, setQuizAnswerMap] = useState(
    new Map<QuestionId, QuizAnswer>()
  );
  const currentQuestion = questions[index];

  if (!currentQuestion) return "Loading";

  const setQuizAnswers = useCallback(
    (answers: QuizAnswer["answers"]) => {
      setQuizAnswerMap(
        new Map<QuestionId, QuizAnswer>(quizAnswerMap).set(currentQuestion.id, {
          answers,
          isCorrect: false,
          isSubmitted: false,
        })
      );
    },
    [currentQuestion]
  );

  return (
    <>
      <p>{currentQuestion.question}</p>

      {currentQuestion.answers.length === 1 ? (
        <RadioGroup
          value={quizAnswerMap.get(currentQuestion.id)?.answers[0] ?? ""}
          onValueChange={(change) => setQuizAnswers([change])}
        >
          {currentQuestion.choices.map((choice) => (
            <Radio value={choice.letter} key={"choice" + choice.letter}>
              {choice.letter}. {choice.text}
            </Radio>
          ))}
        </RadioGroup>
      ) : (
        <CheckboxGroup
          value={quizAnswerMap.get(currentQuestion.id)?.answers}
          onValueChange={(change) => setQuizAnswers(change)}
        >
          {currentQuestion.choices.map((choice) => (
            <Checkbox value={choice.letter} key={"choice" + choice.letter}>
              {choice.letter}. {choice.text}
            </Checkbox>
          ))}
        </CheckboxGroup>
      )}

      <Button
        onClick={() => {
          const quizAnswers =
            quizAnswerMap.get(currentQuestion.id)?.answers ?? [];
          const actualAnswers = currentQuestion.answers;
          const isCorrect = isEqual(sortBy(quizAnswers), sortBy(actualAnswers));
          setQuizAnswerMap(
            new Map<QuestionId, QuizAnswer>(quizAnswerMap).set(
              currentQuestion.id,
              {
                answers: quizAnswers,
                isCorrect,
                isSubmitted: true,
              }
            )
          );
        }}
        disabled={quizAnswerMap.get(currentQuestion.id)?.answers?.length === 0}
      >
        Check Answer
      </Button>
      <Button onClick={() => setIndex(index - 1)} disabled={index === 0}>
        Previous
      </Button>
      <Button
        onClick={() => setIndex(index + 1)}
        disabled={
          index >= questions.length ||
          !quizAnswerMap.get(currentQuestion.id)?.isSubmitted
        }
      >
        Next
      </Button>
    </>
  );
}

export default Quiz;
