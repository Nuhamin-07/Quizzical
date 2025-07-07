import React from "react";
import he from "he";

export default function Questions() {
  const [question, setQuestion] = React.useState([]);
  const [displayQuestion, setDisplayQuestion] = React.useState(false);
  //const [choosenOption, setChoosenOption] = React.useState("");

  React.useEffect(() => {
    displayQuestion &&
      fetch("https://opentdb.com/api.php?amount=5")
        .then((res) => res.json())
        .then((data) => setQuestion(data.results))
        .catch((err) => console.error("Fetch error:", err));
  }, [displayQuestion]);

  function show() {
    setDisplayQuestion((prev) => !prev);
  }
  console.log(question);
  const questionElements = question?.map((q, index) => {
    const randomIndex = Math.floor(
      Math.random() * q.incorrect_answers.length + 1
    );
    const options = [...q.incorrect_answers];
    options.splice(randomIndex, 0, q.correct_answer);
    console.log(options);
    return (
      <div key={index}>
        <p className="question">{he.decode(q.question)}</p>
        {options.map((incorrect) => {
          return (
            <button key={incorrect} className="choices">
              <input
                id={incorrect}
                className="radio-btn"
                type="radio"
                value={incorrect}
                name={q.question}
                onClick={(e) => console.log(e.currentTarget.value)}
              />
              <label htmlFor={incorrect}>{he.decode(incorrect)}</label>
            </button>
          );
        })}
        <hr />
      </div>
    );
  });
  return (
    <>
      <section>{questionElements}</section>
      <button onClick={show}>Questions</button>
    </>
  );
}
