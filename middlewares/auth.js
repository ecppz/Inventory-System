// middlewares/auth.js
function isAuth(req, res, next) {
  if (!req.session.user) {
    req.session.message = {
      type: 'danger',
      alert: 'Debes iniciar sesión primero'
    };
    return res.redirect('/login');
  }
  next(); 
}

module.exports = { isAuth };