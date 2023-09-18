const fs = require('fs');
const express = require('express');

const app = express();

// app.get('/', (req, res) => {
//   res
//     .status(200)
//     .json({ message: 'Hello from the server side!', app: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.send('You can post to this endpoint...')
// })

/*
v1 is the API version
It is a good practice to specify the API version, that in case you do 
some changes in your API you do that in but simply ten on v2, withot 
breaking everyone who is still using v1.
We always have to specify the version of the API.
We include it in the url.
*/
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours: tours
    }
  })
});

const port = 3000;
// starts up a serveer // it's to what we did with the http package
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

