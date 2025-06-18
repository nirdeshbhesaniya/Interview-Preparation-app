import React, { useState } from 'react';
import axios from '../../utils/axiosInstance';
import { API } from '../../utils/apiPaths';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const CreateCardModal = ({ onClose, onCreated }) => {
  const [form, setForm] = useState({
    title: '',
    tag: '',
    initials: '',
    experience: '',
    desc: '',
    color: 'from-green-100 to-green-50',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(API.INTERVIEW.CREATE, form);
      toast.success('🎉 Card created successfully!');
      onCreated(res.data.sessionId);
    } catch (err) {
      toast.error(err?.response?.data?.message || '❌ Failed to create card');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md transition-all duration-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
        exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
      >
        <motion.form
          onSubmit={handleSubmit}
          className="bg-white px-6 py-8 rounded-2xl w-full max-w-md shadow-2xl relative"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-4 text-gray-400 hover:text-black text-xl"
          >
            ×
          </button>

          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Interview Prep Card</h2>

          <div className="space-y-4">
            <input
              name="title"
              type="text"
              placeholder="Title (e.g., Frontend Developer)"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
            <input
              name="tag"
              type="text"
              placeholder="Tags (e.g., React, JS)"
              value={form.tag}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
            <input
              name="initials"
              type="text"
              placeholder="Initials (e.g., FE)"
              value={form.initials}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
            <input
              name="experience"
              type="text"
              placeholder="Experience (e.g., 2 Years)"
              value={form.experience}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
            <textarea
              name="desc"
              placeholder="Describe your interview preparation goal..."
              value={form.desc}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:outline-none resize-none"
            ></textarea>
          </div>

          <motion.button
            type="submit"
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            className={`mt-6 w-full flex items-center justify-center gap-2 py-2 rounded-md font-semibold transition ${
              loading
                ? 'bg-orange-300 cursor-not-allowed'
                : 'bg-orange-500 text-white hover:bg-orange-600'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Card'
            )}
          </motion.button>
        </motion.form>
      </motion.div>
    </AnimatePresence>
  );
};

export default CreateCardModal;
