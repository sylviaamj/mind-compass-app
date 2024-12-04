import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const WeeklyAnalytics = () => {
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeeklyAnalytics = async () => {
      try {
        const response = await axios.get('/api/entries/analytics');
        setWeeklyData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch weekly analytics', error);
        setError('Failed to load weekly analytics. Please try again later.');
        setLoading(false);
      }
    };

    fetchWeeklyAnalytics();
  }, []);

  
  const moodChartData = {
    labels: weeklyData.length ? weeklyData.map(entry => entry._id) : [],
    datasets: [
      {
        label: 'Daily Mood Average',
        data: weeklyData.length ? weeklyData.map(entry => entry.avgMood) : [],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const medicationChartData = {
    labels: weeklyData.length ? weeklyData.map(entry => entry._id) : [],
    datasets: [
      {
        label: 'Medication Days',
        data: weeklyData.length ? weeklyData.map(entry => entry.medicationDays) : [],
        backgroundColor: 'rgba(54, 162, 235, 0.5)'
      }
    ]
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Weekly Analytics</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Mood Trends</h2>
          <Line data={moodChartData} />
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Medication Tracking</h2>
          <Bar data={medicationChartData} />
        </div>
      </div>
    </div>
  );
};

export default WeeklyAnalytics;
