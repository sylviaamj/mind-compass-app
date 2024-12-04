import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AiOutlineArrowLeft } from 'react-icons/ai';

const DailyEntry = () => {
  const navigate = useNavigate();
  const [mood, setMood] = useState(3);
  const [medicationTaken, setMedicationTaken] = useState(false);
  const [journalEntry, setJournalEntry] = useState('');

  const emojis = [
    '😞', // Very sad (1)
    '😔', // Sad (2)
    '😐', // Neutral (3)
    '🙂', // Happy (4)
    '😁', // Very happy (5)
  ];

  const moodNames = [
    'Very Sad', // 1
    'Sad',      // 2
    'Neutral',  // 3
    'Happy',    // 4
    'Very Happy'// 5
  ];

  const handleSubmit = async () => {
    try {
      const moodNumber = Number(mood);
      const token = localStorage.getItem('token');

      const response = await axios.post(
        'http://localhost:5001/api/entries',
        {
          mood: moodNumber,
          medicationTaken,
          journalEntry,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Entry saved:', response.data);


      setMood(3);
      setMedicationTaken(false);
      setJournalEntry('');

      alert('Entry saved successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving entry:', error);
      alert('There was an error saving your entry.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center px-6 py-12">
      {/* Back Arrow */}
      <button
        onClick={() => navigate('/dashboard')}
        className="absolute top-20 left-6 text-[#1C8316] hover:text-[#136310] flex items-center z-10"
      >
        <AiOutlineArrowLeft className="mr-2" size={24} />
      </button>

      <div className="w-full max-w-2xl bg-white p-10 rounded-xl relative">
        <h2 className="text-4xl font-extrabold text-center text-[#1C8316] mb-6">Daily Entry</h2>

        <form onSubmit={(e) => e.preventDefault()}>
          {/* Mood Selection with Emojis */}
          <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-700 mb-2">Mood</label>
            <div className="flex justify-around mb-4">
              {emojis.map((emoji, index) => (
                <div
                  key={index}
                  onClick={() => setMood(index + 1)}
                  className={`cursor-pointer text-5xl p-2 rounded-full transition-all duration-300 ${mood === index + 1 ? 'bg-[#1C8316] text-white' : 'text-gray-700'}`}
                >
                  {emoji}
                </div>
              ))}
            </div>
            {/* Display Mood Names below Emojis */}
            <div className="flex justify-between text-sm text-gray-600">
              {moodNames.map((name, index) => (
                <div key={index} className="w-1/5 text-center">{name}</div>
              ))}
            </div>
          </div>

          {/* Medication Taken Checkbox */}
          <div className="mb-6">
            <label className="inline-flex items-center text-lg font-semibold text-gray-700">
              <input
                type="checkbox"
                checked={medicationTaken}
                onChange={() => setMedicationTaken(!medicationTaken)}
                className="form-checkbox h-5 w-5 text-[#1C8316]"
              />
              <span className="ml-2 text-gray-700">Medication Taken</span>
            </label>
          </div>

          {/* Journal Entry Textarea */}
          <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-700 mb-2">Journal Entry</label>
            <textarea
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
              placeholder="Write your thoughts..."
              className="w-full p-4 border border-gray-300 rounded-lg shadow-sm resize-none h-32 text-gray-700"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleSubmit}
              className="py-2 px-6 bg-[#1C8316] text-white font-semibold rounded-md hover:bg-[#136310] focus:outline-none focus:ring-2 focus:ring-[#1C8316] focus:ring-offset-2"
            >
              Save Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DailyEntry;
