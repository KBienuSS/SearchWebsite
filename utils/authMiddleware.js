const authMiddleware = async (req, res, next) => {
    if (req.session.user) {
      next();
    } else {
      res.status(401).send({ message: 'You are not authorized' });
    }
}

module.exports = authMiddleware;