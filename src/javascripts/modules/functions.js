function uTest(t, x) {
  return Math.exp(t) / (1 + x);
  // return Math.sin(x * t);
}

function nu(t, x) {
  // return Math.exp(t + x);
  return 1;
}

function u0Function(x) {
  return 1 / (1 + x);
  // return 0;
}

function µ0Function(t) {
  return - Math.exp(t);
  // return t;
}

function µJFunction(t) {
  return - Math.exp(t) / 4;
  // return t * Math.cos(t);
}



const functions = {
  uTest,
  u0Function,
  nu,
  µ0Function,
  µJFunction
};

export default functions;
