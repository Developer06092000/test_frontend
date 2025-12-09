import { useEffect, useState } from "react";
import "./App.css";

import Test from "./Test";
import TestStart from "./TestStart";
import TestEnd from "./TestEnd";
import axios from "axios";

// const url = "http://localhost:5000";
const url = "https://test-backend-sigma-ten.vercel.app";

function App() {
  document.title = document.location.hostname.toUpperCase();
  const [status, setStatus] = useState(localStorage.getItem("status") || "start");
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!localStorage.getItem("status")) {
      localStorage.setItem("status", "start");
    }
    if (localStorage.getItem("data")) {
      setData(JSON.parse(localStorage.getItem("data")));
    }
  }, []);

  const changeStatus = (sts) => {
    if (sts === "test") {
      axios
        .post(url + "/get-random-questions")
        .then((res) => {
          setData(res.data);
          localStorage.setItem("data", JSON.stringify(res.data));
          localStorage.setItem("status", sts);
          setStatus(sts);
        })
        .catch((err) => console.log(err));
    } else if (sts === "end") {
      let data1 = JSON.parse(localStorage.getItem("questions"));
      axios
        .post(`${url}/check-answers`, { data: data1 })
        .then((res) => {
          setStatus(sts);
          localStorage.setItem("status", sts);
          localStorage.setItem("time_end", new Date().getTime() + 1800000);
          localStorage.removeItem("num");
          localStorage.removeItem("num");
          localStorage.setItem("questions", JSON.stringify(res.data.data));
          localStorage.setItem("true_answer", res.data.true_answer);
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="app">
      {status === "start" ? (
        <TestStart changeStatus={changeStatus} />
      ) : status === "test" && data.length ? (
        <Test changeStatus={changeStatus} data={data} />
      ) : status === "end" ? (
        <TestEnd changeStatus={changeStatus} />
      ) : (
        ""
      )}
    </div>
  );
}

export default App;
