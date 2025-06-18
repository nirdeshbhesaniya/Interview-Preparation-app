const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../Controllers/authController');
const upload = require('../middlewares/upload'); // ✅ Use this and remove any redefinition

router.post('/register', upload.single('photo'), registerUser);
router.post('/login', loginUser);

module.exports = router;
