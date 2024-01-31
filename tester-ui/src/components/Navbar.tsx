import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="p-4 text-center">
      <Link className="font-bold text-inherit" to="/">
        ExamTopics Tester - AWS Certified Solutions Architect
      </Link>
    </div>
  );
}
