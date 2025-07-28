import React from "react";
import "./Legend.css";

const legendData = [
  { color: "#00bfff", label: "Light rain" },
  { color: "#007fff", label: "Moderate rain" },
  { color: "#003f7f", label: "Heavy rain" },
];

function Legend() {
  return (
    <div className="legend-container">
      <span><b>Rain Intensity</b></span>
      {legendData.map((entry) => (
        <div key={entry.label} className="legend-row">
          <span className="legend-color" style={{ backgroundColor: entry.color }}></span>
          <span>{entry.label}</span>
        </div>
      ))}
    </div>
  );
}

export default Legend;