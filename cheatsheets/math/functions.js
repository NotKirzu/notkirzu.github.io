Object.defineProperties(Math, {
  fromRadians: {
    value: function (angle) {
      return angle * (180 / Math.PI);
    }
  },
  toRadians: {
    value: function (angle) {
      return angle * (Math.PI / 180);
    }
  }
});

Object.defineProperties(String.prototype, {
  reverse: {
    value: function () {
      return this.split('').reverse().join('');
    }
  }
});

function getIdentities(baseIdentities = { x: null, y: null, r: null }) {
  // Y = sqrt(abs(R**2 - X**2))
  // X = sqrt(abs(R**2 - Y**2))
  // R = sqrt(abs(Y**2 + X**2))

  const getCos = (identities = {}) => {
    if (!identities.x || !identities.r) {
      if (!identities.y) {
        throw new Error('Missing Y value. Can\'t calculate cosine.');
      }
      
      if (!identities.r && identities.x) {
        identities.r = Math.sqrt(Math.abs((identities.y ** 2) + (identities.x ** 2)));
      } else if (!identities.x && identities.r) {
        identities.x = Math.sqrt(Math.abs((identities.r ** 2) - (identities.y ** 2)));
      } else {
        throw new Error('Some values are missing. Can\'t calculate cosine.');
      }
    }
    return identities;
  }

  const getSin = (identities = {}) => {
    if (!identities.y || !identities.r) {
      if (!identities.x) {
        throw new Error('Missing X value. Can\'t calculate sine.');
      }
      
      if (!identities.r && identities.y) {
        identities.r = Math.sqrt(Math.abs((identities.y ** 2) + (identities.x ** 2)));
      } else if (!identities.y && identities.r) {
        identities.y = Math.sqrt(Math.abs((identities.r ** 2) - (identities.x ** 2)));
      } else {
        throw new Error('Some values are missing. Can\'t calculate sine.');
      }
    }
    return identities;
  }

  const getTan = (identities = {}) => {
    if (!identities.x || !identities.y) {
      if (!identities.r) {
        throw new Error('Missing R value. Can\'t calculate tangent.');
      }

      if (!identities.x && identities.y) {
        identities.x = Math.sqrt(Math.abs((identities.r ** 2) - (identities.y ** 2)));
      } else if (!identities.y && identities.x) {
        identities.y = Math.sqrt(Math.abs((identities.r ** 2) - (identities.x ** 2)));
      } else {
        throw new Error('Some values are missing. Can\'t calculate tangent.');
      }
    }
    return identities;
  }

  getSin(baseIdentities);
  getCos(baseIdentities);
  getTan(baseIdentities);

  const sin = `${baseIdentities.y}/${baseIdentities.r}`;
  const cos = `${baseIdentities.x}/${baseIdentities.r}`;
  const tan = `${baseIdentities.x}/${baseIdentities.y}`;

  return {
    sin,
    cos,
    tan,
    sec: sin.reverse(),
    csc: cos.reverse(),
    cot: tan.reverse()
  }
}

function formatIdentities(identities = {}) {
  return Object.fromEntries(
    Object.entries(identities)
      .map((x) => [x[0], x[1] + ' = ' + eval(x[1])])
  );
}

function convertIdentitiesToDegress(identities = {}) {
  return Object.fromEntries(
    Object.entries(identities)
      .map((x) => [x[0], eval(x[1])])
  );
}

function convertIdentitiesToRadians(identities = {}) {
  return Object.fromEntries(
    Object.entries(identities)
      .map((x) => [x[0], Math.toRadians(eval(x[1]))])
  );
}

// Double and semi angle
const DOUBLE_ANGLE_IDENTITIES = [
  // SIN(2*x) = 2*(SIN(x)COS(x))
  (sin, cos) => 2 * (sin * cos),
  
  // COS(2*x) = COS(x**2)-SIN(x**2)
  (sin, cos) => (cos ** 2) - (sin ** 2),
  // COS(2*x) = 1-(2*(SIN(x**2)))
  (sin) => 1 - (2 * (sin ** 2)),
  // COS(2*x) = 2*(COS((x - 1)**2))
  (_var0, cos) => (2 * (cos ** 2)) - 1,

  // TAN(2*x) = (2*TAN(x))/(1-(TAN(x)**2))
  (_var0, _var1, tan) => (2 * (tan)) / ((1 - (tan ** 2)))
];

const things = [
  'DOUBLE_ANGLE_IDENTITIES',
  getIdentities.name,
  convertIdentitiesToDegress.name,
  convertIdentitiesToRadians.name,
  formatIdentities.name
]