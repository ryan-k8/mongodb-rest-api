let mockReq = {
  headers: {},
  user: null,
};

nextObject = {
  nextCalled: false,
  passedErr: false,
};

const next = (err) => {
  if (err) {
    nextObject.passedErr = err;
  }
  nextObject.nextCalled = true;
};

const reset = () => {
  mockReq.headers = {};
  mockReq.user = null;

  nextObject.nextCalled = false;
  nextObject.passedErr = false;
};

module.exports = {
  nextObject,
  next,
  mockReq,
  reset,
};
