"use client";

import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJs,
  Tooltip,
  Legend,
  ArcElement,
  type ChartOptions,
} from "chart.js";

ChartJs.register(Tooltip, Legend, ArcElement);

export default function SuccessRatePieChart() {
  const doughnutChartData = {
    labels: ["Successful", "Failed", "Pending"],
    datasets: [
      {
        data: [85, 10, 5],
        backgroundColor: ["#00B7B5", "#F75270", "#F9E7B2"],
        borderColor: ["#018790", "#DC143C", "#DDC57A"],
        borderWidth: 2,
        hoverBackgroundColor: ["#018790", "#DC143C", "#DDC57A"],
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom" as const,
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 13,
            weight: 500,
          },
        },
      },
      title: {
        display: true,
        text: "Delivery Success Rate",
        font: {
          size: 16,
          weight: "bold" as const,
        },
        padding: {
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleFont: {
          size: 13,
          weight: "bold" as const,
        },
        bodyFont: {
          size: 12,
        },
        borderColor: "#10b981",
        borderWidth: 1,
        callbacks: {
          label(tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.parsed}%`;
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-full p-4">
      <Doughnut data={doughnutChartData} options={options} />
    </div>
  );
}
