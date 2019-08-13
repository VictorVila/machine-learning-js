/**
 ---------------------------------------
 ml.js
 ---------------------------------------
 loads an object containing
 - an JS version of the Octave code from Andrew Ng's Machine Learning
 - some external math & matrix utilities

 Dependances :
 - csv : https://csv.js.org/parse/
        npm install -S fast-csv

**/

'use strict';
let ml = module.exports;

const fs = require('fs');
const csv = require('fast-csv');
const math = require('./junku901_math.js');


/* ---------------------------------------
  _
  ---------------------------------------
  Show more or less output
  @params :
  - label
  - value
  @returns : string message
*/
const verbose = true;
ml._ = function (label, message) {
  if (!verbose) return;
  // console.log("\n" + label + "\n", message);
  console.log( label + " = ", message);
}

/* ---------------------------------------
  getCSV
  ---------------------------------------
  @params :
    - path to file
    - has headers or not
  @returns : array of data
*/
ml.getCSV = function (path, headers) {
  let data = [];

  fs.createReadStream(path)
    .pipe(csv.parse({headers: headers}))
    .on('data', row => data.push(row))
    .on('end', rowCount => ini());

  const ini = function () {
    return data;
  }
}


/* ---------------------------------------
  getCols
  ---------------------------------------
  Returns chosen cols from matrix
    - matrix
    - ini : min col to return
    - end : min col to return
  @returns : new matrix
*/
ml.getCols = function (matrix, ini, end) {
  let matrix2 = [];

  for (let i = 0; i < matrix.length; i++) {
    let vec = [];

    for (let k = ini; k <= end; k++) {
      vec.push(matrix[i][k]);
    }
    matrix2.push(vec);
  }
  return matrix2;
}


/* ---------------------------------------
  zeroMat
  ---------------------------------------
  @returns :  a row x col matrix filled with zeros
*/
ml.zeroMat = function (rows, cols) {
  return math.zeroMat(rows, cols)
};

/* ---------------------------------------
  oneMat
  ---------------------------------------
  @returns :  a row x col matrix filled with ones
*/
ml.oneMat = function (rows, cols) {
  return math.oneMat(rows, cols)
};


/* ---------------------------------------
  addOnes
  ---------------------------------------
  Adds a column of ones to a matrix
  @returns :  a new matrix with a first column of ones
*/
ml.addOnes = function (matrix) {
  for (let i = 0; i < matrix.length; i++) {
    matrix[i].unshift(1);
  }
  return matrix;
}

/* ---------------------------------------
  sum
  ---------------------------------------
  Adds all values of a one column matrix
  @returns :  a scalar
*/
ml.sum = function (matrix) {
  let sum = 0;
  for (let i = 0; i < matrix.length; i++) {
    sum += matrix[i][0];
  }
  return sum;
}

/* ---------------------------------------
  computeCost
  ---------------------------------------
  Calculates the cost of using theta as parameter
    - X : training examples
    - y :
    - theta : params
  @returns : J
*/

ml.computeCost = function (X, y, theta) {
  const m = y.length;
  let J = 0;
  let predictions = math.mulMat(X, theta);
  // this._('predictions', predictions);
  // this._('predictions length', predictions.length);
  // this._('y length', m);
  let error = math.minusMat(predictions, y);
  // this._('error', error);
  let sqrErrors = math.squareMat(error);
  // this._('sqrErrors', sqrErrors);
  let totalError = this.sum(sqrErrors);
  // console.log("error = " , totalError);
  J = 1 / (2*m) * totalError;
  return J;
};

/* ---------------------------------------
  gradientDescent
  ---------------------------------------
  Calculates theta in num_gradient steps using alpha as learning rate @params :
    - X : training examples
    - y :
    - theta : params
    - alpha : learning rate
    - num_iters : steps
  @returns : theta, cost (J_history)
*/

ml.gradientDescent = function (X, y, theta, alpha, num_iters) {
  const m = y.length;
  let J_history = math.zeroMat(num_iters, 1);
  J_history[0] = ml.computeCost(X, y, theta);
  let Xt = math.transpose(X);
  for (let i = 1; i <= num_iters; i++) {
    this._("\n" + i, " ------------------------\n")
    let hx = math.mulMat(X, theta);
    // this._('hx', hx);
    let hx_y = math.minusMat(hx, y);
    // this._('hx_y', hx_y);
    let E = math.mulMat(Xt, hx_y);
    this._('E', E);
    let alpha_m = alpha / m;
    this._('alpha_m', alpha_m);
    let evo = math.mulMatScalar(E, alpha_m);
    this._('evo', evo);
    theta = math.minusMat(theta, evo)
    this._('theta', theta);
    // theta = theta - (alpha / m) * (Xt * (X * theta - y));
    J_history[i] = ml.computeCost(X, y, theta);
  }
  return [theta, J_history];
};

 ml.predictLR = function (X, theta) {
   console.log('X', X, math.shape(X));
   console.log('theta', theta, math.shape(theta));
   return math.mulMat(X, theta);
 }
