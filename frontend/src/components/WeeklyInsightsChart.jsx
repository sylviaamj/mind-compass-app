
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const WeeklyInsightsChart = ({ data }) => {

  const chartData = {
    labels: data.map(item => item.day),
    datasets: [
      {
        label: 'Mood Over the Week',
        data: data.map(item => item.mood),
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        min: 0,
        max: 10, 
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `Mood: ${tooltipItem.raw}`;
          },
        },
      },
    },
  };

  return (
    <div>
      <h2>Weekly Mood Insights</h2>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default WeeklyInsightsChart;
