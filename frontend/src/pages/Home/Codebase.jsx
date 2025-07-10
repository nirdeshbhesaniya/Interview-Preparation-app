// src/pages/CodeExecution.jsx
import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { motion } from 'framer-motion';
import { Play, Code, Terminal, Loader2 } from 'lucide-react';
import { API } from '../../utils/apiPaths';
import axios from '../../utils/axiosInstance';

const LANGUAGES = [
    { id: 63, name: 'JavaScript', sample: '// Write your JavaScript code here...' },
    { id: 71, name: 'Python', sample: '# Write your Python code here...' },
    { id: 62, name: 'Java', sample: 'public class Main {\n    public static void main(String[] args) {\n        // Write your Java code here...\n    }\n}' },
    { id: 50, name: 'C', sample: '#include <stdio.h>\n\nint main() {\n    // Write your C code here...\n    return 0;\n}' },
    { id: 54, name: 'C++', sample: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your C++ code here...\n    return 0;\n}' },
    { id: 78, name: 'Kotlin', sample: 'fun main() {\n    // Write your Kotlin code here...\n}' },
];

const CodeExecution = () => {
    const [language, setLanguage] = useState(63);
    const [code, setCode] = useState(LANGUAGES.find(l => l.id === 63).sample);
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [loading, setLoading] = useState(false);

    const runCode = async () => {
        setLoading(true);
        try {
            const res = await axios.post(API.CODE.COMPILE, {
                source_code: code,
                language_id: language,
                stdin: input,
            });
            const result = res.data.stdout || res.data.stderr || 'No output';
            setOutput(result);
        } catch (err) {
            console.error('Error executing code:', err);
            setOutput('Error executing code.');
        }
        setLoading(false);
    };

    const handleLanguageChange = (id) => {
        setLanguage(id);
        const selected = LANGUAGES.find(l => l.id === id);
        setCode(selected?.sample || '');
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 dark:from-zinc-900 dark:to-zinc-900 p-4 sm:p-6 font-[Urbanist] text-zinc-800 dark:text-white"
        >
            <div className="max-w-7xl mx-auto space-y-6">
                <motion.div 
                    variants={itemVariants}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-zinc-800 p-4 sm:p-6 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-700"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                            <Code className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                                Code Execution Platform
                            </h1>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                                Write, test, and execute code in multiple languages
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Terminal className="h-4 w-4 text-zinc-500" />
                        <select
                            className="flex-1 sm:flex-none p-3 rounded-xl bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 font-medium min-w-[140px]"
                            value={language}
                            onChange={(e) => handleLanguageChange(Number(e.target.value))}
                        >
                            {LANGUAGES.map((lang) => (
                                <option key={lang.id} value={lang.id}>{lang.name}</option>
                            ))}
                        </select>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <motion.div 
                        variants={itemVariants}
                        className="xl:col-span-2 bg-white dark:bg-zinc-800 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden"
                    >
                        <div className="p-4 border-b border-zinc-200 dark:border-zinc-700">
                            <div className="flex items-center gap-2">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                </div>
                                <span className="text-sm text-zinc-500 dark:text-zinc-400 ml-2">
                                    {LANGUAGES.find(l => l.id === language)?.name} Editor
                                </span>
                            </div>
                        </div>
                        <div className="h-[400px] sm:h-[500px] bg-[#fefaf6] dark:bg-[#1f1f1f]">
                            <Editor
                                height="100%"
                                language={LANGUAGES.find(l => l.id === language)?.name.toLowerCase()}
                                value={code}
                                theme="vs-dark"
                                onChange={(value) => setCode(value)}
                                options={{
                                    fontSize: 14,
                                    minimap: { enabled: false },
                                    scrollBeyondLastLine: false,
                                    wordWrap: 'on',
                                    lineNumbers: 'on',
                                    folding: true,
                                    bracketPairColorization: { enabled: true },
                                }}
                            />
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-6">
                        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-700 p-4 sm:p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Terminal className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                <h2 className="font-semibold text-lg">Input (stdin)</h2>
                            </div>
                            <textarea
                                className="w-full p-3 border border-zinc-200 dark:border-zinc-600 rounded-xl dark:bg-zinc-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                                placeholder="Enter input data here..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                rows={4}
                            />
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={runCode}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 disabled:from-zinc-400 disabled:to-zinc-500 text-white px-6 py-4 rounded-xl shadow-lg transition-all duration-200 font-semibold flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Running...
                                </>
                            ) : (
                                <>
                                    <Play className="h-5 w-5" />
                                    Execute Code
                                </>
                            )}
                        </motion.button>
                    </motion.div>
                </div>

                <motion.div variants={itemVariants} className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden">
                    <div className="p-4 sm:p-6 border-b border-zinc-200 dark:border-zinc-700">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                <Terminal className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                            <h2 className="font-semibold text-lg">Output</h2>
                        </div>
                    </div>
                    <div className="p-4 sm:p-6">
                        <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-4 min-h-[120px] max-h-[300px] overflow-auto">
                            <pre className="whitespace-pre-wrap text-sm font-mono text-zinc-700 dark:text-zinc-300 leading-relaxed">
                                {output || (
                                    <span className="text-zinc-400 dark:text-zinc-500 italic">
                                        Output will appear here after code execution...
                                    </span>
                                )}
                            </pre>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default CodeExecution;
