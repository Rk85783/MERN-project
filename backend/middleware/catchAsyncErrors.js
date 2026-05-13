module.exports = (theFn) => (req, res, next) => {
  Promise.resolve(theFn(req, req, next)).catch(next);
};
