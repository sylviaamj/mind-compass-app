import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditEntry = () => {
  const { id } = useParams();
  const navigate = useNavigate();


  const [entryData, setEntryData] = useState({
    mood: '',
    medicationTaken: false,
    journalEntry: ''
  });


  useEffect(() => {
    const fetchEntry = async () => {
      try {

        const token = localStorage.getItem('authToken');


        const response = await axios.get(`http://localhost:5001/api/entries/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });


        setEntryData(response.data);
      } catch (error) {
        console.error("Error fetching entry:", error);
        if (error.response && error.response.status === 401) {
          alert('Unauthorized! Please log in to access this page.');
          navigate('/login');
        }
      }
    };

    fetchEntry();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedEntry = {
        mood: entryData.mood,
        medicationTaken: entryData.medicationTaken,
        journalEntry: entryData.journalEntry
      };


      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5001/api/entries/${id}`, updatedEntry, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });


      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating entry:', error);
      if (error.response && error.response.status === 401) {
        alert('Unauthorized! Please log in to access this page.');
        navigate('/login');  
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-[#1C8316] mb-6">Edit Entry</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label>Mood:</label>
            <input
              type="number"
              value={entryData.mood}
              onChange={(e) => setEntryData({ ...entryData, mood: e.target.value })}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label>Medication Taken:</label>
            <input
              type="checkbox"
              checked={entryData.medicationTaken}
              onChange={(e) => setEntryData({ ...entryData, medicationTaken: e.target.checked })}
              className="mt-1"
            />
          </div>

          <div className="mb-4">
            <label>Journal Entry:</label>
            <textarea
              value={entryData.journalEntry}
              onChange={(e) => setEntryData({ ...entryData, journalEntry: e.target.value })}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <button type="submit" className="w-full py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700">
            Update Entry
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditEntry;
