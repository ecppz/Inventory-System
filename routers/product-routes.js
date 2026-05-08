const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const Item = require('../models/item');
const { isAuth } = require('../middlewares/auth');

// multer config
const carpetaUpload = path.join(__dirname, '../upload');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, carpetaUpload),
  filename: (req, file, cb) => cb(null, Date.now() + file.originalname)
});

const upload = multer({ storage }).single('image');

// index
router.get('/', isAuth, async (req, res) => {
  const items = await Item.find();
  res.render('index', {
    title: 'Inicio',
    items,
    styles: ['/styles/pages/index.css', '/styles/components/header.css','/styles/components/footer.css'],
    message: req.session.message
  });
    req.session.message = null;
});

//create
router.get('/register-product', isAuth, (req, res) => {
  res.render('register-product', {
    title: 'Registro de productos',
    styles: ['/styles/pages/register-product.css', '/styles/components/header.css', '/styles/components/footer.css'],
  });
});

router.post('/register-product', isAuth, upload, async (req, res) => {
  let filename = req.file ? req.file.filename : "default.png";
  
  const item = new Item({
    ...req.body,
    image: filename,
  });

  await item.save();

  req.session.message = {
    alert: 'Item agregado correctamente!',
    type: 'added'
  };

  res.redirect('/');
});

// edit 
router.get('/update/:id', isAuth, async (req, res) => {
  const item = await Item.findById(req.params.id);

  if (!item) return res.redirect('/');

  res.render('update', {
    title: 'Editando...',
    item,
    styles: ['/styles/pages/update.css', '/styles/components/header.css', '/styles/components/footer.css']
  });
});

// update
router.post('/update/:id', isAuth, upload, async (req, res) => {
  let new_image = req.body.old_image;

  if (req.file) {
    new_image = req.file.filename;
    try { fs.unlinkSync('./upload/' + req.body.old_image); } catch {}
  }

  await Item.findByIdAndUpdate(req.params.id, {
    ...req.body,
    image: new_image
  });

  req.session.message = { alert: 'Item editado correctamente!', type: 'updated' };
  res.redirect('/');
});

// delete
router.get('/delete/:id', isAuth, async (req, res) => {
  const item = await Item.findByIdAndDelete(req.params.id);

  if (item?.image) {
    try { fs.unlinkSync('./upload/' + item.image); } catch {}
  }

  req.session.message = {
    alert: 'Item eliminado correctamente!',
    type: 'deleted'
  };

  res.redirect('/');
});

module.exports = router;