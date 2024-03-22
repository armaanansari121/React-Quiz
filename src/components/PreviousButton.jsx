import React from "react";
import { useQuiz } from "../contexts/QuizContext";

function PreviousButton() {
  const { dispatch, index } = useQuiz();

  if (index === 0) return;
  if (index > 0)
    return (
      <div>
        <button
          className="btn btn-ui"
          onClick={() => dispatch({ type: "previousQuestion" })}
        >
          Previous
        </button>
      </div>
    );
}

export default PreviousButton;
