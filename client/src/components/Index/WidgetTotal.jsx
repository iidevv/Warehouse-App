import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

const WidgetTotal = (props) => {
  return (
    <>
      <div className="relative w-full px-4 py-6 bg-white shadow-lg">
        <a className="block text-xl font-medium mb-6" href={props.link}>
          Total Products (999)
        </a>
        <p>No Changes: <b>12</b></p>
        <p>Updated: <b>12</b></p>
        <p>Created: <b>12</b></p>
        <p>Error: <b>12</b></p>
        <div></div>
      </div>
    </>
  );
};

export default WidgetTotal;
