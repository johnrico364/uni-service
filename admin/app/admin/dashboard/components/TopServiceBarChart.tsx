"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJs,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";

ChartJs.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function TopServiceBarChart() {
  const barChartData = {
    labels: ["Beauty", "Design", "Cleaning", "Plumbing", "Electrical"],
    datasets: [
      {
        label: "Services",
        data: [432, 380, 320, 290, 210],
        backgroundColor: [
          "#BF124D",
          "#59AC77",
          "#FAA533",
          "#3FA2F6",
          "#9B7EBD",
        ],
        borderColor: [
          "#76153C",
          "#3A6F43",
          "#EF7722",
          "#0F67B1",
          "#7F55B1",
        ],
        borderWidth: 2,
        borderRadius: 8,
        hoverBackgroundColor: [
          "#76153C",
          "#3A6F43",
          "#EF7722",
          "#0F67B1",
          "#7F55B1",
        ],
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Top 5 Services",
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
        borderColor: "#3b82f6",
        borderWidth: 1,
        displayColors: true,
        callbacks: {
          label(tooltipItem) {
            return `Orders: ${tooltipItem.parsed.x}`;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          display: true,
          color: "rgba(0, 0, 0, 0.05)",
          drawTicks: false,
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          display: false,
          drawTicks: false,
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-full p-4">
      <Bar data={barChartData} options={options} />
    </div>
  );
}