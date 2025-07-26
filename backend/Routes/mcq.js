const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { chatWithAI } = require('../utils/gemini');

// Create email transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

// Generate MCQ questions using Gemini AI
async function generateMCQQuestions(topic, difficulty = 'medium', numberOfQuestions = 30) {
    const prompt = `Generate exactly ${numberOfQuestions} multiple-choice questions about "${topic}" with ${difficulty} difficulty level.

Format each question exactly as follows:
QUESTION_NUMBER. Question text here?
A) Option A
B) Option B  
C) Option C
D) Option D
CORRECT: [A/B/C/D]
EXPLANATION: Brief explanation of why this answer is correct.

Requirements:
- Questions should cover different aspects of ${topic}
- Mix of theoretical and practical questions with CODE EXAMPLES
- Include code snippets using markdown format: \`\`\`language\ncode here\n\`\`\`
- Each question should have 4 options (A, B, C, D)
- Only one correct answer per question
- Clear and concise explanations
- Progressive difficulty throughout the test
- Cover topics like: basics, advanced concepts, best practices, common mistakes, real-world applications
- At least 30% of questions should include code snippets or examples
- Use proper markdown formatting for code: \`inline code\` or \`\`\`language blocks\`\`\`
- Include syntax highlighting language specification (javascript, python, html, css, etc.)

Example formats for code questions:
- What will the following code output?
- Which code snippet correctly implements...?
- What is wrong with this code?
- Complete the missing code...

Generate all ${numberOfQuestions} questions in the exact format specified above with proper markdown code formatting.`;

    try {
        const response = await chatWithAI(prompt, 'general');
        return parseMCQResponse(response, numberOfQuestions);
    } catch (error) {
        console.error('Error generating MCQ questions:', error);
        throw new Error('Failed to generate questions');
    }
}

// Parse AI response into structured MCQ format
function parseMCQResponse(response, numberOfQuestions = 30) {
    const questions = [];
    const questionBlocks = response.split(/\d+\.\s/).filter(block => block.trim());

    questionBlocks.forEach((block, index) => {
        const lines = block.trim().split('\n').map(line => line.trim()).filter(line => line);

        if (lines.length >= 6) {
            const questionText = lines[0].replace(/\?$/, '') + '?';
            const optionsObj = {};
            const optionsArray = [];
            let correctAnswer = '';
            let explanation = '';

            lines.forEach(line => {
                if (line.match(/^[A-D]\)/)) {
                    const letter = line.charAt(0);
                    const text = line.substring(3).trim();
                    optionsObj[letter] = text;
                    optionsArray.push(text);
                } else if (line.startsWith('CORRECT:')) {
                    correctAnswer = line.substring(8).trim().replace(/[[\]]/g, '');
                } else if (line.startsWith('EXPLANATION:')) {
                    explanation = line.substring(12).trim();
                }
            });

            if (Object.keys(optionsObj).length === 4 && correctAnswer && questionText) {
                // Convert correct answer letter to array index
                const correctIndex = ['A', 'B', 'C', 'D'].indexOf(correctAnswer);

                questions.push({
                    id: index + 1,
                    question: questionText,
                    options: optionsArray, // Use array instead of object
                    correctAnswer: correctIndex, // Use index instead of letter
                    explanation: explanation
                });
            }
        }
    });

    return questions.slice(0, numberOfQuestions); // Ensure exactly the requested number of questions
}

// Evaluate MCQ answers using AI
async function evaluateAnswers(questions, userAnswers, userInfo) {
    const { name, email } = userInfo;

    let correctCount = 0;
    let totalQuestions = questions.length;
    const detailedResults = [];

    questions.forEach((question, index) => {
        const userAnswer = userAnswers[index]; // Use array index
        const isCorrect = userAnswer === question.correctAnswer; // Compare indexes directly

        if (isCorrect) correctCount++;

        detailedResults.push({
            questionNumber: index + 1,
            question: question.question,
            userAnswer: userAnswer !== undefined ? question.options[userAnswer] : 'Not Answered',
            correctAnswer: question.options[question.correctAnswer],
            isCorrect: isCorrect,
            explanation: question.explanation,
            options: question.options
        });
    });

    const score = Math.round((correctCount / totalQuestions) * 100);
    const grade = getGrade(score);

    // Generate AI feedback
    const feedbackPrompt = `A user named ${name} has completed a 30-question MCQ test and scored ${score}% (${correctCount}/${totalQuestions} correct). 

Provide personalized feedback including:
1. Overall performance assessment
2. Strengths and areas for improvement
3. Study recommendations
4. Motivational message
5. Next steps for learning

Keep it encouraging and constructive.`;

    let aiFeedback = '';
    try {
        aiFeedback = await chatWithAI(feedbackPrompt, 'general');
        aiFeedback = aiFeedback.replace(/[*#`_]/g, ''); // Remove markdown
    } catch (error) {
        aiFeedback = `Congratulations ${name}! You scored ${score}% on the test. Keep practicing to improve your knowledge.`;
    }

    return {
        totalQuestions,
        correctAnswers: correctCount,
        score,
        grade,
        aiFeedback,
        detailedResults,
        timestamp: new Date().toISOString()
    };
}

// Get grade based on score
function getGrade(score) {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    return 'F';
}

// Send results via email
async function sendResultsEmail(userInfo, results, topic) {
    const { name, email } = userInfo;
    const transporter = createTransporter();

    const emailHTML = `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #f97316, #dc2626, #db2777); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Interview AI - MCQ Test Results</h1>
      </div>
      
      <div style="background: #fff; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #ddd;">
        <h2 style="color: #333; margin-top: 0;">Hello ${name}!</h2>
        
        <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 20px 0; border-left: 5px solid #f97316;">
          <h3 style="color: #333; margin-top: 0;">Test Summary</h3>
          <p><strong>Topic:</strong> ${topic}</p>
          <p><strong>Total Questions:</strong> ${results.totalQuestions}</p>
          <p><strong>Correct Answers:</strong> ${results.correctAnswers}</p>
          <p><strong>Score:</strong> ${results.score}%</p>
          <p><strong>Grade:</strong> ${results.grade}</p>
          <p><strong>Test Date:</strong> ${new Date(results.timestamp).toLocaleString()}</p>
        </div>
        
        <div style="background: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1e40af; margin-top: 0;">AI Feedback</h3>
          <p style="line-height: 1.6; color: #555; white-space: pre-line;">${results.aiFeedback}</p>
        </div>
        
        <div style="margin: 30px 0;">
          <h3 style="color: #333;">Detailed Results</h3>
          ${results.detailedResults.map((result, index) => `
            <div style="border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 5px; ${result.isCorrect ? 'background: #f0f9f0; border-color: #4ade80;' : 'background: #fef2f2; border-color: #f87171;'}">
              <p style="margin: 0 0 10px 0; font-weight: bold;">Q${result.questionNumber}: ${result.question}</p>
              <p style="margin: 5px 0;"><strong>Your Answer:</strong> ${result.userAnswer}</p>
              <p style="margin: 5px 0;"><strong>Correct Answer:</strong> ${result.correctAnswer}</p>
              <p style="margin: 5px 0; color: ${result.isCorrect ? '#16a34a' : '#dc2626'};"><strong>Status:</strong> ${result.isCorrect ? '✅ Correct' : '❌ Incorrect'}</p>
              ${result.explanation ? `<p style="margin: 10px 0 0 0; font-style: italic; color: #666;"><strong>Explanation:</strong> ${result.explanation}</p>` : ''}
            </div>
          `).join('')}
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px;">
          <p style="margin: 0; color: #555;">Want to improve your skills? Visit <strong>Interview AI</strong> for more practice tests and interview preparation resources!</p>
        </div>
      </div>
    </div>
  `;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Your MCQ Test Results - ${results.score}% Score`,
        html: emailHTML
    };

    await transporter.sendMail(mailOptions);
}

// Generate MCQ test
router.post('/generate', async (req, res) => {
    try {
        const { topic, difficulty = 'medium', numberOfQuestions = 30 } = req.body;

        if (!topic) {
            return res.status(400).json({
                success: false,
                message: 'Topic is required'
            });
        }

        console.log(`Generating MCQ test for topic: ${topic} with ${numberOfQuestions} questions`);
        const questions = await generateMCQQuestions(topic, difficulty, numberOfQuestions);

        if (questions.length < numberOfQuestions) {
            return res.status(500).json({
                success: false,
                message: 'Failed to generate enough questions. Please try again.'
            });
        }

        // Remove correct answers and explanations from response
        const questionsForTest = questions.map(({ correctAnswer, explanation, ...question }) => question);

        res.json({
            success: true,
            data: {
                questions: questionsForTest,
                topic,
                difficulty,
                totalQuestions: questions.length,
                timeLimit: 45 // 45 minutes
            }
        });

    } catch (error) {
        console.error('Error generating MCQ test:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate MCQ test. Please try again.'
        });
    }
});

// Submit MCQ test answers
router.post('/submit', async (req, res) => {
    try {
        const { topic, answers, userInfo, numberOfQuestions = 30 } = req.body;

        if (!topic || !answers || !userInfo || !userInfo.name || !userInfo.email) {
            return res.status(400).json({
                success: false,
                message: 'Topic, answers, and user information are required'
            });
        }

        console.log(`Evaluating MCQ test for: ${userInfo.email}`);

        // Re-generate questions to get correct answers with the same number of questions
        const questions = await generateMCQQuestions(topic, 'medium', numberOfQuestions);

        // Evaluate answers
        const results = await evaluateAnswers(questions, answers, userInfo);

        // Send results email
        try {
            await sendResultsEmail(userInfo, results, topic);
            console.log(`Results email sent to: ${userInfo.email}`);
        } catch (emailError) {
            console.error('Failed to send results email:', emailError);
            // Don't fail the request if email fails
        }

        res.json({
            success: true,
            data: {
                results: {
                    totalQuestions: results.totalQuestions,
                    correctAnswers: results.correctAnswers,
                    score: results.score,
                    grade: results.grade,
                    aiFeedback: results.aiFeedback
                },
                message: 'Test submitted successfully! Results have been sent to your email.'
            }
        });

    } catch (error) {
        console.error('Error submitting MCQ test:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to evaluate test. Please try again.'
        });
    }
});

// Get available topics
router.get('/topics', (req, res) => {
    const topics = [
        'JavaScript Fundamentals',
        'React Development',
        'Node.js Backend',
        'Python Programming',
        'Data Structures',
        'Algorithms',
        'Database Management',
        'System Design',
        'Web Development',
        'Machine Learning',
        'Cybersecurity',
        'DevOps',
        'Cloud Computing',
        'Mobile Development',
        'Software Engineering'
    ];

    res.json({
        success: true,
        data: { topics }
    });
});

module.exports = router;
