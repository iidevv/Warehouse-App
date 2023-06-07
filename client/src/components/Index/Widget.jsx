import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

const Widget = (props) => {
  const data = {
    labels: ["No Changes", "Updated", "Created", "Error"],
    datasets: [
      {
        data: [props.data.noChangesTotal, props.data.updatedTotal, props.data.createdTotal, props.data.errorTotal],
        backgroundColor: [
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 99, 132, 0.6)",
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };
  ChartJS.register(ArcElement, Tooltip, Legend);
  return (
    <>
      <div className="relative w-full px-4 py-6 bg-white shadow-lg">
        <a
          className="flex items-center justify-center text-xl font-medium mb-6 no-underline hover:underline"
          href={props.link}
        >
          <span className="mr-2">{props.title} ({props.data.total})</span>
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 14L7.5 15.5C6.8369 16.1629 5.93765 16.5353 5 16.5353C4.06236 16.5353 3.1631 16.1629 2.5 15.5C1.83707 14.8369 1.46466 13.9376 1.46466 13C1.46466 12.0624 1.83707 11.1631 2.5 10.5L5.5 7.5C6.1631 6.83707 7.06236 6.46466 8 6.46466C8.93765 6.46466 9.8369 6.83707 10.5 7.5"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M9 4L10.5 2.5C11.1631 1.83707 12.0624 1.46466 13 1.46466C13.9376 1.46466 14.8369 1.83707 15.5 2.5C16.1629 3.1631 16.5353 4.06236 16.5353 5C16.5353 5.93765 16.1629 6.8369 15.5 7.5L12.5 10.5C11.8369 11.1629 10.9376 11.5353 10 11.5353C9.06236 11.5353 8.1631 11.1629 7.5 10.5"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </a>
        <div>
          <Pie data={data} />
        </div>
      </div>
    </>
  );
};

export default Widget;
