import { Button } from "@nextui-org/react";
import { db } from "./store/questionsDb";
import { useLiveQuery } from "dexie-react-hooks";
import { Link } from "react-router-dom";

function App() {
  const questionsLength = useLiveQuery(() => db.questions.count());
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
