import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import 'font-awesome/css/font-awesome.min.css';




ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [weeklyStats, setWeeklyStats] = useState(null);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5001/api/entries', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEntries(response.data);
      } catch (error) {
        console.error('Error fetching entries:', error);
      }
    };

    fetchEntries();
  }, []);


  const handleWeeklyInsights = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log("Token sent:", token);
      if (!token) {
        alert("Token not found. Please login again.");
        return;
      }

      const response = await axios.get('http://localhost:5001/api/entries/weekly-stats', {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Weekly Stats:", response.data);
      setWeeklyStats(response.data);
    } catch (error) {
      console.error('Error fetching weekly stats:', error);
      alert('Failed to fetch weekly insights. Please try again.');
    }
  };

  const handleNewEntry = () => {
    navigate('/daily-entry');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5001/api/entries/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });


      setEntries((prevEntries) => prevEntries.filter((entry) => entry._id !== id));
      alert('Entry deleted successfully!');
    } catch (error) {
      console.error('Error deleting entry:', error);
      alert('Failed to delete entry. Please try again.');
    }
  };


  const prepareChartData = (data) => {

    if (!data || !Array.isArray(data.weeklyData)) {
      console.error('Invalid or missing weeklyData:', data);
      return { labels: [], datasets: [] };
    }

    return {
      labels: data.weeklyData.map(item => item.day || 'N/A'),
      datasets: [
        {
          label: 'Mood Over the Week',
          data: data.weeklyData.map(item => item.mood || 0),
          borderColor: 'rgba(75,192,192,1)',
          backgroundColor: 'rgba(75,192,192,0.2)',
          fill: true,
        },
      ],
    };
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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-[#1C8316]">Welcome!</h2>
          <button
            onClick={handleLogout}
            className="py-2 px-4 bg-[#1C8316] text-white font-semibold rounded-md hover:bg-[#136310] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Logout
          </button>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={handleNewEntry}
            className="py-2 px-4 bg-[#1C8316] text-white font-semibold rounded-md hover:bg-[#136310] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            New Daily Entry
          </button>

          {/* Button for weekly insights */}
          <button
            onClick={() => navigate('/weekly-insights')}
            className="py-2 px-4 bg-[#1C8316] text-white font-semibold rounded-md hover:bg-[#136310] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Weekly Insights
          </button>
        </div>

        {weeklyStats && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Weekly Insights</h3>
            <div className="space-y-4">
              <p>Average Mood: {weeklyStats.averageMood}</p>
              <p>Medication Taken: {weeklyStats.medicationPercentage}%</p>
              <div>
                <h4 className="font-semibold">Journal Entries:</h4>
                <ul className="list-disc ml-5">
                  {weeklyStats.journalEntries.map((entry, index) => (
                    <li key={index}>{entry}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Weekly Mood Chart */}
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-gray-700">Mood Trend Over the Week</h4>
              <Line data={prepareChartData(weeklyStats)} options={chartOptions} />
            </div>
          </div>
        )}

        <h3 className="text-xl font-semibold text-gray-700 mb-4">Recent Entries</h3>
        <ul className="space-y-4">
          {entries.map((entry) => (
            <li key={entry._id} className="bg-gray-100 p-4 rounded-lg shadow-sm">
              <div className="flex justify-between text-sm text-gray-600">
                <div>Date: {new Date(entry.createdAt).toLocaleDateString()}</div>
                <div>Mood: {entry.mood}</div>
              </div>
              <div className="mt-2 text-gray-700">Medications Taken: {entry.medicationTaken ? 'Yes' : 'No'}</div>
              <div className="mt-2 text-gray-700">Journal Entry: {entry.journalEntry}</div>
              <button
                onClick={() => handleDelete(entry._id)} 
                className="mt-4 py-1 px-3 bg-[#1C8316] text-white text-sm font-semibold rounded-md hover:bg-[#136310] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                <i className="fa fa-trash" style={{ fontSize: '18px' }}></i>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
