const bcrypt = require('bcryptjs');
const User = require('../Models/User');
const cloudinary = require('../utils/cloudinary');
const fs = require('fs'); // to delete local files if needed

exports.registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'Email already registered' });

    // Upload photo to Cloudinary
    let uploadedPhotoUrl = null;
    if (req.file?.path) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'user_profiles',
        resource_type: 'image',
      }); 


      uploadedPhotoUrl = result.secure_url;

      // Optionally remove local uploaded file
      fs.unlinkSync(req.file.path);
    }
    // console.log('Uploaded photo URL:', uploadedPhotoUrl);
    

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save new user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      photo: uploadedPhotoUrl,
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully', userId: newUser._id });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// const jwt = require('jsonwebtoken'); // Optional

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    // Optional: Generate JWT token
    // const token = jwt.sign({ id: user._id }, 'secretKey', { expiresIn: '1h' });

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        photo: user.photo,
      },
      // token
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
