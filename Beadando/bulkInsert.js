const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'zenestreaming',
});

db.connect((err) => {
  if (err) {
    console.error('Adatbázis kapcsolódási hiba:', err);
    process.exit(1);
  }
  console.log('Sikeresen csatlakoztál az adatbázishoz.');
});

const musicData = [
  {
    title: "Tech Trends Episode 1",
    artist: "Future Talk",
    genre: "podcast",
    duration: "00:20:00",
    release_date: "2024-01-10",
    image_url: "http://example.com/images/tech_trends1.jpg",
  },
  {
    title: "Tech Trends Episode 2",
    artist: "Future Talk",
    genre: "podcast",
    duration: "00:20:00",
    release_date: "2024-01-10",
    image_url: "http://example.com/images/tech_trends2.jpg",
  },
  {
    title: "Tech Trends Episode 3",
    artist: "Future Talk",
    genre: "podcast",
    duration: "00:30:00",
    release_date: "2024-01-12",
    image_url: "http://example.com/images/tech_trends3.jpg",
  },
  {
    title: "Science Explained Episode 5",
    artist: "Dr. Know",
    genre: "podcast",
    duration: "00:35:00",
    release_date: "2024-01-12",
    image_url: "http://example.com/images/science5.jpg",
  },
  {
    title: "Science Explained Episode 8",
    artist: "Dr. Know",
    genre: "podcast",
    duration: "00:45:00",
    release_date: "2024-01-22",
    image_url: "http://example.com/images/science8.jpg",
  },
  {
    title: "Science Explained Episode 6",
    artist: "Dr. Know",
    genre: "podcast",
    duration: "00:45:00",
    release_date: "2024-01-15",
    image_url: "http://example.com/images/science6.jpg",
  },
  {
    title: "Morning Jazz Vibes",
    artist: "Jazz Masters",
    genre: "jazz",
    duration: "00:06:10",
    release_date: "2023-12-20",
    image_url: "http://example.com/images/jazz_vibes.jpg",
  },
  {
    title: "AI Revolution",
    artist: "Tech Guru",
    genre: "podcast",
    duration: "00:50:00",
    release_date: "2024-01-15",
    image_url: "http://example.com/images/ai_revolution.jpg",
  },
  {
    title: "Ambient Chill",
    artist: "Nature Waves",
    genre: "ambient",
    duration: "01:15:00",
    release_date: "2023-11-30",
    image_url: "http://example.com/images/chill.jpg",
  },
  {
    title: "Classic Rock Anthems",
    artist: "Rock Legends",
    genre: "rock",
    duration: "00:04:30",
    release_date: "2023-10-18",
    image_url: "http://example.com/images/rock_legends.jpg",
  },
  {
    title: "Cooking Secrets Episode 1",
    artist: "Chef's Table",
    genre: "podcast",
    duration: "00:27:30",
    release_date: "2024-01-03",
    image_url: "http://example.com/images/cooking_secrets1.jpg",
  },
  {
    title: "Cooking Secrets Episode 2",
    artist: "Chef's Table",
    genre: "podcast",
    duration: "00:25:00",
    release_date: "2024-01-08",
    image_url: "http://example.com/images/cooking_secrets2.jpg",
  },
  {
    title: "Travel Diaries Episode 2",
    artist: "World Explorers",
    genre: "podcast",
    duration: "00:30:00",
    release_date: "2023-12-25",
    image_url: "http://example.com/images/travel2.jpg",
  },
  {
    title: "Travel Diaries Episode 3",
    artist: "World Explorers",
    genre: "podcast",
    duration: "00:40:00",
    release_date: "2023-12-28",
    image_url: "http://example.com/images/travel3.jpg",
  },
  {
    title: "Piano Melodies",
    artist: "Solo Keys",
    genre: "classical",
    duration: "00:08:00",
    release_date: "2023-09-10",
    image_url: "http://example.com/images/piano.jpg",
  },
  {
    title: "Fitness Beats 2024",
    artist: "Workout DJ",
    genre: "electronic",
    duration: "00:05:20",
    release_date: "2024-01-05",
    image_url: "http://example.com/images/fitness.jpg",
  },
  {
    title: "True Crime Weekly",
    artist: "Crime Stories",
    genre: "podcast",
    duration: "00:55:00",
    release_date: "2024-01-03",
    image_url: "http://example.com/images/crime.jpg",
  },
  {
    title: "Lo-fi Study Mix",
    artist: "Relaxed Beats",
    genre: "lo-fi",
    duration: "01:00:00",
    release_date: "2023-12-15",
    image_url: "http://example.com/images/lofi.jpg",
  },
  {
    title: "Space Sounds",
    artist: "Astral Notes",
    genre: "ambient",
    duration: "00:45:00",
    release_date: "2023-11-20",
    image_url: "http://example.com/images/space.jpg",
  },
  {
    title: "Mindful Meditation",
    artist: "Zen Life",
    genre: "ambient",
    duration: "01:20:00",
    release_date: "2023-10-01",
    image_url: "http://example.com/images/meditation.jpg",
  },
  {
    title: "Pop Hits Vol. 5",
    artist: "Various Artists",
    genre: "pop",
    duration: "00:03:15",
    release_date: "2024-01-02",
    image_url: "http://example.com/images/pop_hits.jpg",
  },
];


const query = `
  INSERT INTO music (title, artist, genre, duration, release_date, image_url)
  VALUES (?, ?, ?, ?, ?, ?)
`;

musicData.forEach((music) => {
  const values = [
    music.title,
    music.artist,
    music.genre,
    music.duration,
    music.release_date,
    music.image_url,
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Hiba történt az adat beszúrásakor:', err);
    } else {
      console.log(`Adat beszúrva: ${music.title}`);
    }
  });
});


db.end(() => {
  console.log('Adatbázis kapcsolat lezárva.');
});
