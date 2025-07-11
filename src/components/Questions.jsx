import React from "react";
import he from "he";

export default function Questions() {
  const [question, setQuestion] = React.useState([]);
  const [displayQuestion, setDisplayQuestion] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showResults, setShowResults] = React.useState(false);
  const [correctAnswers, setCorrectAnswers] = React.useState([]);
  const [selectedAnswers, setSelectedAnswers] = React.useState([]);

  React.useEffect(() => {
    if (displayQuestion) {
      setIsLoading(true);
      fetch("https://opentdb.com/api.php?amount=5")
        .then((res) => res.json())
        .then((data) => {
          const processedQuestions = data.results.map((q) => {
            const options = [...q.incorrect_answers];
            const randomIndex = Math.floor(
              Math.random() * (options.length + 1)
            );
            options.splice(randomIndex, 0, q.correct_answer);
            return { ...q, options };
          });

          setQuestion(processedQuestions); // now includes stable options
          setCorrectAnswers(
            data.results.map((q) => ({
              question: he.decode(q.question),
              answer: q.correct_answer,
            }))
          );

          setSelectedAnswers([]);
          setIsLoading(false);
        });

      return;
    }
  }, [displayQuestion]);

  function show() {
    setDisplayQuestion((prev) => !prev);
  }

  function handleSelect(e) {
    const question = he.decode(e.target.name);
    const answer = e.target.value;
    setSelectedAnswers((prev) => {
      const filtered = prev.filter((item) => item.question !== question);
      return [...filtered, { question, answer }];
    });
  }

  function checkAnswer() {
    setShowResults(true);
  }

  const questionElements = question?.map((q, index) => {
    const decodedQuestion = he.decode(q.question);

    return (
      <div key={index}>
        <p className="question">{decodedQuestion}</p>
        {q.options.map((option) => {
          const selected = selectedAnswers.find(
            (s) => s.question === decodedQuestion
          );
          const isSelected = selected?.answer === option;
          const isCorrectAnswer = q.correct_answer === option;

          let className = "choices";

          if (showResults) {
            if (isSelected && isCorrectAnswer) {
              className = " correct";
            } else if (isSelected && !isCorrectAnswer) {
              className = " wrong";
            } else if (!isSelected && isCorrectAnswer) {
              className = " correct";
            }
          }

          return (
            <div
              key={`${decodedQuestion}-${option}`}
              className="option-container"
            >
              <input
                id={`${decodedQuestion}-${option}`}
                className="radio-btn"
                type="radio"
                value={he.decode(option)}
                name={decodedQuestion}
                disabled={showResults}
                onClick={handleSelect}
              />
              <label
                className={className}
                htmlFor={`${decodedQuestion}-${option}`}
              >
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
            {showResults && (
              <p>
                You got{" "}
                {
                  selectedAnswers.filter((s) =>
                    correctAnswers.find(
                      (c) => c.question === s.question && c.answer === s.answer
                    )
                  ).length
                }{" "}
                out of {question.length} correct!
              </p>
            )}

            <button className="check-answer" onClick={checkAnswer}>
              Check answers
            </button>
          </section>
        )
      ) : (
        <section>
          <h2>Quizzical</h2>
          <button className="check-answer" onClick={show}>
            Start Quiz
          </button>
        </section>
      )}
    </>
  );
}
