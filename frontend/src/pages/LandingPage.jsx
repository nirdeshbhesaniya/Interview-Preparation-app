import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BrainCircuit,
  Bot,
  FileCode,
  Star,
  Users,
  Zap,
  Shield,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Globe,
  Trophy
} from 'lucide-react';

import Header from '../pages/InterviewPrep/components/Header';
import Footer from '../pages/InterviewPrep/components/Footer';
import AuthModal from '../pages/Auth/AuthModel';
import SignUp from '../pages/Auth/SignUp';
import Login from '../pages/Auth/Login';
import ForgotPassword from '../pages/Auth/ForgotPassword';
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
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const testimonialsRef = useRef(null);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);
  const toggleAuth = () => {
    setIsLogin((prev) => !prev);
    setIsForgotPassword(false);
  };

  const showForgotPassword = () => {
    setIsForgotPassword(true);
  };

  const navigateToAuth = (type) => {
    if (type === 'login') {
      setIsLogin(true);
      setIsForgotPassword(false);
    } else if (type === 'register') {
      setIsLogin(false);
      setIsForgotPassword(false);
    }
  };

  const handleGetStarted = () => {
    if (user || localStorage.getItem('user')) {
      navigate('/dashboard');
    } else {
      openModal();
    }
  };

  const handleGoCodebase = () => {
    if (user || localStorage.getItem('user')) {
      navigate('/codebase');
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
    <div className="font-[Urbanist] bg-gradient-to-br from-orange-50 via-white to-blue-50 min-h-screen">
      <Header onLoginClick={openModal} />

      {/* Hero Section with Enhanced Design */}
      <section className="relative text-center min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Video with Overlay */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          >
            <source src="/assets/hero.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-br from-orange-900/40 via-blue-900/30 to-purple-900/40"></div>
        </div>

        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-orange-400/20 rounded-full blur-xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-40 right-20 w-32 h-32 bg-blue-400/20 rounded-full blur-xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 30, 0],
            scale: [1, 0.8, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative z-10 max-w-5xl mx-auto text-white">
          {/* AI Badge with Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-6"
          >
            <span className="inline-flex items-center gap-3 px-6 py-3 text-sm font-medium text-orange-400 border border-orange-300/50 rounded-full bg-white/10 backdrop-blur-lg shadow-lg hover:bg-white/20 transition-all duration-300">
              <BrainCircuit className="w-5 h-5 text-orange-400 animate-pulse" />
              <span className="hidden sm:inline">AI Powered Interview Assistant</span>
              <span className="sm:hidden">AI Powered</span>
              <Sparkles className="w-4 h-4 text-yellow-400" />
            </span>
          </motion.div>

          {/* Hero Title with Staggered Animation */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-4"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white drop-shadow-2xl leading-tight">
              Ace Interviews with{' '}
              <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-yellow-300 to-amber-400 animate-gradient-x">
                AI-Powered
              </span>{' '}
              Learning
            </h1>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex justify-center"
            >
              <div className="flex items-center gap-2 text-yellow-300">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, rotate: -180 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 + i * 0.1 }}
                  >
                    <Star className="w-5 h-5 fill-current" />
                  </motion.div>
                ))}
                <span className="ml-2 text-white/90 text-sm font-medium">
                  Trusted by 10,000+ developers
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Description with Better Typography */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-8 space-y-4"
          >
            <p className="text-lg sm:text-xl lg:text-2xl text-white/90 leading-relaxed max-w-3xl mx-auto">
              Get role-specific questions, expand answers when needed, and dive deeper into concepts with our intelligent AI assistant.
            </p>

            {/* Feature Highlights */}
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              {[
                { icon: CheckCircle, text: "Personalized Questions" },
                { icon: Zap, text: "Instant Feedback" },
                { icon: Trophy, text: "Track Progress" }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
                >
                  <feature.icon className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-white/90">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Enhanced CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group relative w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden"
              onClick={handleGetStarted}
            >
              <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <div className="relative flex items-center gap-2">
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group w-full sm:w-auto px-8 py-4 bg-white/10 text-white border-2 border-white/30 rounded-2xl font-semibold hover:bg-white/20 backdrop-blur-lg transition-all duration-300 shadow-xl hover:shadow-2xl"
              onClick={handleGoCodebase}
            >
              <div className="flex items-center justify-center gap-2">
                <FileCode className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span>Explore Codebase</span>
              </div>
            </motion.button>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {[
              { number: "10K+", label: "Users", icon: Users },
              { number: "50K+", label: "Questions", icon: FileCode },
              { number: "95%", label: "Success Rate", icon: Trophy },
              { number: "24/7", label: "AI Support", icon: Bot }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4 + index * 0.1 }}
                className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-2 text-orange-400" />
                <div className="text-2xl font-bold text-white">{stat.number}</div>
                <div className="text-sm text-white/70">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-white/60 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </section>


      {/* Enhanced Features Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-br from-white via-orange-50/30 to-blue-50/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              App <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">Features</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Discover powerful tools designed to accelerate your interview preparation journey
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {APP_FEATURES.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{
                  y: -10,
                  transition: { duration: 0.3 }
                }}
                className="group relative bg-white p-8 rounded-2xl border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden"
              >
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Feature Number Badge */}
                <div className="relative z-10 mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold text-lg shadow-lg">
                    {feature.id}
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {feature.description}
                  </p>

                  {/* Learn More Link */}
                  <div className="flex items-center text-orange-500 font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0">
                    <span className="text-sm">Learn more</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Decorative Element */}
                <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-orange-200/20 to-blue-200/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
            ))}
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-center mt-16"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetStarted}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              <span>Start Your Journey</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              What <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">Users Say</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of developers who have transformed their interview skills
            </p>

            {/* Rating Display */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>
              <div className="text-gray-600">
                <span className="font-bold text-2xl text-gray-900">4.9</span> out of 5
              </div>
              <div className="hidden sm:block text-gray-500">
                Based on 1,000+ reviews
              </div>
            </div>
          </motion.div>

          {/* Enhanced Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {testimonials.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-8 border border-gray-100 overflow-hidden"
              >
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Quote Icon */}
                <div className="relative z-10 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                    "
                  </div>
                </div>

                {/* Testimonial Content */}
                <div className="relative z-10">
                  <p className="text-gray-700 text-lg leading-relaxed mb-6 italic">
                    "{item.feedback}"
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>

                  {/* User Info */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={item.avatar}
                        className="w-14 h-14 rounded-full object-cover border-2 border-orange-200"
                        alt={item.name}
                      />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">{item.name}</h4>
                      <p className="text-orange-600 font-medium">{item.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Scrolling Testimonials for Mobile */}
          <div className="block lg:hidden">
            <div
              ref={testimonialsRef}
              className="flex overflow-x-auto snap-x snap-mandatory space-x-6 pb-4 scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {testimonials.map((item, index) => (
                <motion.div
                  key={`mobile-${item.id}`}
                  className="snap-start flex-shrink-0 w-[85vw] sm:w-[70vw] max-w-sm bg-white rounded-xl shadow-lg p-6"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={item.avatar}
                      className="w-12 h-12 rounded-full object-cover"
                      alt={item.name}
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.name}</h4>
                      <p className="text-sm text-orange-600">{item.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">"{item.feedback}"</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-gray-200"
          >
            {[
              { icon: Users, label: "Active Users", value: "10,000+" },
              { icon: Globe, label: "Countries", value: "50+" },
              { icon: Trophy, label: "Success Rate", value: "95%" },
              { icon: Shield, label: "Uptime", value: "99.9%" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl mb-4 shadow-lg">
                  <stat.icon className="w-8 h-8" />
                </div>
                <div className="font-bold text-2xl text-gray-900">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>


      {/* Enhanced Why Choose Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">InterviewPrep AI?</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of interview preparation with our cutting-edge AI technology
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                title: 'Tailored Q&A',
                text: 'Generate interview questions specific to your role and experience level, powered by advanced AI that understands industry trends and requirements.',
                icon: BrainCircuit,
                color: 'from-orange-500 to-red-500'
              },
              {
                title: 'Interactive Practice',
                text: 'Expand, edit, and regenerate answers. Practice like it\'s a real interview, with flexibility and depth that adapts to your learning style.',
                icon: Zap,
                color: 'from-blue-500 to-purple-500'
              },
              {
                title: 'Session History',
                text: 'Save and revisit your past Q&A sessions. Export them as PDFs or markdown files for future reference and continuous improvement.',
                icon: Shield,
                color: 'from-green-500 to-teal-500'
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                whileHover={{
                  y: -10,
                  transition: { duration: 0.3 }
                }}
                className="group relative bg-gradient-to-br from-white to-gray-50 border border-gray-100 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden"
              >
                {/* Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-200/20 to-blue-200/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-x-16 -translate-y-16" />

                {/* Icon */}
                <div className="relative z-10 mb-6">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${item.color} text-white rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className="w-8 h-8" />
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {item.text}
                  </p>
                </div>

                {/* Decorative Elements */}
                <div className="absolute bottom-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                  <item.icon className="w-24 h-24 text-gray-400" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Additional Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { label: "AI-Powered", icon: Bot },
              { label: "Real-time Feedback", icon: Zap },
              { label: "Secure & Private", icon: Shield },
              { label: "24/7 Available", icon: Globe }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                className="text-center p-6 bg-gradient-to-br from-orange-50 to-blue-50 rounded-2xl"
              >
                <benefit.icon className="w-12 h-12 mx-auto mb-3 text-orange-600" />
                <div className="font-semibold text-gray-900">{benefit.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Enhanced FAQ Section */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">Questions</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Everything you need to know about InterviewPrep AI
            </p>
          </motion.div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <details className="group bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <summary className="flex items-center justify-between font-bold text-lg text-gray-900 cursor-pointer list-none">
                    <span className="pr-4">{faq.question}</span>
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white transform group-open:rotate-45 transition-transform duration-300">
                        <span className="text-xl leading-none">+</span>
                      </div>
                    </div>
                  </summary>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                </details>
              </motion.div>
            ))}
          </div>

          {/* Contact Support */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-center mt-16 p-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl text-white"
          >
            <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
            <p className="text-orange-100 mb-6">
              Our support team is here to help you get the most out of InterviewPrep AI
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-white text-orange-600 rounded-xl font-semibold hover:bg-gray-50 transition-colors shadow-lg"
            >
              Contact Support
            </motion.button>
          </motion.div>
        </div>
      </section>

      <AuthModal show={showModal} onClose={closeModal}>
        {isForgotPassword ? (
          <ForgotPassword onSwitch={toggleAuth} onNavigate={navigateToAuth} />
        ) : isLogin ? (
          <Login onSwitch={toggleAuth} onForgotPassword={showForgotPassword} />
        ) : (
          <SignUp onSwitch={toggleAuth} />
        )}
      </AuthModal>

      <Footer />
    </div>
  );
};

export default LandingPage;