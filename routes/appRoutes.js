const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs')
const { exec } = require('child_process');
const AppModel = require('../models/AppModel');

const ICONS_DIR = path.join(__dirname, '..', 'public', 'icons');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, ICONS_DIR);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

router.post('/upload-icon', upload.single('icon'), (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded.');
    return res.status(200).json({ message: 'Icon uploaded successfully!' });
});

// GET all apps
router.get('/apps', async (req, res) => {
    try {
        const apps = await AppModel.find();
        res.json(apps);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST to add new app
router.post('/apps', async (req, res) => {
    try {
        const { name, path, param, icon } = req.body;
        const newApp = new AppModel({ name, path, param, icon });
        await newApp.save();
        res.status(201).json({ message: 'App saved successfully', newApp });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST to launch an app
router.post('/launch', async (req, res) => {
    const { path, param } = req.body;
    const command = `"${path}" ${param}`;
    exec(command, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: err.message });
        }
        res.send('Application Launched');
    });
});

router.delete('/delete-icon', (req, res) => {
    const { filename } = req.body;

    if (!filename) {
        return res.status(400).json({ error: 'Filename is required' });
    }
    const filePath = path.join(__dirname, '..', 'public', 'icons', filename);

    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Error deleting file:', err);
            return res.status(500).json({ error: 'Failed to delete icon' });
        }
        res.json({ message: 'Icon deleted successfully' });
    });
});

router.post('/add-app', async (req, res) => {
    try {
        const { name, path, param, icon } = req.body;
        const newApp = new AppModel({ name, path, param, icon });
        await newApp.save();
        return res.status(200).json({ message: 'App saved Successfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

router.delete('/delete-app', async (req, res) => {
    try {
        const { path } = req.body;

        if (!path) {
            return res.status(400).json({ error: "App path is required" });
        }

        const result = await AppModel.deleteOne({ path });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "App not found" });
        }

        return res.status(200).json({ message: "App deleted successfully" });
    } catch (error) {
        console.error("Error deleting app:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
