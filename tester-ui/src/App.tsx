import { Card, CardBody, Progress, cn } from "@nextui-org/react";
import { Link } from "react-router-dom";
import { useQuestionsStore } from "./store/questionsStore";
import { useAnswerStore } from "./store/answerStore";
import Navbar from "./components/Navbar";

const QUIZ_LENGTH = 10;

function App() {
  const numOfQuestions = useQuestionsStore((state) => state.size);
  const quizStartingNumbers = [];
  for (let i = 1; i < numOfQuestions; i += QUIZ_LENGTH) {
    quizStartingNumbers.push(i);
  }

  return (
    <>
      <Navbar />
      <main className={cn("container mx-auto p-2 pb-3 flex flex-col gap-4")}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 flex-wrap">
          {quizStartingNumbers.map((start) => {
            const getQuestions = useQuestionsStore(
              (state) => state.getQuestions
            );
            const getMostRecentAnswer = useAnswerStore(
              (state) => state.getMostRecentAnswer
            );
            const end = start + QUIZ_LENGTH - 1;
            const questions = getQuestions(start - 1, end - 1);
            const percentCorrect =
              (questions.reduce((total, question) => {
                if (getMostRecentAnswer(question.id)?.isCorrect) {
                  return (total += 1);
                }
                return total;
              }, 0) /
                QUIZ_LENGTH) *
              100;
            return (
              <Link
                to={`/quiz/${start}...${end}`}
                key={`/quiz/${start}...${end}`}
              >
                <Card className="rounded-sm hover:bg-zinc-50">
                  <CardBody className="px-4">
                    Questions #{start} - #{end}
                  </CardBody>
                  <Progress
                    size="sm"
                    color="success"
                    aria-label="Percent correct"
                    value={percentCorrect}
                  />
                </Card>
              </Link>
            );
          })}
        </div>
      </main>
    </>
  );
}

export default App;
