import React from "react";
import he from "he";

export default function Questions() {
  const [question, setQuestion] = React.useState([]);
  const [displayQuestion, setDisplayQuestion] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (displayQuestion) {
      setIsLoading(true);
      fetch("https://opentdb.com/api.php?amount=5")
        .then((res) => res.json())
        .then((data) => {
          setQuestion(data.results);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Fetch error:", err);
          setIsLoading(false);
        });

      return;
    }
  }, [displayQuestion]);

  function show() {
    setDisplayQuestion((prev) => !prev);
  }

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
        {options.map((option) => {
          return (
            <div key={option} className="option-container">
              <input
                id={option}
                className="radio-btn"
                type="radio"
                value={option}
                name={q.question}
                onClick={(e) => console.log(e.currentTarget.value)}
              />
              <label className="choices" htmlFor={option}>
                {he.decode(option)}
              </label>
            </div>
          );
        })}
        <hr />
      </div>
    );
  });
  return (
    <>
      {displayQuestion ? (
        isLoading ? (
          <p>Loading...</p>
        ) : (
          <section>
            {questionElements}
            <button className="check-answer">Check answers</button>
          </section>
        )
      ) : (
        <button onClick={show}>Questions</button>
      )}
    </>
  );
}
