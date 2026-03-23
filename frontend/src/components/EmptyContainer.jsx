import { MessageCircle, Users } from 'lucide-react';
import { motion } from 'motion/react';

const EmptyContainer = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-orange-50 via-white to-blue-50 p-8"
    >
      <div className="max-w-md mx-auto text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
          className="relative mb-8"
        >
          <div className="w-32 h-32 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <MessageCircle className="text-orange-500" size={64} strokeWidth={1.5} />
          </div>
          <motion.div
            animate={{ y: [-10, 10, -10], x: [-5, 5, -5] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-4 -right-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shadow-md"
          >
            <Users className="text-blue-500" size={24} />
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Welcome to Messages! 👋</h3>
          <p className="text-gray-600 mb-6">Select a conversation from the sidebar to start chatting</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3 text-left bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          {[
            { emoji: '💬', title: 'Real-time messaging', sub: 'Send and receive messages instantly' },
            { emoji: '📸', title: 'Share images', sub: 'Send photos with your messages' },
            { emoji: '🔒', title: 'Secure & private', sub: 'Your conversations are safe with us' },
          ].map(({ emoji, title, sub }) => (
            <div key={title} className="flex items-start gap-3">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-lg">{emoji}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">{title}</p>
                <p className="text-xs text-gray-500">{sub}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EmptyContainer;
