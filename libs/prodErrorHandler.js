module.exports = (() => {
  const testExit = err => {
    console.log('Error ---');
  };

  const asyncTest = testExit;

  const logErrors = (err, req, res, next) => {
    console.log('error: ', err.message);
    next(err);
  };

  const clientResponse = (err, req, res, next) => {
    res.sendStatus(500);
  }

  return {
    asyncTest, 
    testExit,
    logErrors, 
    clientResponse
  }
})();