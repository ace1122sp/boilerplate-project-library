module.exports = (() => {
  const testExit = err => {
    console.error(err);
    process.exit(1);
  };

  const asyncTest = (err, done) => {
    console.error(err);
    done();
  };

  const logErrors = (err, req, res, next) => {
    console.error(err);
    next(err);
  };

  const clientResponse = (err, req, res, next) => {
    res.sendStatus(500);      
  };

  return {
    asyncTest,
    testExit,
    logErrors, 
    clientResponse 
  }
})();