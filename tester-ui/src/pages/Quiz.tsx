import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  CheckboxGroup,
  Divider,
  Radio,
  RadioGroup,
  cn,
} from "@nextui-org/react";
import { useState } from "react";
import { Question, useQuestionsStore } from "../store/questionsStore";
import { useParams } from "react-router-dom";
import { Answer, useAnswerStore } from "../store/answerStore";
import shuffle from "lodash/shuffle";
import Navbar from "../components/Navbar";

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
        choices: shuffle([...question.choices]),
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
      <Navbar />
      <main className={cn("container mx-auto p-2 pb-3")}>
        <Card className="rounded-md">
          <CardHeader className={cn("px-6")}>{currentQuestion.id}</CardHeader>
          <Divider />
          <CardBody className={cn("flex flex-col gap-4 px-6")}>
            <p>{currentQuestion.question}</p>
            {currentQuestion.answers.length === 1 ? (
              <RadioGroup
                value={currentQuestion.userAnswers[0] ?? ""}
                onValueChange={(change) => selectQuizAnswers([change])}
                isDisabled={currentQuestion.isSubmitted}
              >
                {currentQuestion.choices.map((choice, i) => (
                  <Radio
                    value={choice.letter}
                    key={"choice" + choice.letter}
                    classNames={{
                      base: cn(
                        "max-w-full rounded-lg border-2 border-transparent",
                        currentQuestion.isSubmitted &&
                          currentQuestion.answers.includes(choice.letter) &&
                          "border-green-600"
                      ),
                      label: cn("ml-2"),
                    }}
                  >
                    <span className="font-semibold">
                      {String.fromCharCode(65 + i)}.
                    </span>
                    &nbsp;
                    {choice.text}
                  </Radio>
                ))}
              </RadioGroup>
            ) : (
              <CheckboxGroup
                value={currentQuestion.userAnswers}
                onValueChange={(change) => selectQuizAnswers(change)}
                isDisabled={currentQuestion.isSubmitted}
              >
                {currentQuestion.choices.map((choice, i) => (
                  <Checkbox
                    value={choice.letter}
                    key={"choice" + choice.letter}
                    classNames={{
                      base: cn(
                        "max-w-full rounded-lg border-2 border-transparent",
                        currentQuestion.isSubmitted &&
                          currentQuestion.answers.includes(choice.letter) &&
                          "border-green-600"
                      ),
                      label: cn("ml-2"),
                    }}
                  >
                    <span className="font-semibold">
                      {String.fromCharCode(65 + i)}.
                    </span>
                    &nbsp;{choice.text}
                  </Checkbox>
                ))}
              </CheckboxGroup>
            )}
          </CardBody>
          <CardFooter className="px-6">
            <div className={cn("w-full flex justify-between")}>
              <Button
                variant="light"
                color="primary"
                onClick={() => setIndex(index - 1)}
                isDisabled={index === 0}
              >
                Previous
              </Button>
              {currentQuestion.isSubmitted ? (
                <Button
                  variant="solid"
                  color="primary"
                  onClick={() => setIndex(index + 1)}
                  isDisabled={
                    index >= quizQuestions.length ||
                    !currentQuestion.isSubmitted
                  }
                >
                  Next
                </Button>
              ) : (
                <Button
                  variant="solid"
                  color="primary"
                  onClick={submitQuizAnswers}
                  isDisabled={currentQuestion.userAnswers.length === 0}
                >
                  Check Answer
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </main>
    </>
  );
}

export default Quiz;
