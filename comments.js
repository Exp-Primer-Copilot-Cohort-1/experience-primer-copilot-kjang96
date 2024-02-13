// Create web server
const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const cors = require('cors');
const comments = require('./comments.json');
const fs = require('fs');
const path = require('path');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/comments', (req, res) => {
  res.json(comments);
});

app.post('/comments', (req, res) => {
  console.log(req.body);
  comments.push(req.body);
  fs.writeFile(path.resolve(__dirname, 'comments.json'), JSON.stringify(comments), (err) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error');
    } else {
      res.status(201).send('OK');
    }
  });
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
// Path: public/index.html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Comments</title>
</head>
<body>
  <h1>Comments</h1>
  <form id="comments-form">
    <input type="text" id="name" placeholder="Name" required>
    <input type="text" id="comment" placeholder="Comment" required>
    <button type="submit">Submit</button>
  </form>
  <ul id="comments-list"></ul>
  <script src="app.js"></script>
</body>
</html>
// Path: public/app.js
const form = document.getElementById('comments-form');
const name = document.getElementById('name');
const comment = document.getElementById('comment');
const commentsList = document.getElementById('comments-list');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  fetch('http://localhost:3000/comments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: name.value, comment: comment.value }),
  })
    .then((res) => {
      if (res.ok) {
        return res.text();
      } else {
        throw new Error('Error');
      }
    })
    .then(() => {
      name.value = '';
      comment.value = '';
      fetch('http://localhost:3000/comments')