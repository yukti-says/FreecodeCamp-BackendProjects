// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});
app.get("/api", function (req, res) {
  const currentDate = new Date();

  res.json({
    unix: currentDate.getTime(),
    utc: currentDate.toUTCString(),
  });
});

// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

app.get("/api/:date", (req, res) => {
  const dateString = req.params.date;

  let date;

  // Check if it's a Unix timestamp (only digits)
  if (!isNaN(dateString)) {
    date = new Date(parseInt(dateString)); // treat it as Unix
  } else {
    date = new Date(dateString); // treat it as a normal date string
  }

  // Handle invalid date
  if (date.toString() === "Invalid Date") {
    return res.json({ error: "Invalid Date" });
  }

  // Return valid date response
  res.json({
    unix: date.getTime(),
    utc: date.toUTCString(),
  });
});
