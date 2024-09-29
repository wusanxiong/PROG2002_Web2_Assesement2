const mysql = require('mysql');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'zwl293268',
  database: 'crowdfunding_db',
});

app.get('/fundraisers', (req, res) => {
  const sql = 'SELECT * FROM fundraisers WHERE is_active = TRUE';
  connection.query(sql, (error, data) => {
    if (error) {
      console.error('Query error:', error);
      return res.status(500).json({ message: 'Error retrieving data' });
    }
    res.json(data);
  });
});

app.get('/fundraisers/:id', (req, res) => {
  const fundraiserId = req.params.id;
  const sql = 'SELECT * FROM fundraisers WHERE fundraiser_id = ?';
  connection.query(sql, [fundraiserId], (error, result) => {
    if (error) {
      console.error('Query error:', error);
      return res.status(500).json({ message: 'Error retrieving data' });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'Fundraiser not found' });
    }
    res.json(result[0]);
  });
});

app.get('/search', (req, res) => {
  const { organizer, city, category } = req.query;
  let sql = 'SELECT * FROM fundraisers WHERE is_active = TRUE';
  let filters = [];

  if (organizer) {
    sql += ' AND organizer LIKE ?';
    filters.push(`%${organizer}%`);
  }

  if (city) {
    sql += ' AND city LIKE ?';
    filters.push(`%${city}%`);
  }

  if (category) {
    sql += ' AND category_id = ?';
    filters.push(category);
  }

  connection.query(sql, filters, (error, results) => {
    if (error) {
      console.error('Search query error:', error);
      return res.status(500).json({ message: 'Error processing search' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'No matching fundraisers found' });
    }
    res.json(results);
  });
});

const PORT = 5555;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
