const express = require('express');
const Note = require('../models/Note');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/notes', auth, async (req, res) => {
  const { content } = req.body;

  try {
    const note = new Note({
      userId: req.user._id,
      content,
    });
    await note.save();
    res.send(note);
  } catch (error) {
    res.status(500).send({ error: 'Internal server error' });
  }
});

router.get('/notes', auth, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user._id });
    res.send(notes);
  } catch (error) {
    res.status(500).send({ error: 'Internal server error' });
  }
});

router.put('/notes/:id', auth, async (req, res) => {
  const { content } = req.body;

  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { content },
      { new: true }
    );
    if (!note) {
      return res.status(404).send({ error: 'Note not found' });
    }
    res.send(note);
  } catch (error) {
    res.status(500).send({ error: 'Internal server error' });
  }
});

router.delete('/notes/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!note) {
      return res.status(404).send({ error: 'Note not found' });
    }
    res.send(note);
  } catch (error) {
    res.status(500).send({ error: 'Internal server error' });
  }
});

module.exports = router;
