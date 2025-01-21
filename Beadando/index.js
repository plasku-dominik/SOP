const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'zenestreaming',
});

db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
    return;
  }
  console.log('Database connected');
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Username and password are required');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
  db.query(query, [username, hashedPassword], (err, result) => {
    if (err) {
      console.error('Error inserting user:', err);
      return res.status(500).send('Error registering user');
    }
    res.status(201).send('User registered successfully');
  })
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(400).send('Invalid username or password');
    }

    const user = results[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Invalid username or password');
    }

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  });
});

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).send('Token is required');
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send('Invalid or expired token');
    }

    req.user = decoded;
    next();
  });
};

const validGenres = ['podcast', 'rock', 'ambient', 'jazz', 'electronic', 'pop', 'classical', 'rap'];

app.get('/', (req, res) => {
  res.send('Zenestreaming works');
});

app.post('/music', verifyToken, (req, res) => {
  const { title, artist, genre, duration, release_date, image_url } = req.body;

  if (!title || !artist || !genre || !duration || !release_date || !image_url) {
    return res.status(400).send('All fields are required!');
  }

  if (!validGenres.includes(genre)) {
    return res.status(400).send(`Invalid genre. Allowed genres: ${validGenres.join(', ')}`);
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(release_date)) {
    return res.status(400).send('Invalid date format! Correct format: YYYY-MM-DD');
  }

  const releaseDate = new Date(release_date);
  if (isNaN(releaseDate.getTime())) {
    return res.status(400).send('Invalid date!');
  }

  const query = `
    INSERT INTO music (title, artist, genre, duration, release_date, image_url)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [title, artist, genre, duration, release_date, image_url];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).send('An error occurred in the database.');
    }
    res.status(201).send('Music successfully added!');
  });
});

app.get('/music', (req, res) => {
  const query = 'SELECT * FROM music';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).send('An error occurred.');
    }
    res.json(results);
  });
});

app.get('/music/:id', (req, res) => {
  const musicId = req.params.id;
  const query = 'SELECT * FROM music WHERE id = ?';

  db.query(query, [musicId], (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).send('An error occurred.');
    }

    if (results.length === 0) {
      return res.status(404).send('Music not found.');
    }

    res.json(results[0]);
  });
});

app.patch('/music/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const { title, artist, genre, duration, release_date, image_url } = req.body;

  if (!title && !artist && !genre && !duration && !release_date && !image_url) {
    return res.status(400).send('At least one field must be provided for the update.');
  }

  if (genre && !validGenres.includes(genre)) {
    return res.status(400).send(`Invalid genre. Allowed genres: ${validGenres.join(', ')}`);
  }

  const updates = [];
  const values = [];

  if (title) {
    updates.push('title = ?');
    values.push(title);
  }
  if (artist) {
    updates.push('artist = ?');
    values.push(artist);
  }
  if (genre) {
    updates.push('genre = ?');
    values.push(genre);
  }
  if (duration) {
    updates.push('duration = ?');
    values.push(duration);
  }
  if (release_date) {
    updates.push('release_date = ?');
    values.push(release_date);
  }
  if (image_url) {
    updates.push('image_url = ?');
    values.push(image_url);
  }

  const query = `UPDATE music SET ${updates.join(', ')} WHERE id = ?`;
  values.push(id);

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error updating data:', err);
      return res.status(500).send('An error occurred in the database.');
    }

    if (result.affectedRows === 0) {
      return res.status(404).send('Music not found for the given ID.');
    }

    res.send('Music successfully updated!');
  });
});

app.delete('/music/:id', verifyToken, (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM music WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting data:', err);
      return res.status(500).send('An error occurred in the database.');
    }

    if (result.affectedRows === 0) {
      return res.status(404).send('Music not found for the given ID.');
    }

    res.send('Music successfully deleted!');
  });
});

app.get('/newepisodes', (req, res) => {
  const query = "SELECT * FROM music WHERE genre = 'podcast' ORDER BY release_date DESC LIMIT 10";
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).send('An error occurred.');
    }
    res.json(results);
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
