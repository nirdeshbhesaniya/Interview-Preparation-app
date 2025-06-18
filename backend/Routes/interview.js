const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Interview = require('../Models/Interview');
const { generateInterviewQuestions } = require('../utils/gemini');

// GET all cards
router.get('/', async (req, res) => {
  try {
    const cards = await Interview.find().sort({ createdAt: -1 });
    res.json(cards);
  } catch {
    res.status(500).json({ message: 'Failed to fetch cards' });
  }
});

// GET single card
router.get('/:sessionId', async (req, res) => {
  try {
    const card = await Interview.findOne({ sessionId: req.params.sessionId });
    if (!card) return res.status(404).json({ message: 'Card not found' });
    res.json(card);
  } catch {
    res.status(500).json({ message: 'Failed to fetch card' });
  }
});

// CREATE card
router.post('/', async (req, res) => {
  const { title, tag, initials, experience, desc, color } = req.body;

  if (!title || !tag || !initials || !experience || !desc) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const sessionId = uuidv4();
    const aiQuestions = await generateInterviewQuestions(title, tag, experience, desc);

    // Validate and clean answerParts
    const qna = aiQuestions.map((q) => ({
      question: q.question,
      answerParts: Array.isArray(q.answerParts)
        ? q.answerParts.filter(p => p.type && p.content)
        : []
    }));

    const newCard = new Interview({
      sessionId,
      title,
      tag,
      initials,
      experience,
      desc,
      color,
      qna
    });

    await newCard.save();
    res.status(201).json(newCard);
  } catch (err) {
    console.error('Error creating interview card:', err);
    res.status(500).json({ message: 'Failed to create card' });
  }
});

// DELETE card
router.delete('/:sessionId', async (req, res) => {
  try {
    const deleted = await Interview.findOneAndDelete({ sessionId: req.params.sessionId });
    if (!deleted) return res.status(404).json({ message: 'Card not found' });
    res.json({ message: 'Card deleted' });
  } catch {
    res.status(500).json({ message: 'Failed to delete card' });
  }
});

// PATCH regenerate a single question's answer
router.patch('/regenerate/:sessionId/:index', async (req, res) => {
  try {
    const { sessionId, index } = req.params;
    const card = await Interview.findOne({ sessionId });

    if (!card || !card.qna[index]) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const { title, tag, experience } = card;
    const question = card.qna[index].question;

    const prompt = `Generate a detailed answer for the technical interview question: "${question}" on topic "${title}" [${tag}] for a candidate with ${experience} experience. Include clear structure and code blocks wrapped in triple backticks.`;

    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const answerParts = parseAnswer(text);

    card.qna[index].answerParts = answerParts;
    await card.save();

    res.json({ answerParts });
  } catch (err) {
    console.error('Failed to regenerate answer:', err);
    res.status(500).json({ message: 'Failed to regenerate answer' });
  }
});

// PATCH to manually edit a QnA block
router.patch('/edit/:sessionId/:index', async (req, res) => {
  try {
    const { sessionId, index } = req.params;
    const { question, answerParts } = req.body;

    const card = await Interview.findOne({ sessionId });
    if (!card || !card.qna[index]) {
      return res.status(404).json({ message: 'QnA not found' });
    }

    if (question) card.qna[index].question = question;
    if (answerParts) card.qna[index].answerParts = answerParts;

    await card.save();
    res.json(card.qna[index]);
  } catch (err) {
    console.error('Error updating QnA:', err);
    res.status(500).json({ message: 'Failed to update QnA' });
  }
});

// POST /interview/generate-more/:sessionId
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Import Mongoose model


// Utility to clean and parse AI answers
function cleanText(text) {
  return text
    .replace(/[*#@!$>]+/g, '')
    .replace(/\n{2,}/g, '\n\n')
    .trim();
}

function parseAnswer(answerText) {
  const lines = answerText.split('\n');
  const parts = [];

  let current = { type: 'text', content: '' };
  let isInCodeBlock = false;

  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      if (isInCodeBlock) {
        parts.push({
          type: 'code',
          content: cleanText(current.content)
        });
        current = { type: 'text', content: '' };
      } else {
        if (current.content.trim()) {
          parts.push({
            type: 'text',
            content: cleanText(current.content)
          });
        }
        current = { type: 'code', content: '' };
      }
      isInCodeBlock = !isInCodeBlock;
    } else {
      current.content += line + '\n';
    }
  }

  if (current.content.trim()) {
    parts.push({
      type: isInCodeBlock ? 'code' : 'text',
      content: cleanText(current.content)
    });
  }

  return parts;
}

// ✅ Route to generate more QnA
router.post('/generate-more/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await Interview.findOne({ sessionId });

    if (!session) return res.status(404).json({ message: 'Session not found' });

    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });

    const prompt = `Generate 3 more technical interview questions with detailed answers on "${session.title}" [${session.tag}] for a candidate with ${session.experience} experience. 
Answers should include clear explanations and code blocks (wrapped in triple backticks) if relevant. Format like:
1. Question?
Answer...`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const generatedQnA = text
      .split(/\n(?=\d+\.\s)/)
      .map((entry) => {
        const [qLine, ...aLines] = entry.trim().split('\n');
        const question = qLine.replace(/^\d+\.\s*/, '');
        const answerRaw = aLines.join('\n');

        return {
          question: cleanText(question),
          answerParts: parseAnswer(answerRaw)
        };
      });

    session.qna.push(...generatedQnA);
    await session.save();

    res.status(200).json({ newQna: generatedQnA });
  } catch (err) {
    console.error("Generate more QnA error:", err);
    res.status(500).json({ message: 'Failed to generate more questions' });
  }
});

router.post('/ask', async (req, res) => {
  try {
    const { question, title, tag, experience, sessionId, index } = req.body;

    const prompt = `Generate a detailed answer for the technical interview question: "${question}" on topic "${title}" [${tag}] for a candidate with ${experience} experience. Include clear structure and code blocks wrapped in triple backticks.`;

    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const answerParts = parseAnswer(text);

    // If sessionId and index provided, update existing card
    if (sessionId && typeof index === 'number') {
      const card = await Interview.findOne({ sessionId });
      if (!card || !card.qna[index]) {
        return res.status(404).json({ message: 'Card or QnA not found' });
      }

      card.qna[index].answerParts = answerParts;
      await card.save();
    }

    res.status(200).json({ answerParts });
  } catch (err) {
    console.error('Ask endpoint failed:', err);
    res.status(500).json({ message: 'Failed to get AI answer' });
  }
});


module.exports = router;
