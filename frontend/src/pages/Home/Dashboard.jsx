import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Trash2, Bot, Search } from 'lucide-react';
import CreateCardModal from '../../components/Cards/CreateCardForm';
import axios from '../../utils/axiosInstance';
import { API } from '../../utils/apiPaths';
import { Badge } from '@/components/ui/badge';
import emptyStateImg from '../../assets/empty-state.jpg';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';

export const Dashboard = () => {
  const [cards, setCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const navigate = useNavigate();

  const userEmail = JSON.parse(localStorage.getItem("user"))?.email;

  const gradients = [
    'from-[#fde2e4] to-[#fad2e1]',
    'from-[#e0f7fa] to-[#a5dee5]',
    'from-[#e0bbE4] to-[#957DAD]',
    'from-[#c8e6c9] to-[#a5d6a7]',
    'from-[#fff3cd] to-[#ffe8a1]',
    'from-[#d7f9f1] to-[#b2f0e6]'
  ];

  const badgeColors = [
    'bg-orange-100 text-orange-800',
    'bg-green-100 text-green-800',
    'bg-blue-100 text-blue-800',
    'bg-purple-100 text-purple-800',
    'bg-pink-100 text-pink-800',
    'bg-yellow-100 text-yellow-800'
  ];

  const fetchCards = async () => {
    try {
      setLoading(true);
      await new Promise((res) => setTimeout(res, 1000));
      const res = await axios.get(API.INTERVIEW.GET_ALL);
      setCards(res.data);
      setFilteredCards(res.data);
    } catch (err) {
      console.error('Failed to load cards', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleCreated = (sessionId) => {
    navigate(`/interview-prep/${sessionId}`);
  };

  const handleDeleteClick = (sessionId) => {
    setSelectedCardId(sessionId);
    setConfirmModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(API.INTERVIEW.DELETE(selectedCardId));
      toast.success("Card deleted successfully");
      setConfirmModal(false);
      setSelectedCardId(null);
      fetchCards();
    } catch {
      toast.error("Failed to delete card");
    }
  };

  // Debounced Search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const filtered = cards.filter((card) => {
        const combinedText = `${card.title} ${card.desc} ${card.tag}`.toLowerCase();
        return combinedText.includes(searchTerm.toLowerCase());
      });
      setFilteredCards(filtered);
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, cards]);

  return (
    <div className="p-6 font-[Urbanist] min-h-screen bg-white dark:bg-zinc-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold text-zinc-800 dark:text-white">Interview AI</h2>
        <div className="flex items-center gap-2 w-full sm:w-1/2">
          <Search size={20} className="absolute ml-3 text-zinc-400" />
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, tag, or description"
            className="w-full pl-10 pr-4 py-2 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm"
          />
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-full shadow hover:bg-orange-600 transition"
        >
          <PlusCircle size={20} /> Add New
        </button>
      </div>

      {/* Loader */}
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
          <div className="flex flex-col items-center gap-6">
            <div className="flex space-x-3">
              <div className="w-5 h-5 rounded-full bg-orange-500 animate-ping [animation-delay:-0.30s]"></div>
              <div className="w-5 h-5 rounded-full bg-orange-500 animate-ping [animation-delay:-0.35s]"></div>
              <div className="w-5 h-5 rounded-full bg-orange-500 animate-ping"></div>
            </div>
            <div className="flex items-center justify-center gap-2 animate-pulse">
              <Bot className="w-7 h-7 text-orange-600 drop-shadow-md" />
              <h1 className="text-xl md:text-2xl font-bold text-orange-600 tracking-wide">Interview AI</h1>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Setting up your smart dashboard, hold tight...</p>
          </div>
        </div>
      ) : filteredCards.length === 0 ? (
        <motion.div
          className="flex flex-col items-center justify-center h-[60vh] text-center text-zinc-600 dark:text-zinc-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <img src={emptyStateImg} alt="No Cards" className="w-64 h-64 mb-4 animate-pulse" />
          <h3 className="text-xl font-semibold">No Interview Cards Found</h3>
          <p className="text-sm">Try a different search or create a new one.</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCards.map((card, index) => {
            const gradient = gradients[index % gradients.length];
            const showDelete = card.creatorEmail === userEmail;

            return (
              <motion.div
                key={card.sessionId}
                onClick={() => navigate(`/interview-prep/${card.sessionId}`)}
                className={`relative group rounded-xl p-5 shadow-md cursor-pointer bg-gradient-to-br ${gradient} transition hover:shadow-xl`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="w-10 h-10 bg-white text-green-700 font-bold rounded-full flex items-center justify-center shadow">
                    {card.initials || "??"}
                  </div>
                  <div className="flex gap-1 flex-wrap justify-end">
                    {(card.tag || '')
                      .split(',')
                      .filter(tag => tag.trim())
                      .map((tag, i) => (
                        <Badge
                          key={i}
                          className={`${badgeColors[i % badgeColors.length]} text-xs px-2 py-0.5 rounded-full`}
                        >
                          {tag.trim()}
                        </Badge>
                      ))}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">
                  {card.title || "Untitled"}
                </h3>
                <p className="text-sm text-zinc-800 dark:text-zinc-300 mb-4 line-clamp-3">
                  {card.desc || "No description provided."}
                </p>
                <div className="flex justify-between text-xs text-zinc-700 dark:text-zinc-400">
                  <span>Exp: {card.experience || "N/A"}</span>
                  <span>{card.qna?.length || 0} Q&A</span>
                  <span>{new Date(card.updatedAt).toLocaleDateString('en-GB')}</span>
                </div>

                {showDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(card.sessionId);
                    }}
                    className="absolute top-2 right-2 bg-white dark:bg-zinc-800 rounded-full p-1.5 text-red-500 shadow hover:text-red-700 opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {modalOpen && (
        <CreateCardModal
          onClose={() => setModalOpen(false)}
          onCreated={handleCreated}
        />
      )}

      {/* Animated Delete Confirmation Popup */}
      <AnimatePresence>
        {confirmModal && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-xl max-w-sm w-full"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-lg font-bold mb-2 text-orange-600">Confirm Delete</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Are you sure you want to delete this interview card? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfirmModal(false)}
                  className="text-sm text-gray-600 hover:text-orange-700 hover:underline"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-1.5 rounded-2xl shadow text-sm"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
