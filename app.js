const fs = require('fs');
const express = require('express');

const app = express();

app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours: tours,
    },
  });
});

// the variable we define using : 
// we created a variable called id. It could be anything else 
app.get('/api/v1/tours/:id', (req, res) => {
  console.log(req.params); // { id: '5' } //  req.params is where all the parameters of all the variables that we define are stored. req.params is a nice object which automaticaly assigns teh value to our variable. 
  const id = req.params.id * 1 // with this we convert the valuus from strings to nums. Multyplying a string number with a number, it converts that to a number
  const tour = tours.find(el => el.id === id)

  // if(id > tours.length) {
  if(!tour) {
    return res.status(404).json({
      status: 'failed',
      message: 'Invalid ID'
    })
  }
    
  res.status(200).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
});

app.post('/api/v1/tours', (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      }
    })}
  );
});

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
