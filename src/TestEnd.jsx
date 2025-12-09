import React, { useEffect, useState } from "react";

const TestEnd = ({ changeStatus }) => {
  const calculateTimeLeft = () => {
    const difference = localStorage.getItem("time_end") - localStorage.getItem("time");
    return {
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  const [show, setShow] = useState(false);

  const [data, setData] = useState(JSON.parse(localStorage.getItem("data")));
  const [questions, setQuestions] = useState(JSON.parse(localStorage.getItem("questions")));

  useEffect(() => {
    if (!data) {
      setData(JSON.parse(localStorage.getItem("data")));
    }
    if (!questions) {
      setQuestions(JSON.parse(localStorage.getItem("questions")));
    }
  }, []);

  return (
    <div className="test_end">
      <h3 style={{ textTransform: "capitalize" }}>Fan: {document.location.hostname}</h3>
      <p>
        <b>Savollar soni: </b>
        {JSON.parse(localStorage.getItem("data")).length} ta
      </p>
      <p>
        <b>To'g'ri javoblar soni: </b>
        {localStorage.getItem("true_answer")} ta
      </p>
      <p>
        <b>Natija: </b> {(localStorage.getItem("true_answer") * 100) / JSON.parse(localStorage.getItem("data")).length}%
      </p>
      <p>
        <b>Vaqt: </b>
        {String(timeLeft?.minutes).padStart(2, "0")}:{String(timeLeft?.seconds).padStart(2, "0")}
      </p>

      {(localStorage.getItem("true_answer") * 100) / JSON.parse(localStorage.getItem("data")).length >= 60 ? (
        <h3 style={{ textAlign: "center" }}>Siz imtihondan o'tdingiz!</h3>
      ) : (
        <h3 style={{ color: "red", textAlign: "center" }}>Siz imtihondan o'ta olmadingiz!</h3>
      )}

      <button
        className="btn btn_end"
        onClick={() => {
          setShow((prev) => !prev);
        }}
      >
        {show ? `Test natijalarini yashirish` : `Test natijalarini ko'rish`}
      </button>
      <button
        className="btn btn_end"
        onClick={() => {
          localStorage.removeItem("time");
          localStorage.removeItem("time_end");
          localStorage.removeItem("questions");
          localStorage.removeItem("true_answer");
          localStorage.removeItem("data");
          changeStatus("test");
        }}
      >
        Qayta boshlash
      </button>
      {show && (
        <div className="test_correct_answers">
          <hr style={{ color: "#3b82f6" }} />
          {data.map((arr, idx) => {
            return (
              <div key={idx}>
                <h4>
                  {idx + 1}. {arr.question}
                </h4>
                {arr.answers.map((arr1, idx1) => {
                  return (
                    <p
                      key={idx1}
                      style={{
                        backgroundColor:
                          questions[idx].answer === arr1
                            ? questions[idx].correct
                              ? "#3b82f6"
                              : "red"
                            : questions[idx].correctAnswer === arr1
                            ? "#3b82f6"
                            : questions[idx].answer.length === 0
                            ? "red"
                            : "inherit",
                        color:
                          questions[idx].answer === arr1 ||
                          questions[idx].correctAnswer === arr1 ||
                          questions[idx].answer.length === 0
                            ? "white"
                            : "black",
                        padding: "8px 16px",
                        borderRadius: 5,
                      }}
                    >
                      {arr1}
                    </p>
                  );
                })}
                {idx + 1 !== JSON.parse(localStorage.getItem("data")).length && <hr style={{ color: "#3b82f6" }} />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TestEnd;
