import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LogOut, Trash2, Circle, CheckCircle, Edit, CalendarDays } from 'lucide-react'; // CalendarDays import kiya
import { motion, AnimatePresence } from 'framer-motion';
import { logout } from '../features/authSlice';
import { getTasks, deleteTask, updateTask, reset } from '../features/taskSlice';
import TaskForm from '../components/TaskForm';
import TaskFilters from '../components/TaskFilters';
import Stats from '../components/Stats';
import EditTaskModal from '../components/EditTaskModal';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { tasks, isLoading, isError, message } = useSelector((state) => state.task);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('Newest');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isError) console.log(message);
    if (!user) navigate('/login');
    else dispatch(getTasks());
    return () => { dispatch(reset()); };
  }, [user, navigate, isError, message, dispatch]);

  const onLogout = () => { dispatch(logout()); navigate('/login'); };
  const toggleComplete = (task) => dispatch(updateTask({ id: task._id, isCompleted: !task.isCompleted }));

  const openEditModal = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  let processedTasks = [...tasks];
  if (search) processedTasks = processedTasks.filter((t) => t.title.toLowerCase().includes(search.toLowerCase()) || (t.description && t.description.toLowerCase().includes(search.toLowerCase())));
  if (filter === 'Active') processedTasks = processedTasks.filter((t) => !t.isCompleted);
  else if (filter === 'Completed') processedTasks = processedTasks.filter((t) => t.isCompleted);
  else if (filter === 'High') processedTasks = processedTasks.filter((t) => t.priority === 'High');
  if (sort === 'Newest') processedTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  else if (sort === 'Oldest') processedTasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  else if (sort === 'A-Z') processedTasks.sort((a, b) => a.title.localeCompare(b.title));

  if (isLoading) return <div className="text-gray-900 text-center mt-20 font-bold">Loading...</div>;

  return (
    <div className="min-h-screen flex items-start justify-center py-8 px-4 bg-transparent overflow-y-auto">
      <div className="w-full max-w-md pb-20">
        
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">My Tasks</h1>
            <p className="text-gray-600 text-sm font-medium">Hello, {user?.name}</p>
          </div>
          <button onClick={onLogout} className="p-2.5 bg-white/40 backdrop-blur-md rounded-full text-red-500 shadow-sm border border-white/60 hover:bg-white/60 transition">
            <LogOut className="w-5 h-5" />
          </button>
        </motion.div>

        <Stats tasks={tasks} />
        <TaskForm />
        <TaskFilters search={search} setSearch={setSearch} filter={filter} setFilter={setFilter} sort={sort} setSort={setSort} />

        <div className="space-y-3 mt-4">
          <AnimatePresence>
            {processedTasks.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/30 backdrop-blur-xl p-8 rounded-3xl border border-white/60 shadow-sm text-center">
                <p className="text-gray-600 font-medium">No tasks found.</p>
              </motion.div>
            ) : (
              processedTasks.map((task) => (
                <motion.div key={task._id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, x: -20 }} 
                  className="bg-white/40 backdrop-blur-2xl p-4 rounded-3xl border border-white/70 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex items-center justify-between hover:bg-white/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <button onClick={() => toggleComplete(task)} className="shrink-0">
                      {task.isCompleted ? <CheckCircle className="w-6 h-6 text-green-500" /> : <Circle className="w-6 h-6 text-gray-400 hover:text-orange-500 transition-colors" />}
                    </button>
                    <div>
                      <h3 className={`text-base font-bold ${task.isCompleted ? 'line-through text-gray-400' : 'text-gray-900'}`}>{task.title}</h3>
                      {task.description && <p className="text-gray-500 text-xs mt-0.5">{task.description}</p>}
                      
                      <div className="flex gap-2 mt-2 items-center flex-wrap">
                        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md ${
                          task.priority === 'High' ? 'bg-red-100/80 text-red-700' :
                          task.priority === 'Medium' ? 'bg-orange-100/80 text-orange-700' :
                          'bg-green-100/80 text-green-700'
                        }`}>{task.priority}</span>
                        
                        <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 bg-gray-200/60 text-gray-700 rounded-md">{task.category}</span>
                        
                        {/* Due Date Badge */}
                        {task.dueDate && (
                          <span className="text-[10px] font-bold px-2 py-1 bg-blue-100/80 text-blue-700 rounded-md flex items-center gap-1">
                            <CalendarDays className="w-3 h-3" />
                            {new Date(task.dueDate).toLocaleDateString('en-GB')}
                          </span>
                        )}
                      </div>

                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEditModal(task)} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50/50 rounded-xl transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => dispatch(deleteTask(task._id))} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50/50 rounded-xl transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      <EditTaskModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} task={selectedTask} />
      
    </div>
  );
};
export default Dashboard;