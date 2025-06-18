const bcrypt = require('bcryptjs');
const User = require('../Models/User');
const cloudinary = require('../utils/cloudinary');
// const fs = require('fs'); // to delete local files if needed
const streamifier = require('streamifier');

exports.registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Upload profile image from memory to Cloudinary
    let uploadedPhotoUrl = '';
    if (req.file) {
      const streamUpload = (fileBuffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'user_profiles', resource_type: 'image' },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          streamifier.createReadStream(fileBuffer).pipe(stream);
        });
      };

      const result = await streamUpload(req.file.buffer);
      uploadedPhotoUrl = result.secure_url;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      photo: uploadedPhotoUrl,
    });

    await newUser.save();

    res.status(201).json({
      message: 'User registered successfully',
      userId: newUser._id,
    });
  } catch (err) {
    console.error('Registration Error:', err);
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
