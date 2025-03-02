const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Load progress data
const dataFile = path.join(__dirname, "progress.json");

const loadProgress = () => {
    try {
        const data = fs.readFileSync(dataFile);
        return JSON.parse(data);
    } catch (error) {
        return { chapters: [] };
    }
};

const saveProgress = (data) => {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
};

// Get progress
app.get("/progress", (req, res) => {
    const progress = loadProgress();
    res.json(progress);
});

// Update chapter progress
app.put("/progress/:chapterId", (req, res) => {
    const { chapterId } = req.params;
    const { status, notes } = req.body;
    let progress = loadProgress();

    const chapter = progress.chapters.find(ch => ch.id == chapterId);
    if (!chapter) {
        return res.status(404).json({ message: "Chapter not found" });
    }

    if (status) chapter.status = status;
    if (notes) chapter.notes = notes;

    saveProgress(progress);
    res.json({ message: "Progress updated", chapter });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
