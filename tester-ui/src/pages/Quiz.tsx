import {
  Button,
  Checkbox,
  CheckboxGroup,
  Radio,
  RadioGroup,
} from "@nextui-org/react";
import { useState } from "react";
import { Question, useQuestionsStore } from "../store/questionsStore";
import { useParams } from "react-router-dom";
import { Answer, useAnswerStore } from "../store/answerStore";

type QuizQuestion = Question & Answer & { isSubmitted: boolean };

function Quiz() {
  const { questionRange } = useParams();
  const getQuestions = useQuestionsStore((state) => state.getQuestions);
  const setUserAnswers = useAnswerStore((state) => state.setUserAnswers);
  const [begin, end] = questionRange!.split("...");

  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>(
    getQuestions(parseInt(begin, 10) - 1, parseInt(end, 10) - 1).map(
      (question) => ({
        ...question,
        userAnswers: [],
        isCorrect: false,
        isSubmitted: false,
      })
    )
  );
  const [index, setIndex] = useState(0);
  const currentQuestion = quizQuestions[index];
  if (!currentQuestion) return "Loading";

  const selectQuizAnswers = (userAnswers: QuizQuestion["userAnswers"]) => {
    const questionList = [...quizQuestions];
    questionList[index] = { ...questionList[index], userAnswers };
    setQuizQuestions(questionList);
  };

  const submitQuizAnswers = () => {
    const isCorrect = setUserAnswers(
      currentQuestion.id,
      currentQuestion.userAnswers
    );
    const questionList = [...quizQuestions];
    questionList[index] = {
      ...questionList[index],
      isCorrect,
      isSubmitted: true,
    };
    setQuizQuestions(questionList);
  };

  return (
    <>
      <p>{currentQuestion.question}</p>
      {currentQuestion.answers.length === 1 ? (
        <RadioGroup
          value={currentQuestion.userAnswers[0] ?? ""}
          onValueChange={(change) => selectQuizAnswers([change])}
          isDisabled={currentQuestion.isSubmitted}
        >
          {currentQuestion.choices.map((choice) => (
            <Radio value={choice.letter} key={"choice" + choice.letter}>
              {choice.letter}. {choice.text}
            </Radio>
          ))}
        </RadioGroup>
      ) : (
        <CheckboxGroup
          value={currentQuestion.userAnswers}
          onValueChange={(change) => selectQuizAnswers(change)}
          isDisabled={currentQuestion.isSubmitted}
        >
          {currentQuestion.choices.map((choice) => (
            <Checkbox value={choice.letter} key={"choice" + choice.letter}>
              {choice.letter}. {choice.text}
            </Checkbox>
          ))}
        </CheckboxGroup>
      )}

      <Button
        onClick={submitQuizAnswers}
        disabled={currentQuestion.userAnswers.length === 0}
      >
        Check Answer
      </Button>
      <Button onClick={() => setIndex(index - 1)} disabled={index === 0}>
        Previous
      </Button>
      <Button
        onClick={() => setIndex(index + 1)}
        disabled={index >= quizQuestions.length || !currentQuestion.isSubmitted}
      >
        Next
      </Button>
    </>
  );
}

export default Quiz;
