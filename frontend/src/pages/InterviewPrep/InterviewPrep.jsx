// Final Responsive InterviewPrep Component

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../utils/axiosInstance';
import { API } from '../../utils/apiPaths';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown, Copy, Moon, Sun,
  RefreshCcw, PlusCircle, Pin, Loader2, Bot,Star
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';
import toast, { Toaster } from 'react-hot-toast';
import moment from 'moment';
import { exportSessionToMarkdown, copySessionLink } from '../../utils/exportUtils';

const ITEMS_PER_PAGE = 5;

const formatAnswer = (answerParts, editable, onChange) => {
  if (!answerParts?.length) return <p className="text-sm italic text-muted">No answer provided.</p>;

  return answerParts.map((part, index) => {
    const content = part.content?.trim();
    if (!content) return null;

    if (part.type === 'code') {
      const language = part.language || 'js';
      return (
        <div key={index} className="relative group">
          <button onClick={() => { navigator.clipboard.writeText(content); toast.success("Copied!"); }}
            className="absolute top-2 right-2 bg-white dark:bg-gray-800 border px-2 py-1 text-xs rounded shadow hover:bg-gray-100">
            <Copy size={14} />
          </button>
          <div className="bg-gray-100 rounded p-4 overflow-x-auto text-sm">
            <ReactMarkdown children={`\`\`\`${language}\n${content}\n\`\`\``} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]} />
          </div>
        </div>
      );
    }

    return (
      <div key={index} className="text-base leading-relaxed text-foreground">
        {editable ? (
          <textarea
            value={content}
            onChange={(e) => onChange(index, e.target.value)}
            className="w-full bg-background border border-border rounded p-2 text-sm"
          />
        ) : (
          <ReactMarkdown
            children={content}
            remarkPlugins={[remarkGfm]}
            components={{
              h1: (props) => <h1 className="text-2xl font-bold mt-4 mb-2" {...props} />,
              h2: (props) => <h2 className="text-xl font-semibold mt-4 mb-2" {...props} />,
              p: (props) => <p className="prose dark:prose-invert mb-3 font-semibold text-sm leading-relaxed" {...props} />,
              ul: (props) => <ul className="list-disc pl-6 mb-3 space-y-1" {...props} />,
              ol: (props) => <ol className="list-decimal pl-6 mb-3 space-y-1" {...props} />,
              li: (props) => <li className="mb-1 font-bold" {...props} />,
              blockquote: (props) => <blockquote className="border-l-4 border-orange-300 bg-orange-50 dark:bg-orange-900/10 pl-4 italic text-muted mb-2" {...props} />,
              strong: (props) => <strong className="font-semibold" {...props} />,
              em: (props) => <em className="italic" {...props} />,
              a: (props) => <a className="text-blue-600 underline" {...props} />,
            }}
          />
        )}
      </div>
    );
  });
};

const InterviewPrep = () => {
  const { sessionId } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('interviewPrepTheme') === 'dark';
    }
    return false;
  });
  const [expandedAll, setExpandedAll] = useState(false);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [editableIndex, setEditableIndex] = useState(null);
  const [generatingMore, setGeneratingMore] = useState(false);
  const [regeneratingIndex, setRegeneratingIndex] = useState(null);
  const [importantOnly, setImportantOnly] = useState(false);
  const [importantMap, setImportantMap] = useState({});
  const [summaries, setSummaries] = useState({});
  const [summarizingIndex, setSummarizingIndex] = useState(null);



  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('interviewPrepTheme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('interviewPrepTheme', 'light');
    }
    axios.get(API.INTERVIEW.GET_ONE(sessionId))
      .then((res) => {
        setSession(res.data);
        // Load previously marked important Q&A
        const stored = localStorage.getItem(`importantMap-${sessionId}`);
        if (stored) setImportantMap(JSON.parse(stored));
      })
      .catch(() => toast.error('Failed to load session'))
      .finally(() => setLoading(false));
  }, [sessionId, darkMode]);

  const regenerateAnswer = async (question, index) => {
    setRegeneratingIndex(index);
    try {
      const res = await axios.post(API.INTERVIEW.ASK_AI, {
        question,
        title: session.title,
        tag: session.tag,
        experience: session.experience,
        sessionId,
        index,
      });
      const newAnswer = res.data.answerParts;
      const updated = { ...session };
      updated.qna[index].answerParts = newAnswer;
      setSession(updated);
      toast.success('Answer regenerated!');
    } catch {
      toast.error('Regeneration failed');
    } finally {
      setRegeneratingIndex(null);
    }
  };

  const handlePin = (index) => {
    setSession((prev) => {
      const newQna = [...prev.qna];
      const [pinned] = newQna.splice(index, 1);
      newQna.unshift(pinned);
      return { ...prev, qna: newQna };
    });
    toast.success('Pinned to top');
  };

  const handleAnswerChange = (index, newText) => {
    const updated = { ...session };
    updated.qna[editableIndex].answerParts[index].content = newText;
    setSession(updated);
  };

  const handleGenerateMore = async () => {
    setGeneratingMore(true);
    try {
      const res = await axios.post(API.INTERVIEW.GENERATE_MORE(sessionId));
      const moreQna = res.data?.newQna || [];
      setSession((prev) => ({ ...prev, qna: [...prev.qna, ...moreQna] }));
      toast.success('Generated more questions!');
    } catch {
      toast.error('Failed to generate');
    } finally {
      setGeneratingMore(false);
    }
  };
  const toggleImportant = (index) => {
    setImportantMap((prev) => {
      const updated = {
        ...prev,
        [index]: !prev[index]
      };
      localStorage.setItem(`importantMap-${sessionId}`, JSON.stringify(updated)); // store by sessionId
      return updated;
    });
  };

  const handleSummarize = async (index) => {
    const answerParts = session.qna[index].answerParts;
    const fullAnswer = answerParts.map(p => p.content).join('\n');

    setSummarizingIndex(index);

    try {
      const res = await axios.post(API.INTERVIEW.SUMMARIZE, {
        text: fullAnswer,
      });
      const summary = res.data.summary;

      setSummaries((prev) => ({
        ...prev,
        [index]: summary,
      }));
      toast.success('Summary generated!');
    } catch {
      toast.error('Failed to summarize');
    } finally {
      setSummarizingIndex(null);
    }
  };



  const filteredQna = session?.qna?.filter((_, i) => !importantOnly || importantMap[i]) || [];
  const visibleQna = filteredQna.slice(0, visibleCount);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="flex flex-col items-center gap-6">
          <div className="flex space-x-3">
            <div className="w-5 h-5 rounded-full bg-orange-500 animate-ping [animation-delay:-0.30s]"></div>
            <div className="w-5 h-5 rounded-full bg-orange-500 animate-ping [animation-delay:-0.35s]"></div>
            <div className="w-5 h-5 rounded-full bg-orange-500 animate-ping"></div>
          </div>
          <div className="text-center animate-pulse">
            <div className="flex items-center justify-center gap-2">
              <Bot className="w-7 h-7 text-orange-600 drop-shadow-md" />
              <h1 className="text-xl md:text-2xl font-bold text-orange-600 tracking-wide">
                Interview AI
              </h1>
            </div>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mt-2">Setting up your smart session, hold tight...</p>
          </div>
          <div className="w-48 h-2 bg-orange-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 animate-loading-bar rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!session) return <div className="min-h-screen flex items-center justify-center text-red-500">Session not found.</div>;

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Toaster position="top-right" />
      <div className="w-full max-w-screen-xl mx-auto px-4 md:px-6 py-6 md:py-10 space-y-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="rounded-2xl bg-gradient-to-br from-sky-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-6 shadow-xl border">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2 max-w-full">
              <h1 className="text-3xl font-bold tracking-tight dark:text-white">{session.title}</h1>
              <p className="text-sm dark:text-white">{session.desc}</p>
              <div className="flex flex-wrap gap-2">
                {session.tag?.split(',').map((tag, i) => (
                  <span key={i} className="text-xs px-3 py-1 rounded-full bg-pink-100 text-pink-800 dark:bg-pink-900/10 dark:text-pink-200">{tag.trim()}</span>
                ))}
              </div>
            </div>
            <div className="text-sm space-y-1 text-right dark:text-white">
              <div><strong>Experience:</strong> {session.experience}</div>
              <div><strong>Created:</strong> {moment(session.createdAt).format('DD MMM YYYY')}</div>
              <div><strong>Time:</strong> {moment(session.createdAt).format('hh:mm A')}</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-6 justify-end dark:text-white">
            <Button variant="outline" onClick={() => setImportantOnly(p => !p)}>
              {importantOnly ? 'Show All' : 'Show Only Important'}
            </Button>
            <Button variant="outline" onClick={() => setExpandedAll(p => !p)}>{expandedAll ? 'Collapse All' : 'Expand All'}</Button>
            <Button variant="outline" onClick={() => setDarkMode(p => !p)}>{darkMode ? <Sun size={16} /> : <Moon size={16} />}</Button>
            <Button variant="outline" onClick={() => exportSessionToMarkdown(session)}>Export</Button>
            <Button onClick={copySessionLink}>Share</Button>
          </div>
        </motion.div>

        {/* Disclaimer Section  */}
        <section className="relative px-4 md:px-8 py-4 md:py-6 bg-orange-50 dark:bg-orange-900/10 border border-orange-300 dark:border-orange-800 rounded-xl shadow-md mx-auto mb-8 max-w-4xl animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="animate-bounce text-orange-600">
              ⚠️
            </div>
            <div>
              <h4 className="text-lg md:text-xl font-semibold text-orange-700 dark:text-orange-300">
                Disclaimer
              </h4>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 mt-1 leading-relaxed">
                Some answers shown below may be generated by AI if the original response was not available. Use your discretion and feel free to regenerate or edit the answers as needed.
              </p>
            </div>
          </div>
        </section>

        {/* QnA Section */}
        <div className="space-y-6">
          <AnimatePresence>
            {visibleQna.map((qa, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ delay: i * 0.05 }}>
                <Card>
                  <details open={expandedAll} className="group">
                    <summary className="px-6 py-4 bg-secondary hover:bg-orange-50 dark:bg-muted cursor-pointer flex items-center justify-between">
                      <div className="flex items-center gap-2 font-semibold">
                        <span className="text-orange-600">Q{i + 1}:</span> {qa.question}
                      </div>
                      <ChevronDown className="group-open:rotate-180 transition-transform" size={20} />
                    </summary>
                    <CardContent className="px-6 py-4 space-y-4">
                      {formatAnswer(qa.answerParts, editableIndex === i, handleAnswerChange)}
                      <div className="flex gap-2 flex-wrap justify-end">
                        <Button onClick={() => regenerateAnswer(qa.question, i)} size="sm" variant="secondary" disabled={regeneratingIndex === i}>
                          {regeneratingIndex === i ? <Loader2 className="animate-spin" size={16} /> : <RefreshCcw size={16} />} Regenerate
                        </Button>
                        <Button onClick={() => setEditableIndex(editableIndex === i ? null : i)} size="sm" variant="outline">
                          {editableIndex === i ? 'Done' : 'Edit'}
                        </Button>
                        <Button onClick={() => handlePin(i)} size="sm" variant="ghost" className="text-orange-600">
                          <Pin size={16} /> Pin
                        </Button>
                        <Button onClick={() => toggleImportant(i)} size="sm" variant="ghost" className={importantMap[i] ? 'text-yellow-500' : 'text-gray-500'}>
                          <Star size={16} /> {importantMap[i] ? 'Unmark' : 'Mark Important'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSummarize(i)}
                          disabled={summarizingIndex === i}
                        >
                          {summarizingIndex === i ? (
                            <Loader2 className="animate-spin mr-2" size={16} />
                          ) : null}
                          Summary
                        </Button>
                        {summaries[i] && (
                          <div className="mt-4 p-3 rounded-lg bg-yellow-50 border-l-4 border-yellow-400 dark:bg-yellow-900/10">
                            <strong className="block mb-1 text-yellow-700 dark:text-yellow-200">Summary:</strong>
                            <p className="text-sm text-gray-800 dark:text-gray-100">{summaries[i]}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </details>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {visibleCount < session.qna?.length && (
          <div className="flex justify-center mt-10">
            <Button onClick={() => setVisibleCount(prev => prev + ITEMS_PER_PAGE)} className="rounded-full px-6 py-2 bg-black text-white">Load More</Button>
          </div>
        )}

        <div className="flex justify-center mt-6">
          <Button variant="outline" className="gap-2" onClick={handleGenerateMore} disabled={generatingMore}>
            <PlusCircle size={16} /> {generatingMore ? 'Generating...' : 'Generate More'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InterviewPrep;
