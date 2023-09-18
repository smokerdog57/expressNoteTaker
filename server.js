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

// Serve the 'index.html' page for the wildcard (*)
app.get('*', (req, res) => {
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
  const idToDelete = req.params.id; // Get the ID to delete from the URL parameters.

  // Read the JSON file.
  fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const notes = JSON.parse(data);

    // Find the index of the note to delete based on the ID.
    const noteIndexToDelete = notes.findIndex((note) => note.id === idToDelete);

    if (noteIndexToDelete === -1) {
      // If the note with the specified ID is not found, return a 404 status.
      return res.status(404).json({ error: 'Note not found' });
    }

    // Remove the note from the array.
    notes.splice(noteIndexToDelete, 1);

    // Write the updated notes array back to the JSON file.
    fs.writeFile(path.join(__dirname, 'db/db.json'), JSON.stringify(notes), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Respond with a success status.
      res.json({ message: 'Note deleted successfully' });
    });
  });
});


// Function to generate a unique ID for a new note.
function generateUniqueId(existingNotes) {
  return Date.now().toString();
}

// Start the server and listen on the specified port.
app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
