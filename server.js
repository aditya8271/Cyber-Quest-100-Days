const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/cyberquest', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

// Schema for Learned Topics
const learnedTopicSchema = new mongoose.Schema({
    day: Number,
    topics: String,
    completed: Boolean
});

const LearnedTopic = mongoose.model('LearnedTopic', learnedTopicSchema);

// Endpoint to get topics for all days
app.get('/topics', async(req, res) => {
    try {
        const topics = await LearnedTopic.find();
        res.json(topics);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Endpoint to save topics for a specific day
app.post('/save-topic', async(req, res) => {
    const { day, topics, completed } = req.body;

    try {
        const existingTopic = await LearnedTopic.findOne({ day });

        if (existingTopic) {
            existingTopic.topics = topics;
            existingTopic.completed = completed;
            await existingTopic.save();
        } else {
            const newTopic = new LearnedTopic({ day, topics, completed });
            await newTopic.save();
        }

        res.status(200).json({ message: 'Topic saved successfully!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Endpoint to delete a topic for a specific day
app.delete('/delete-topic/:day', async(req, res) => {
    const { day } = req.params;

    try {
        await LearnedTopic.deleteOne({ day });
        res.status(200).json({ message: 'Topic deleted successfully!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});