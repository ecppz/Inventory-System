const express = require('express');
const router = express.Router();
const User = require('../models/user');

// login
router.get('/login', (req, res) => {
  res.render('auth/login', {
    title: 'Login',
    styles: ['/styles/pages/login.css', '/styles/components/header.css', '/styles/components/footer.css'],
    message: req.session.message
  });
  req.session.message = null;
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.password !== password) {
    req.session.message = { type: 'danger', alert: 'Credenciales incorrectas' };
    return res.redirect('/login');
  }

  req.session.user = user;
  res.redirect('/');
});

// logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// register
router.get('/register', (req, res) => {
  res.render('auth/register', {
    title: 'Registro de usuarios',
    styles: ['/styles/pages/register.css', '/styles/components/header.css', '/styles/components/footer.css'],
    message: req.session.message
  });

});

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    req.session.message = { type: 'danger', alert: 'El usuario ya existe' };
    return res.redirect('/register');
  }

  await User.create({ name, email, password });
  req.session.message = {
    type: 'success', 
    alert: 'Usuario creado' 
  };
  res.redirect('/login');
});

module.exports = router;