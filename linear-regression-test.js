/**
 ---------------------------------------
 Linear Regression
 ---------------------------------------
 JS code for a simple linear regression
 tested on simple data ;
 1,10
 2,20
 3,30

Expecting '40' for '4'

**/

// dependances for importing data from files
const fs = require('fs');
const csv = require('fast-csv');

// machine learning object containing required functions
var ml = require('./lib/ml.js');

let data = [];

fs.createReadStream('./data/linear-regression-test-data.csv')
  .pipe(csv.parse({headers: false}))
  .on('data', row => data.push(row))
  .on('end', rowCount => ini());

const ini = function () {
  const num_iters = 1500;
  const alpha = 0.01;
  let X = ml.getCols(data, 0, 0);
  let y = ml.getCols(data, 1, 1);
  let theta = ml.zeroMat(2, 1);
  X = ml.addOnes(X);

  console.log(data);
  console.log('X', X);
  console.log('y', y);
  console.log('theta = ', theta);
  console.log('m = ', y.length);

  // verifying cost function
  console.log("\n");
  console.log("Test computeCost. Expecting 32.07", ml.computeCost(X, y, theta));

  // calculating parameters for our data
  let result = ml.gradientDescent (X, y, theta, alpha, num_iters);
  console.log("\nResults\n-----------");
  console.log("theta = " , result[0]);
  console.log("J = " , result[1]);

  // making a prediction
  theta = result[0];
  console.log("Predict values for value 4. Expecting 40");
  console.log(ml.predictLR([[1, 4]], theta));
}
