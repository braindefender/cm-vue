import functions from './functions';

// Shuttle method implementation
function shuttle(A, B, C, F) {
  let n = C.length - 1;
  let alpha = [];
  let beta = [];
  alpha[1] = B[0] / C[0];
  beta[1] = F[0] / C[0];

  for (let j = 1; j <= n - 1; j++) {
    alpha[j + 1] = B[j] / (C[j] - A[j] * alpha[j]);
  }
  for (let j = 1; j <= n; j++) {
    beta[j + 1] = (F[j] + A[j] * beta[j]) / (C[j] - A[j] * alpha[j]);
  }
  let U = [];
  U[n] = beta[n + 1];
  for (let j = n - 1; j >= 0; j--) {
    U[j] = alpha[j + 1] * U[j + 1] + beta[j + 1];
  }
  return U;
}

function generateFunc(func, J, N, h, tau) {
  let newArray = [];
  for (let n = 0; n <= N; n++) {
    newArray[n] = [];
    for (let j = 0; j <= J; j++) {
      newArray[n][j] = func(n * tau, j * h);
    }
  }
  return newArray;
}

function generateFuncByJ(func, J, h) {
  let newArray = [];
  for (let j = 0; j <= J; j++) {
    newArray.push(func(j * h));
  }
  return newArray;
}

function generateFuncByN(func, N, tau) {
  let newArray = [];
  for (let n = 0; n <= N; n++) {
    newArray.push(func(n * tau));
  }
  return newArray;
}

function calc(a, b, c, J, N, s) {

  // Step by time
  const tau = (c - a) / N;

  // Step by space
  const h = (b - a) / J;

  const fi = generateFunc(() => (0), J, N, h, tau);
  const µ = generateFunc(functions.nu, 2 * J, N, h, tau);
  const µ0 = generateFuncByN(functions.µ0Function, N, tau);
  const µJ = generateFuncByN(functions.µJFunction, N, tau);

  let u = [];
  u[0] = generateFuncByJ(functions.u0Function, J, h);
  for (let n = 0; n < N; n++) {

    let A = [];
    let B = [];
    let C = [];
    let F = [];

    let c0 = -((s / h) * µ[n + 1][1] + h / (2 * tau));
    let b0 = -(s / h) * µ[n + 1][1];
    let f0 = -h / 2 * fi[n][0] + s * µ0[n + 1] + (1 - s) * µ0[n] - h / (2 * tau) * u[n][0] - (1 - s) * µ[n][1] * (u[n][1] - u[n][0]) / h;

    A[0] = 0;
    C[0] = c0;
    B[0] = b0;
    F[0] = f0;

    const hh = h * h;

    for (let j = 1; j < J; j++) {
      let aj = (s / hh) * µ[n + 1][2 * j - 1];
      A.push(aj);
      let bj = (s / hh) * µ[n + 1][2 * j + 1];
      B.push(bj);
      let cj = 1 / tau + (s / hh) * (µ[n + 1][2 * j + 1] + µ[n + 1][2 * j - 1]);
      C.push(cj);
      let fj = 1 / tau * u[n][j] + ((1 - s) / hh) * (µ[n][2 * j + 1] * (u[n][j + 1] - u[n][j]) - µ[n][2 * j - 1] * (u[n][j] - u[n][j - 1])) + fi[n][j];
      F.push(fj);
    }


    let aJ = (s / h) * µ[n + 1][2 * J - 1];
    let cJ = (s / h) * µ[n + 1][2 * J - 1] + h / (2 * tau);
    let fJ = h / 2 * fi[n][J] + s * µJ[n + 1] + (1 - s) * µJ[n] + h / (2 * tau) * u[n][J] - (1 - s) * µ[n][2 * J - 1] * (u[n][J] - u[n][J - 1]) / h;

    A[J] = aJ;
    B[J] = 0;
    C[J] = cJ;
    F[J] = fJ;

    u[n + 1] = shuttle(A, B, C, F);
    // console.log(u); // eslint-disable-line
  }
  return u;
}

export default calc;
