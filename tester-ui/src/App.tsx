import { Button } from "@nextui-org/react";
import { Link } from "react-router-dom";
import { useQuestionsStore } from "./store/questionsStore";

const QUIZ_LENGTH = 10;

function App() {
  const numOfQuestions = useQuestionsStore((state) => state.size);
  const quizStartingNumbers = [];
  for (let i = 1; i < numOfQuestions; i += QUIZ_LENGTH) {
    quizStartingNumbers.push(i);
  }

  return (
    <>
      <p>{numOfQuestions} Questions!</p>
      {quizStartingNumbers.map((start) => {
        const end = start + QUIZ_LENGTH - 1;
        return (
          <Link to={`/quiz/${start}...${end}`} key={`/quiz/${start}...${end}`}>
            <Button>
              Questions {start} - {end}
            </Button>
          </Link>
        );
      })}
    </>
  );
}

export default App;
