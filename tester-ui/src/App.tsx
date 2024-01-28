import { Button } from "@nextui-org/react";
import { Link } from "react-router-dom";
import { useQuestionsStore } from "./store/questionsStore";

function App() {
  const questionsLength = useQuestionsStore((state) => state.size);
  return (
    <>
      <Link to="/study">
        <Button>Study</Button>
      </Link>
      <Link to="/quiz">
        <Button>Quiz</Button>
      </Link>
      <p>{questionsLength} Questions!</p>
    </>
  );
}

export default App;
