const express = require('express');
const path = require('path');
const config = require('./config');
const fs = require('fs').promises;
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/id/:id', async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).send('Bad Request: Missing "id" parameter');
    }

    const myFile = 'channels.json';
    let jsondata = await fs.readFile(myFile, 'utf8');
    let arr_data = JSON.parse(jsondata);

    if (!arr_data.includes(id)) {
      if (arr_data.length >= 50) {
        arr_data.shift();
      }

      arr_data.push(id);

      jsondata = JSON.stringify(arr_data, null, 2);

      await fs.writeFile(myFile, jsondata);
      res.send('Thanks for joining the stream | Your channel will be added shortly');
    } else {
      res.send('Hello, It appears you are already added! Sometimes the wall can take a while to update! Please allow 10 minutes at the most!');
    }
  } catch (error) {
    console.error('Caught exception:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/channels.json', async (req, res) => {
  try {
    const data = await fs.readFile('channels.json', 'utf8');
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(JSON.parse(data), null, 2));
  } catch (error) {
    console.error('Error reading the file:', error);
    res.status(500).send('Internal Server Error');
  }
});

const port = config.port || 3000;

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
