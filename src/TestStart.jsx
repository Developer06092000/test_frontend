import React from "react";

const TestStart = ({ changeStatus }) => {
  return (
    <div className="test_start">
      <h3>Fan: G'aznachilik</h3>
      <p>Mazkur test 25 ta savoldan iborat bo'lib, ishlash uchun 30 daqiqa vaqt ajratilgan.</p>
      <button className="btn btn_end" onClick={() => changeStatus("test")}>
        boshlash
      </button>
    </div>
  );
};

export default TestStart;
