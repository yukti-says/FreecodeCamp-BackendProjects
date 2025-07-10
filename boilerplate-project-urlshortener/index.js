require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns'); // native module for domain validation

app.use(bodyParser.urlencoded({ extended: false }));

let urlDatabase = {}; // { short: original_url }
let idCounter = 1;    // simple counter for short urls

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post("/api/shorturl", (req, res) => {
  const inputUrl = req.body.url;

  try {
    // Remove protocol for DNS lookup
    const hostname = new URL(inputUrl).hostname;

    dns.lookup(hostname, (err) => {
      if (err) {
        return res.json({ error: "invalid url" });
      }

      // If URL is valid, store it
      const short = idCounter++;
      urlDatabase[short] = inputUrl;

      res.json({
        original_url: inputUrl,
        short_url: short,
      });
    });
  } catch (error) {
    return res.json({ error: "invalid url" });
  }
});

app.get("/api/shorturl/:short_url", (req, res) => {
  const short = req.params.short_url;
  const originalUrl = urlDatabase[short];

  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.json({ error: "No short URL found for the given input" });
  }
});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
