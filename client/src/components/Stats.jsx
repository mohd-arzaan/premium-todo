import { ListTodo, CheckCircle, Clock } from 'lucide-react';

const Stats = ({ tasks }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.isCompleted).length;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      
      {/* Total Tasks */}
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">Total Tasks</p>
          <h3 className="text-2xl font-bold text-white mt-1">{totalTasks}</h3>
        </div>
        <div className="p-3 bg-blue-500/20 rounded-full">
          <ListTodo className="w-6 h-6 text-blue-500" />
        </div>
      </div>

      {/* Completed Tasks */}
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">Completed</p>
          <h3 className="text-2xl font-bold text-white mt-1">{completedTasks}</h3>
        </div>
        <div className="p-3 bg-green-500/20 rounded-full">
          <CheckCircle className="w-6 h-6 text-green-500" />
        </div>
      </div>

      {/* Pending Tasks */}
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">Pending</p>
          <h3 className="text-2xl font-bold text-white mt-1">{pendingTasks}</h3>
        </div>
        <div className="p-3 bg-yellow-500/20 rounded-full">
          <Clock className="w-6 h-6 text-yellow-500" />
        </div>
      </div>

    </div>
  );
};

export default Stats;