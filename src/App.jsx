import { useEffect, useReducer } from "react";
import Header from "./components/Header";
import Main from "./components/Main";
import Loader from "./components/Loader";
import ErrorMessage from "./components/ErrorMessage";
import StartScreen from "./components/StartScreen";
import Question from "./components/Question";
import NextButton from "./components/NextButton";
import Progress from "./components/Progress";
import FinishedScreen from "./components/FinishedScreen";
import Timer from "./components/Timer";
import Footer from "./components/Footer";
import PreviousButton from "./components/PreviousButton";

const SECS_PER_QUESTION = 15;

const initialState = {
  questions: [],

  // 'loading','error','ready','active','finished'
  status: "loading",
  index: 0,
  answer: null,
  answers: null,
  filter: "default",
  points: 0,
  highscore: 0,
  secondsRemaining: null,
};

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function reducer(state, action) {
  switch (action.type) {
    case "dataRecieved":
      initialState.questions = action.payload;
      initialState.answers = Array(action.payload.length).fill(null);
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };

    case "dataFailed":
      return {
        ...state,
        status: "error",
      };

    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };

    case "newAnswer":
      const question = state.questions.at(state.index);

      return {
        ...state,
        answers: state.answers.map((answer, i) =>
          i === state.index ? action.payload : answer
        ),
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };

    case "nextQuestion":
      return {
        ...state,
        index: state.index + 1,
      };

    case "previousQuestion":
      return {
        ...state,
        index: state.index - 1,
      };

    case "finished":
      console.log(Math.max(state.highscore, state.points));
      return {
        ...state,
        status: "finished",
        highscore: Math.max(state.highscore, state.points),
      };

    case "restart":
      return {
        ...initialState,
        highscore: state.highscore,
        status: "ready",
      };

    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining <= 0 ? "finished" : state.status,
        highscore:
          state.secondsRemaining <= 0
            ? Math.max(state.highscore, state.points)
            : state.highscore,
      };

    case "filter":
      let newQuestions = [];
      switch (action.payload) {
        case "default":
          newQuestions = shuffleArray(initialState.questions);
          return {
            ...state,
            questions: newQuestions,
            filter: "default",
            answers: Array(newQuestions.length).fill(null),
          };
        case "random5":
          newQuestions = shuffleArray(initialState.questions).slice(0, 5);
          return {
            ...state,
            questions: newQuestions,
            filter: "random5",
            answers: Array(newQuestions.length).fill(null),
          };
        case "random10":
          newQuestions = shuffleArray(initialState.questions).slice(0, 10);
          return {
            ...state,
            questions: newQuestions,
            filter: "random10",
            answers: Array(newQuestions.length).fill(null),
          };
        case "easy":
          newQuestions = shuffleArray(
            initialState.questions.filter((question) => question.points <= 10)
          );
          return {
            ...state,
            questions: newQuestions,
            filter: "easy",
            answers: Array(newQuestions.length).fill(null),
          };
        case "medium":
          newQuestions = shuffleArray(
            initialState.questions.filter((question) => question.points <= 20)
          );
          return {
            ...state,
            questions: newQuestions,
            filter: "medium",
            answers: Array(newQuestions.length).fill(null),
          };
        case "hard":
          newQuestions = shuffleArray(
            initialState.questions.filter((question) => question.points <= 30)
          );
          return {
            ...state,
            questions: newQuestions,
            filter: "hard",
            answers: Array(newQuestions.length).fill(null),
          };
        default:
          throw new Error("Unknown filter");
      }

    default:
      throw new Error("Unknown action");
  }
}

function App() {
  const [
    { questions, status, index, answers, points, highscore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const maxPoints = questions.reduce(
    (acc, question) => acc + question.points,
    0
  );

  useEffect(function () {
    async function fetchQuestions() {
      try {
        const res = await fetch(
          "https://my-json-server.typicode.com/armaanansari121/React-Quiz/questions/"
        );
        const data = await res.json();
        dispatch({ type: "dataRecieved", payload: data });
      } catch (err) {
        dispatch({ type: "dataFailed" });
        console.error(err.message);
      }
    }
    fetchQuestions();
  }, []);

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <ErrorMessage />}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            <Progress
              index={index}
              numQuestions={numQuestions}
              points={points}
              maxPoints={maxPoints}
              answer={answers.at(index)}
            />
            <Question
              question={questions.at(index)}
              dispatch={dispatch}
              answer={answers.at(index)}
            />
            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
              <NextButton
                dispatch={dispatch}
                index={index}
                numQuestions={numQuestions}
              />
              <PreviousButton dispatch={dispatch} index={index} />
            </Footer>
          </>
        )}
        {status === "finished" && (
          <FinishedScreen
            points={points}
            maxPoints={maxPoints}
            highscore={highscore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}

export default App;
