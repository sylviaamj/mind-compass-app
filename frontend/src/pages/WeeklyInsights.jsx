import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Bar, Pie } from 'react-chartjs-2';

const WeeklyInsights = () => {
  const [moodData, setMoodData] = useState(null);
  const [medicationData, setMedicationData] = useState(null);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWeeklyInsights = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5001/api/entries/weekly-insights', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { moodSummary, medicationTaken, journalInsights } = response.data;

        
        setMoodData({
          labels: Object.keys(moodSummary),
          datasets: [
            {
              label: 'Mood Frequency',
              data: Object.values(moodSummary),
              backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0',
                '#9966FF',
                '#FF9F40',
              ],
            },
          ],
        });

        setMedicationData({
          labels: ['Medication Taken', 'Not Taken'],
          datasets: [
            {
              label: 'Medication',
              data: [medicationTaken.taken, medicationTaken.notTaken],
              backgroundColor: ['#36A2EB', '#FF6384'],
            },
          ],
        });

        setInsights(journalInsights);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching insights:', error);
        setLoading(false);
      }
    };

    fetchWeeklyInsights();
  }, []);

  if (loading) {
    return <div className="text-center text-lg">Loading insights...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Weekly Insights</h2>

        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-700">Mood Summary</h3>
          <Bar data={moodData} />
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-700">Medication Stats</h3>
          <Pie data={medicationData} />
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-700">Journal Insights</h3>
          <ul className="list-disc ml-6 text-gray-600">
            {insights.map((insight, index) => (
              <li key={index}>{insight}</li>
            ))}
          </ul>
        </div>

        <button
          className="py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none"
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default WeeklyInsights;
