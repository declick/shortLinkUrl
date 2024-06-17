// midalleware/errorMiddleware.js

const handleJwtError = (err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.redirect('/'); 
  }
  next(err);
};

  export default handleJwtError;
  