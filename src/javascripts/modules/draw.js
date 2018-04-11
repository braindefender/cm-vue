import functions from './functions';
import calc from './calculations';

function trace(x, y, z, color) {
  const c = (color ? color : 'rgba(102, 56, 240, 1)');
  return {
    x, y, z,
    mode: 'markers',
    marker: {
      color: c,
      size: 4,
      line: {
        color: c,
        width: 0.5,
      },
      opacity: 0.8,
    },
    type: 'scatter3d',
  };
}

export default function draw(options) {

  const { J, N, a, b, c, s } = options;
  // Step by time
  const tau = (c - a) / N;

  // Step by space
  const h = (b - a) / J;

  const u = calc(a, b, c, J, N, s);

  const xAxis = [];
  const tAxis = [];
  const uAxis = [];
  const uOrigAxis = [];
  const errorAxis = [];
  for (let n = 0; n <= N; n++) {
    for (let j = 0; j <= J; j++) {
      xAxis.push(j*h);
      tAxis.push(n*tau);
      const uItem = u[n][j];
      const uOrig = functions.uTest(n * tau, j * h);
      uAxis.push(uItem);
      uOrigAxis.push(uOrig);
      errorAxis.push(Math.abs(uItem - uOrig));
    }
  }

  const trace1 = trace(xAxis, tAxis, uAxis);
  const trace2 = trace(xAxis, tAxis, uOrigAxis, 'rgba(74, 242, 161, 0.8)');
  const error = trace(xAxis, tAxis, errorAxis);

  const data = [trace1, trace2];
  const errData = [error];
  const layout = {
    margin: {
      l: 0,
      r: 0,
      b: 0,
      t: 0
    }
  };
  window.Plotly.newPlot('tester', data, layout);
  window.Plotly.newPlot('error', errData, layout);
}
