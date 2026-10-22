import { ListTodo, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const Stats = ({ tasks }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.isCompleted).length;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl p-5 rounded-3xl border border-white/70 dark:border-gray-700 shadow-sm flex items-center justify-between transition-colors">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total</p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{totalTasks}</h3>
        </div>
        <div className="p-3 bg-orange-100/80 dark:bg-orange-500/20 rounded-2xl transition-colors">
          <ListTodo className="w-6 h-6 text-orange-500 dark:text-orange-400" />
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl p-5 rounded-3xl border border-white/70 dark:border-gray-700 shadow-sm flex items-center justify-between transition-colors">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Done</p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{completedTasks}</h3>
        </div>
        <div className="p-3 bg-green-100/80 dark:bg-green-500/20 rounded-2xl transition-colors">
          <CheckCircle className="w-6 h-6 text-green-500 dark:text-green-400" />
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl p-5 rounded-3xl border border-white/70 dark:border-gray-700 shadow-sm flex items-center justify-between transition-colors">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Pending</p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{pendingTasks}</h3>
        </div>
        <div className="p-3 bg-gray-200/80 dark:bg-gray-700/50 rounded-2xl transition-colors">
          <Clock className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </div>
      </motion.div>
    </div>
  );
};
export default Stats;