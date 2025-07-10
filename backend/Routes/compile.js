const express = require('express');
const router = express.Router();
const axios = require('axios');

const JUDGE0_API = 'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true';

router.post('/', async (req, res) => {
  const { source_code, language_id, stdin } = req.body;

  try {
    const response = await axios.post(JUDGE0_API, {
      source_code,
      language_id,
      stdin,
    }, {
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
        'content-type': 'application/json',
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Compilation error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to compile code' });
  }
});

module.exports = router;
