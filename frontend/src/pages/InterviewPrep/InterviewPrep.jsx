// Final Responsive InterviewPrep Component

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../utils/axiosInstance';
import { API } from '../../utils/apiPaths';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown, Copy, Moon, Sun,
  RefreshCcw, PlusCircle, Pin, Loader2, Bot, Star
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
  if (!answerParts?.length) return <p className="text-sm italic text-gray-500 dark:text-gray-400">No answer provided.</p>;

  return answerParts.map((part, index) => {
    const content = part.content?.trim();
    if (!content) return null;

    if (part.type === 'code') {
      const language = part.language || 'js';
      return (
        <div key={index} className="relative group my-4">
          <button
            onClick={() => {
              navigator.clipboard.writeText(content);
              toast.success("Code copied to clipboard!");
            }}
            className="absolute top-2 right-2 z-10 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 px-2 py-1 text-xs rounded-md shadow-sm transition-all duration-200 flex items-center gap-1 opacity-0 group-hover:opacity-100"
          >
            <Copy className="w-3 h-3" />
            <span className="hidden sm:inline">Copy</span>
          </button>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 sm:p-4 overflow-x-auto text-sm border border-gray-200 dark:border-gray-700 shadow-sm">
            <ReactMarkdown
              children={`\`\`\`${language}\n${content}\n\`\`\``}
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
            />
          </div>
        </div>
      );
    }

    return (
      <div key={index} className="text-sm sm:text-base leading-relaxed text-gray-800 dark:text-gray-200">
        {editable ? (
          <textarea
            value={content}
            onChange={(e) => onChange(index, e.target.value)}
            className="w-full min-h-[120px] bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
            placeholder="Edit your answer here..."
          />
        ) : (
          <ReactMarkdown
            children={content}
            remarkPlugins={[remarkGfm]}
            components={{
              h1: (props) => <h1 className="text-xl sm:text-2xl font-bold mt-6 mb-3 text-gray-900 dark:text-white" {...props} />,
              h2: (props) => <h2 className="text-lg sm:text-xl font-semibold mt-5 mb-2 text-gray-900 dark:text-white" {...props} />,
              h3: (props) => <h3 className="text-base sm:text-lg font-semibold mt-4 mb-2 text-gray-800 dark:text-gray-200" {...props} />,
              p: (props) => <p className="mb-3 text-sm sm:text-base leading-relaxed text-gray-700 dark:text-gray-300" {...props} />,
              ul: (props) => <ul className="list-disc pl-4 sm:pl-6 mb-3 space-y-1" {...props} />,
              ol: (props) => <ol className="list-decimal pl-4 sm:pl-6 mb-3 space-y-1" {...props} />,
              li: (props) => <li className="mb-1 text-sm sm:text-base text-gray-700 dark:text-gray-300" {...props} />,
              blockquote: (props) => <blockquote className="border-l-4 border-orange-300 bg-orange-50 dark:bg-orange-900/20 pl-4 py-2 italic text-gray-600 dark:text-gray-400 mb-3 rounded-r-lg" {...props} />,
              strong: (props) => <strong className="font-semibold text-gray-900 dark:text-white" {...props} />,
              em: (props) => <em className="italic text-gray-700 dark:text-gray-300" {...props} />,
              a: (props) => <a className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300 transition-colors" {...props} />,
              code: (props) => <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono text-gray-800 dark:text-gray-200" {...props} />,
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4">
        <div className="flex flex-col items-center gap-6 sm:gap-8 max-w-md w-full">
          <div className="flex space-x-2 sm:space-x-3">
            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-orange-500 animate-ping [animation-delay:-0.30s]"></div>
            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-orange-500 animate-ping [animation-delay:-0.35s]"></div>
            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-orange-500 animate-ping"></div>
          </div>
          <div className="text-center animate-pulse">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3">
              <Bot className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600 drop-shadow-md" />
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-600 tracking-wide">
                Interview AI
              </h1>
            </div>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed px-4">
              Setting up your intelligent interview session...
            </p>
          </div>
          <div className="w-48 sm:w-64 h-2 bg-orange-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-orange-400 to-orange-600 animate-loading-bar rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4">
          <div className="text-center max-w-md w-full">
            <div className="text-6xl sm:text-8xl text-red-500 mb-6">❌</div>
            <h1 className="text-xl sm:text-2xl font-bold text-red-600 dark:text-red-400 mb-3">
              Session Not Found
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
              The interview session you're looking for doesn't exist or may have been deleted.
            </p>
          </div>
        </div>
      );
    }
  
    return (
      <div className={darkMode ? 'dark' : ''}>
        <Toaster position="top-right" />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-10 space-y-6 lg:space-y-10">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 dark:from-gray-800 dark:via-gray-800 dark:to-gray-700 p-4 sm:p-6 lg:p-8 shadow-2xl border border-white/20 dark:border-gray-600/20 backdrop-blur-sm"
            >
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-6">
                <div className="space-y-3 max-w-full flex-1">
                  <div className="flex items-center gap-3">
                    <Bot className="w-8 h-8 text-orange-600 drop-shadow-md flex-shrink-0" />
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 dark:text-white break-words">
                      {session.title}
                    </h1>
                  </div>
                  <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl">
                    {session.desc}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {session.tag?.split(',').map((tag, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-pink-100 to-purple-100 text-pink-800 dark:from-pink-900/20 dark:to-purple-900/20 dark:text-pink-200 border border-pink-200 dark:border-pink-800/30"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-sm space-y-2 bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200/50 dark:border-gray-600/50 backdrop-blur-sm min-w-fit">
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Experience:</span>
                    <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 rounded-md text-xs font-medium">
                      {session.experience}
                    </span>
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Created:</span> {moment(session.createdAt).format('DD MMM YYYY, hh:mm A')}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 sm:gap-3 mt-6 pt-6 border-t border-white/30 dark:border-gray-600/30">
                <div className="flex flex-wrap gap-2 sm:gap-3 flex-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setImportantOnly(p => !p)}
                    className="bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600 text-xs sm:text-sm"
                  >
                    <Star className="w-4 h-4 mr-1" />
                    {importantOnly ? 'Show All' : 'Important Only'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setExpandedAll(p => !p)}
                    className="bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600 text-xs sm:text-sm"
                  >
                    <ChevronDown className={`w-4 h-4 mr-1 transition-transform ${expandedAll ? 'rotate-180' : ''}`} />
                    {expandedAll ? 'Collapse All' : 'Expand All'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDarkMode(p => !p)}
                    className="bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600 text-xs sm:text-sm"
                  >
                    {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    <span className="hidden sm:inline ml-1">{darkMode ? 'Light' : 'Dark'}</span>
                  </Button>
                </div>
                <div className="flex gap-2 sm:gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportSessionToMarkdown(session)}
                    className="bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs sm:text-sm"
                  >
                    Export
                  </Button>
                  <Button
                    size="sm"
                    onClick={copySessionLink}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg text-xs sm:text-sm"
                  >
                    Share
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Disclaimer Section */}
            <motion.section
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative px-4 sm:px-6 lg:px-8 py-4 sm:py-6 bg-gradient-to-r from-orange-50 via-yellow-50 to-orange-50 dark:from-orange-900/10 dark:via-yellow-900/10 dark:to-orange-900/10 border border-orange-200 dark:border-orange-800/50 rounded-xl shadow-lg backdrop-blur-sm mx-auto max-w-5xl"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                <div className="text-2xl animate-bounce text-orange-600 flex-shrink-0">
                  ⚠️
                </div>
                <div className="flex-1">
                  <h4 className="text-lg sm:text-xl font-bold text-orange-700 dark:text-orange-300 mb-2">
                    AI-Generated Content Disclaimer
                  </h4>
                  <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                    Some answers may be AI-generated. Please review and verify the content before using it in actual interviews.
                    Feel free to regenerate, edit, or customize answers as needed.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* QnA Section */}
            <div className="space-y-4 sm:space-y-6">
              <AnimatePresence>
                {visibleQna.map((qa, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                      <details open={expandedAll} className="group">
                        <summary className="px-4 sm:px-6 py-4 sm:py-5 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 hover:from-orange-50 hover:to-orange-100 dark:hover:from-gray-700 dark:hover:to-gray-600 cursor-pointer transition-all duration-200">
                          <div className="flex items-start sm:items-center justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start gap-2 sm:gap-3">
                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-orange-500 text-white text-sm font-bold flex-shrink-0 mt-0.5 sm:mt-0">
                                  {i + 1}
                                </span>
                                <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base leading-relaxed break-words">
                                  {qa.question}
                                </h3>
                              </div>
                              {importantMap[i] && (
                                <div className="flex items-center gap-1 mt-2 ml-10 sm:ml-11">
                                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                  <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">Important</span>
                                </div>
                              )}
                            </div>
                            <ChevronDown className="group-open:rotate-180 transition-transform duration-200 text-gray-500 dark:text-gray-400 w-5 h-5 flex-shrink-0" />
                          </div>
                        </summary>

                        <CardContent className="px-4 sm:px-6 py-4 sm:py-6">
                          <div className="space-y-4">
                            {/* Answer Content */}
                            <div className="prose prose-sm sm:prose-base max-w-none dark:prose-invert">
                              {formatAnswer(qa.answerParts, editableIndex === i, handleAnswerChange)}
                            </div>

                            {/* Summary Display */}
                            {summaries[i] && (
                              <div
                                className="p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-amber-50 border-l-4 border-yellow-400 dark:from-yellow-900/20 dark:to-amber-900/20 dark:border-yellow-500 shadow-sm animate-in slide-in-from-top-2 duration-300"
                              >
                                <div className="flex items-start gap-2">
                                  <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-white text-xs font-bold">S</span>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 text-sm mb-2">
                                      AI Summary
                                    </h4>
                                    <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                                      {summaries[i]}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                              {/* Primary Actions */}
                              <div className="flex flex-wrap gap-2 flex-1">
                                <Button
                                  onClick={() => regenerateAnswer(qa.question, i)}
                                  size="sm"
                                  variant="secondary"
                                  disabled={regeneratingIndex === i}
                                  className="text-xs sm:text-sm"
                                >
                                  {regeneratingIndex === i ? (
                                    <Loader2 className="w-4 h-4 animate-spin mr-1" />
                                  ) : (
                                    <RefreshCcw className="w-4 h-4 mr-1" />
                                  )}
                                  <span className="hidden sm:inline">Regenerate</span>
                                  <span className="sm:hidden">Regen</span>
                                </Button>

                                <Button
                                  onClick={() => setEditableIndex(editableIndex === i ? null : i)}
                                  size="sm"
                                  variant="outline"
                                  className="text-xs sm:text-sm"
                                >
                                  {editableIndex === i ? 'Done' : 'Edit'}
                                </Button>

                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleSummarize(i)}
                                  disabled={summarizingIndex === i}
                                  className="text-xs sm:text-sm"
                                >
                                  {summarizingIndex === i ? (
                                    <Loader2 className="w-4 h-4 animate-spin mr-1" />
                                  ) : (
                                    <Bot className="w-4 h-4 mr-1" />
                                  )}
                                  <span className="hidden sm:inline">Summary</span>
                                  <span className="sm:hidden">Sum</span>
                                </Button>
                              </div>

                              {/* Secondary Actions */}
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => handlePin(i)}
                                  size="sm"
                                  variant="ghost"
                                  className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-900/20 text-xs sm:text-sm"
                                >
                                  <Pin className="w-4 h-4" />
                                  <span className="hidden sm:inline ml-1">Pin</span>
                                </Button>

                                <Button
                                  onClick={() => toggleImportant(i)}
                                  size="sm"
                                  variant="ghost"
                                  className={`${importantMap[i]
                                    ? 'text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                                    : 'text-gray-500 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                                    } text-xs sm:text-sm`}
                                >
                                  <Star className={`w-4 h-4 ${importantMap[i] ? 'fill-current' : ''}`} />
                                  <span className="hidden sm:inline ml-1">
                                    {importantMap[i] ? 'Unmark' : 'Mark'}
                                  </span>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </details>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Load More & Generate More Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 sm:mt-12">
              {visibleCount < session.qna?.length && (
                <Button
                  onClick={() => setVisibleCount(prev => prev + ITEMS_PER_PAGE)}
                  className="rounded-full px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-gray-800 to-black hover:from-gray-900 hover:to-gray-800 text-white shadow-lg text-sm sm:text-base"
                >
                  Load More Questions
                </Button>
              )}

              <Button
                variant="outline"
                className="gap-2 rounded-full px-6 sm:px-8 py-2 sm:py-3 bg-white dark:bg-gray-800 border-2 border-orange-200 dark:border-orange-800 hover:bg-orange-50 dark:hover:bg-orange-900/20 text-sm sm:text-base"
                onClick={handleGenerateMore}
                disabled={generatingMore}
              >
                {generatingMore ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <PlusCircle className="w-4 h-4" />
                )}
                {generatingMore ? 'Generating...' : 'Generate More Questions'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
};
export default InterviewPrep;