import React from 'react';
import { Bot, Twitter, Linkedin, Github, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const socialLinks = [
  {
    icon: <Linkedin className="w-5 h-5" />,
    link: 'https://www.linkedin.com/in/nirdesh-bhesaniya-387b67284/',
    label: 'LinkedIn'
  },
  {
    icon: <Github className="w-5 h-5" />,
    link: 'https://github.com/nirdeshbhesaniya',
    label: 'GitHub'
  },
  {
    icon: <Twitter className="w-5 h-5" />,
    link: 'https://x.com/Nirdesh_12',
    label: 'Twitter'
  },
  {
    icon: <Globe className="w-5 h-5" />,
    link: 'https://nirdesh-portfolio.netlify.app/',
    label: 'Portfolio'
  }
];

const Footer = () => {
  return (
    <footer className="bg-[#fff3e1] border-t border-orange-100">
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-full">
            <Bot className="text-orange-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Interview <span className="text-orange-300">AI</span></h1>
            <p className="text-sm text-gray-500">Smarter way to prepare</p>
          </div>
        </div>

        {/* Social Media */}
        <div className="flex gap-4">
          {socialLinks.map((item, index) => (
            <motion.a
              key={index}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2, rotate: 5 }}
              className="text-orange-500 hover:text-orange-600 transition-colors"
              title={item.label}
            >
              <div className="p-2 bg-white rounded-full shadow hover:shadow-md">
                {item.icon}
              </div>
            </motion.a>
          ))}
        </div>
      </div>

      <div className="text-center py-6 text-sm text-gray-500 border-t border-orange-100">
        © {new Date().getFullYear()} InterviewPrep AI. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
