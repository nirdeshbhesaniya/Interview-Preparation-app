const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Clean markdown formatting artifacts
function cleanText(text) {
  return text
    .replace(/[*#@!$>]+/g, '') // Strip symbols
    .replace(/\n{3,}/g, '\n\n') // Normalize excessive line breaks
    .trim();
}

// Parse markdown answer into parts: text/code
function parseAnswer(answerText) {
  const lines = answerText.split('\n');
  const parts = [];

  let current = { type: 'text', content: '' };
  let isInCodeBlock = false;
  let codeLang = '';

  for (const line of lines) {
    const codeBlockMatch = line.trim().match(/^```(\w+)?/);

    if (codeBlockMatch) {
      // Toggle code block
      if (isInCodeBlock) {
        // End code block
        parts.push({
          type: 'code',
          content: current.content.trim(),
          language: codeLang || 'plaintext',
        });
        current = { type: 'text', content: '' };
        codeLang = '';
      } else {
        // Start code block
        if (current.content.trim()) {
          parts.push({
            type: 'text',
            content: cleanText(current.content),
          });
        }
        current = { type: 'code', content: '' };
        codeLang = codeBlockMatch[1] || 'plaintext';
      }

      isInCodeBlock = !isInCodeBlock;
    } else {
      current.content += line + '\n';
    }
  }

  if (current.content.trim()) {
    parts.push({
      type: isInCodeBlock ? 'code' : 'text',
      content: cleanText(current.content),
      ...(isInCodeBlock && { language: codeLang || 'plaintext' }),
    });
  }

  return parts;
}

// Generate Q&A from Gemini AI
async function generateInterviewQuestions(title, tag, experience, desc) {
  const model = genAI.getGenerativeModel({
    model: 'models/gemini-1.5-flash',
  });

  const prompt = `
You're an expert interviewer. Generate 5 structured technical interview questions on the topic **"${title}"** under the tag [${tag}], tailored for a candidate with **${experience}** of experience.

For each question:
- Use numbered formatting (e.g., 1. Question).
- Follow each question with a detailed answer in markdown format.
- Include bullet points, emphasis, and **code blocks** wrapped in triple backticks (e.g., \`\`\`js).

Strict formatting: 1 question per section.
`;

  try {
    const result = await model.generateContent(prompt);
    const markdown = result.response.text();

    const qaSections = markdown
      .split(/\n(?=\d+\.\s)/) // Split on "1. Question"
      .filter(Boolean)
      .map((entry) => {
        const [qLine, ...aLines] = entry.trim().split('\n');
        const question = qLine.replace(/^\d+\.\s*/, '').trim();
        const answerText = aLines.join('\n').trim();

        return {
          question: cleanText(question),
          answerParts: parseAnswer(answerText),
        };
      });

    return qaSections;
  } catch (err) {
    if (err.status === 429) {
      console.warn('Gemini API quota exceeded.');
    }
    console.error('Gemini generation failed:', err);
    throw err;
  }
}

module.exports = { generateInterviewQuestions };
