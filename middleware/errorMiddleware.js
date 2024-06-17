// midalleware/errorMiddleware.js

 const handleJwtError = (err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      return res.status(401).json({ error: 'Invalid or missing token' });
    }
    next(err);
  };

  export default handleJwtError;
  