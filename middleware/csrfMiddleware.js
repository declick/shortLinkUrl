import csrf from 'csurf';

const csrfProtection = csrf({ cookie: true });

export default csrfProtection;
