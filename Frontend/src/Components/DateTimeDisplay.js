import React, { useEffect, useState } from "react";
import "./DateTimeDisplay.css";

const DateTimeDisplay = () => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      const dateOptions = { year: "numeric", month: "long", day: "numeric" };
      const formattedDate = now.toLocaleDateString("en-US", dateOptions);

      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "pm" : "am";
      hours = hours % 12 || 12;

      const formattedTime = `${hours}:${minutes} ${ampm}`;

      setDate(formattedDate);
      setTime(formattedTime);
    };

    updateDateTime(); // Initial run
    const interval = setInterval(updateDateTime, 60000); // Update every 60s

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="datetime-container">
      <div>
        <span className="label">Day </span>
        <span className="value">{date}</span>
      </div>
      <div>
        <span className="label">Time </span>
        <span className="value">{time}</span>
      </div>
    </div>
  );
};

export default DateTimeDisplay;