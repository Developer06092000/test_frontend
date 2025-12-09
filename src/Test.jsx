import React from "react";
import { useEffect, useState } from "react";

const Test = ({ changeStatus, data }) => {
  const [num, setNum] = useState((localStorage.getItem("num") && Number(localStorage.getItem("num"))) || 0);
  const [questions, setQuestions] = useState(
    (localStorage.getItem("questions") && JSON.parse(localStorage.getItem("questions"))) ||
      data.map((obj) => ({ id: obj.id, answer: "" }))
  );

  const [answer, setAnswer] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const calculateTimeLeft = () => {
    const difference = localStorage.getItem("time") - new Date();
    if (difference <= 0) {
      changeStatus("end");
      return localStorage.removeItem("time");
    }
    return {
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    if (!localStorage.getItem("num")) {
      localStorage.setItem("num", 0);
    }
    if (!localStorage.getItem("questions")) {
      localStorage.setItem("questions", JSON.stringify(data.map((obj) => ({ id: obj.id, answer: "" }))));
    }
    if (!localStorage.getItem("time")) {
      localStorage.setItem("time", new Date().setTime(new Date().getTime() + 1800000));
    }
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (questions[num].answer.length !== 0) {
      setAnswer(data[num].answers.indexOf(questions[num].answer));
    }
  }, [num]);

  const changeNum = (idx) => {
    if (questions[idx].answer.length !== 0) {
      setAnswer(data[idx].answers.indexOf(questions[idx].answer));
    } else {
      setAnswer(null);
    }
    localStorage.setItem("num", idx);
    setNum(idx);
  };

  const submitHandle = (e) => {
    e.preventDefault();
    let arr = questions;
    arr[num] = answer !== null ? { id: data[num].id, answer: data[num].answers[answer] } : arr[num];
    localStorage.setItem("questions", JSON.stringify(arr));
    let numb =
      num !== questions.length - 1
        ? num + 1
        : questions.findIndex((item) => item.answer.length === 0) !== -1
        ? questions.findIndex((item) => item.answer.length === 0)
        : 0;
    setAnswer(
      data[numb].answers.indexOf(questions[numb].answer) !== -1
        ? data[numb].answers.indexOf(questions[numb].answer)
        : null
    );
    setNum(numb);
    localStorage.setItem("num", numb);
    setQuestions(arr);
  };

  return (
    <div className="test_app">
      <div className="timeline">
        <progress
          value={((timeLeft?.minutes * 60 + timeLeft?.seconds) * 100) / (60 * 30)}
          max={100}
          className="timeline_progress"
        />
        <div>
          {String(timeLeft?.minutes).padStart(2, "0")}:{String(timeLeft?.seconds).padStart(2, "0")}
        </div>
      </div>
      <div className="test">
        <div className="test_question">{`${[num + 1]}. ` + data[num].question}</div>
        <form onSubmit={submitHandle}>
          {data[num].answers.map((ans, idx) => {
            return (
              <div
                key={idx}
                className={"test_answer" + (answer !== null ? (answer === idx ? " test_answer_active" : "") : "")}
              >
                <input
                  type="radio"
                  name="answer"
                  value={idx + 1}
                  id={"answer" + (idx + 1)}
                  checked={answer === idx}
                  onChange={() => setAnswer(idx)}
                />
                <label htmlFor={"answer" + (idx + 1)} onClick={() => setAnswer(idx)}>
                  {ans}
                </label>
              </div>
            );
          })}
          <button className="btn" type="submit">
            Saqlash
          </button>
        </form>
      </div>
      <div className="test_number">
        Savollar
        <div className="test_number_q">
          {data.map((ques, idx) => {
            return (
              <div
                key={idx}
                className={
                  "test_number_n" +
                  ((questions[idx].answer && questions[idx].answer.length !== 0) || num === idx
                    ? " test_number_n_active"
                    : "")
                }
                onClick={() => changeNum(idx)}
              >
                {idx + 1}
              </div>
            );
          })}
        </div>
        <button className="btn btn_end" onClick={() => setShowModal(true)}>
          Testni yakunlash
        </button>
      </div>
      <div className={"modal" + (showModal ? "" : " show")}>
        <div className="modal1">
          <h2>Testni yakunlashni xoxlaysizmi?</h2>
          <button
            className="btn btn1"
            onClick={() => {
              changeStatus("end");
            }}
          >
            Ha
          </button>
          <button className="btn btn2" onClick={() => setShowModal(false)}>
            Yo'q
          </button>
        </div>
      </div>
    </div>
  );
};

export default Test;
