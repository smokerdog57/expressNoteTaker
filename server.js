const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to parse JSON request bodies.
app.use(express.json());

// Serve static files from the 'public' folder (client-side).
app.use(express.static('public'));

// Serve the 'notes.html' page when '/notes' is accessed.
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html'));
});

// Serve the 'index.html' page for the root URL.
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Handle GET requests for reading all notes from the JSON file.
app.get('/api/notes', (req, res) => {
  fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const notes = JSON.parse(data);
    res.json(notes);
  });
});

// Handle POST requests for adding a new note to the JSON file.
app.post('/api/notes', (req, res) => {
  const newNote = req.body;

  fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const notes = JSON.parse(data);
    
    // Generate a unique ID for the new note (implement this logic).
    newNote.id = generateUniqueId(notes);

    // Add the new note to the list of notes.
    notes.push(newNote);

    // Write the updated notes array back to the JSON file.
    fs.writeFile(path.join(__dirname, 'db/db.json'), JSON.stringify(notes), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      res.json(newNote);
    });
  });
});

// Handle DELETE requests for deleting a note with a specified ID.
app.delete('/api/notes/:id', (req, res) => {
  // You need to implement the logic for deleting a note based on the specified ID.
  // This code block should handle the deletion process and update the JSON file accordingly.
});

// Function to generate a unique ID for a new note.
function generateUniqueId(existingNotes) {
  // You need to implement your logic to generate a unique ID here.
  // You can use packages like 'uuid' for a more robust solution.
  // For simplicity, you can use a timestamp-based ID for now.
  return Date.now().toString();
}

// Start the server and listen on the specified port.
app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
