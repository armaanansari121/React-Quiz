import React from "react";

function PreviousButton({ dispatch, index }) {
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
