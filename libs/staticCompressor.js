module.exports = (req, res, next) => {
  req.url = req.url + '.gz';
  res.set({
    'Content-Encoding': 'gzip',
    'Content-Type': 'text/javascript'
  });

  next();
};