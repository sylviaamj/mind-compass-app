import express from 'express';
import { getWeeklyStats } from '../controllers/entryController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import Entry from '../models/Entry.js';

const router = express.Router();


router.post('/', async (req, res) => {
  try {
    const { mood, medicationTaken, journalEntry } = req.body;


    const newEntry = new Entry({
      mood,
      medicationTaken,
      journalEntry,
    });

    await newEntry.save();
    res.status(201).json({ message: 'Entry saved successfully', data: newEntry });
  } catch (error) {
    res.status(500).json({ message: 'Error saving entry', error });
  }
});


router.get('/', async (req, res) => {
  try {
    const entries = await Entry.find();
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching entries', error });
  }
});


router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedEntry = await Entry.findByIdAndDelete(id);
    if (!deletedEntry) {
      return res.status(404).json({ message: 'Entry not found' });
    }
    res.status(200).json({ message: 'Entry deleted successfully', data: deletedEntry });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting entry', error });
  }
});


router.get('/weekly-stats', authMiddleware, getWeeklyStats);

export default router;
