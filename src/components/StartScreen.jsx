import React from "react";
import { useQuiz } from "../contexts/QuizContext";

function StartScreen() {
  const { numQuestions, dispatch } = useQuiz();

  return (
    <div className="start">
      <h2>Welcome to The React Quiz!</h2>
      <h3>{numQuestions} questions to test your React Mastery</h3>
      <div>
        <button
          className="btn btn-ui"
          onClick={() => dispatch({ type: "start" })}
        >
          Let's Start
        </button>
        <select
          className="btn btn-ui"
          onChange={(e) =>
            dispatch({ type: "filter", payload: e.target.value })
          }
        >
          <option value="default">Default</option>
          <option value="random5">Random 5</option>
          <option value="random10">Random 10</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <span className="filter">Filter By :</span>
      </div>
    </div>
  );
}

export default StartScreen;
