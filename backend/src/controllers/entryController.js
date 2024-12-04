import Entry from '../models/Entry.js';
import mongoose from 'mongoose';


export const getWeeklyStats = async (req, res) => {
  try {

    const userId = req.user.id;


    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 7);


    const entries = await Entry.aggregate([
      {
        $match: {
          userId: mongoose.Types.ObjectId(userId),
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $project: {
          dayOfWeek: { $dayOfWeek: "$createdAt" },
          mood: 1,
          medicationTaken: 1,
          journalEntry: 1,
        }
      },
      {
        $group: {
          _id: "$dayOfWeek",
          averageMood: { $avg: "$mood" },
          medicationCount: { $sum: { $cond: [{ $eq: ["$medicationTaken", true] }, 1, 0] } },
          totalEntries: { $sum: 1 },
          journalEntries: { $push: "$journalEntry" },
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);


    const weeklyData = new Array(7).fill(null).map((_, index) => {
      const entry = entries.find(e => e._id === index + 1);
      return entry ? entry.averageMood : 0;
    });


    const medicationPercentage = (entries.reduce((acc, entry) => acc + entry.medicationCount, 0) / (entries.length * 1)) * 100;


    const weeklyStats = {
      weeklyData,
      averageMood: entries.reduce((acc, entry) => acc + entry.averageMood, 0) / entries.length || 0,
      medicationPercentage: medicationPercentage.toFixed(2),
      journalEntries: entries.flatMap(entry => entry.journalEntries),
    };

    res.status(200).json(weeklyStats);
  } catch (error) {
    console.error('Error fetching weekly stats:', error);
    res.status(500).json({ message: 'Failed to fetch weekly stats' });
  }
};
