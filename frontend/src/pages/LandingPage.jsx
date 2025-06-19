import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BrainCircuit, Bot } from 'lucide-react';

import Header from '../pages/InterviewPrep/components/Header';
import Footer from '../pages/InterviewPrep/components/Footer';
import AuthModal from '../pages/Auth/AuthModel';
import SignUp from '../pages/Auth/SignUp';
import Login from '../pages/Auth/Login';
import { APP_FEATURES } from '../utils/data';
import { UserContext } from '../context/UserContext.jsx';

const testimonials = [
  {
    id: 1,
    name: 'Aman Gupta',
    role: 'Frontend Engineer',
    feedback: 'This AI helped me crack my dream job. The custom Q&A and intuitive UI made practice seamless!',
    avatar: 'https://i.pravatar.cc/40?img=5'
  },
  {
    id: 2,
    name: 'Sneha Roy',
    role: 'Backend Developer',
    feedback: 'Highly impressed with the interview-specific questions. The AI-generated answers were detailed and helpful.',
    avatar: 'https://i.pravatar.cc/40?img=7'
  },
  {
    id: 3,
    name: 'Rahul Kumar',
    role: 'DevOps Engineer',
    feedback: 'Loved the session saving and export feature. Feels like a smart AI journal for interviews.',
    avatar: 'https://i.pravatar.cc/40?img=9'
  }
];

const faqs = [
  {
    question: 'What is InterviewPrep AI?',
    answer: 'InterviewPrep AI is an intelligent platform that helps you prepare for interviews using AI-generated questions and answers tailored to your role.'
  },
  {
    question: 'Can I customize my interview topics?',
    answer: 'Yes, you can select your domain, and the system will generate questions specific to your selection.'
  },
  {
    question: 'Is it free to use?',
    answer: 'We offer a free tier with basic features. Premium features will be added soon.'
  }
];

const LandingPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const testimonialsRef = useRef(null);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);
  const toggleAuth = () => setIsLogin((prev) => !prev);

  const handleGetStarted = () => {
    if (user || localStorage.getItem('user')) {
      navigate('/dashboard');
    } else {
      openModal();
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (testimonialsRef.current) {
        testimonialsRef.current.scrollBy({ left: 320, behavior: 'smooth' });
        if (
          testimonialsRef.current.scrollLeft + testimonialsRef.current.clientWidth >=
          testimonialsRef.current.scrollWidth
        ) {
          testimonialsRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        }
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="flex flex-col items-center gap-6">
          <div className="flex space-x-3">
            <div className="w-5 h-5 rounded-full bg-orange-500 animate-ping [animation-delay:-0.30s]"></div>
            <div className="w-5 h-5 rounded-full bg-orange-500 animate-ping [animation-delay:-0.35s]"></div>
            <div className="w-5 h-5 rounded-full bg-orange-500 animate-ping"></div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 animate-pulse">
              <Bot className="w-7 h-7 text-orange-600 drop-shadow-md" />
              <h1 className="text-xl md:text-2xl font-bold text-orange-600 tracking-wide">
                Interview AI
              </h1>
            </div>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mt-2 animate-fade-in-slow">
              Setting up your landing page, hold tight...
            </p>
          </div>
          <div className="w-48 h-2 bg-orange-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 animate-loading-bar rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-[Urbanist] bg-[#fff7ee] min-h-screen">
      <Header onLoginClick={openModal} />

      <section className="relative text-center min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover z-0 opacity-40">
          <source src="/assets/hero.mp4" type="video/mp4" />
        </video>
        <div className="relative z-10 max-w-2xl text-white">
          <span className="inline-flex items-center gap-2 mb-3 px-4 py-1 text-sm font-medium text-orange-500 border border-orange-300 rounded-full bg-white/20 backdrop-blur-md shadow-md">
            <BrainCircuit className="w-4 h-4 text-orange-500" /> AI Powered
          </span>
          <motion.h2 initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
            Ace Interviews with <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300">AI-Powered</span> Learning
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-6 text-lg text-white/90 leading-relaxed">
            Get role-specific questions, expand answers when needed, dive deeper into concepts.
          </motion.p>
          <motion.button whileHover={{ scale: 1.05 }} className="mt-8 px-8 py-3 bg-orange-500 text-white rounded-full font-medium hover:bg-orange-600 transition shadow-lg" onClick={handleGetStarted}>
            Get Started
          </motion.button>
        </div>
      </section>

      <section className="px-4 md:px-12 py-20 bg-[#fffefc]">
        <h3 className="text-4xl font-bold text-center text-gray-900 mb-10">App Features</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {APP_FEATURES.map((feature) => (
            <motion.div key={feature.id} className="group bg-white p-6 rounded-xl border border-orange-100 shadow-sm hover:shadow-lg transition duration-300 hover:-translate-y-1" whileHover={{ scale: 1.02 }}>
              <div className="mb-3">
                <span className="text-orange-500 text-sm font-bold">{feature.id}</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 group-hover:text-orange-500">{feature.title}</h4>
              <p className="text-sm text-gray-600 mt-2">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-20 bg-[#fff3e1]">
        <h3 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-10">
          What Users Say
        </h3>

        <div
          ref={testimonialsRef}
          className="flex overflow-x-auto snap-x snap-mandatory space-x-6 px-4 md:px-12 scrollbar-hide"
        >
          {testimonials.map((item, index) => (
            <motion.div
              key={item.id}
              className="snap-start flex-shrink-0 w-[90%] sm:w-[70%] md:w-[45%] lg:w-[30%] max-w-sm bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition transform"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={item.avatar}
                  className="w-10 h-10 rounded-full object-cover"
                  alt={item.name}
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{item.name}</h4>
                  <p className="text-sm text-gray-500">{item.role}</p>
                </div>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">"{item.feedback}"</p>
            </motion.div>
          ))}
        </div>
      </section>


      <section className="px-4 py-20 bg-[#fffefc]">
        <h3 className="text-4xl font-bold text-center text-gray-900 mb-10">Why Choose InterviewPrep AI?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              title: 'Tailored Q&A',
              text: 'Generate interview questions specific to your role and experience level, powered by advanced AI.'
            },
            {
              title: 'Interactive Practice',
              text: 'Expand, edit, and regenerate answers. Practice like it\'s a real interview, with flexibility and depth.'
            },
            {
              title: 'Session History',
              text: 'Save and revisit your past Q&A sessions. Export them as PDFs or markdown files for future reference.'
            }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="bg-white border border-orange-100 p-6 rounded-xl shadow-sm hover:shadow-md transition"
            >
              <h4 className="text-lg font-semibold text-orange-500 mb-2">{item.title}</h4>
              <p className="text-sm text-gray-700">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-white py-20 px-4 md:px-12">
        <h3 className="text-4xl font-bold text-center text-gray-900 mb-10">Frequently Asked Questions</h3>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <details key={index} className="bg-[#fffaf0] p-4 rounded-md shadow-sm open:ring-2 open:ring-orange-500">
              <summary className="font-semibold cursor-pointer text-gray-900">{faq.question}</summary>
              <p className="mt-2 text-sm text-gray-700">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <AuthModal show={showModal} onClose={closeModal}>
        {isLogin ? <Login onSwitch={toggleAuth} /> : <SignUp onSwitch={toggleAuth} />}
      </AuthModal>

      <Footer />
    </div>
  );
};

export default LandingPage;