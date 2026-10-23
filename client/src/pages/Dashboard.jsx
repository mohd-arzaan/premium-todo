import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LogOut, Trash2, Circle, CheckCircle2, Pencil, CalendarDays, ClipboardList, SearchX, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { logout } from '../features/authSlice';
import { getTasks, deleteTask, updateTask, reset } from '../features/taskSlice';
import { toggleTheme } from '../features/uiSlice';
import TaskForm from '../components/TaskForm';
import TaskFilters from '../components/TaskFilters';
import Stats from '../components/Stats';
import EditTaskModal from '../components/EditTaskModal';

/* ---------- helpers ---------- */
const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const startOfDay = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

const getDueInfo = (dueDate, isCompleted) => {
  const due = startOfDay(dueDate);
  const today = startOfDay(new Date());
  const diffDays = Math.round((due - today) / 86400000);
  const dateText = due.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

  if (isCompleted) return { label: dateText, style: 'bg-gray-100/80 text-gray-400 dark:bg-gray-800 dark:text-gray-500' };
  if (diffDays < 0) return { label: `Overdue · ${dateText}`, style: 'bg-red-100/80 text-red-700 dark:bg-red-900/40 dark:text-red-400' };
  if (diffDays === 0) return { label: 'Today', style: 'bg-orange-100/80 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400' };
  if (diffDays === 1) return { label: 'Tomorrow', style: 'bg-blue-100/80 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' };
  return { label: dateText, style: 'bg-blue-100/80 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' };
};

const priorityStyles = {
  High: { bar: 'bg-red-400', dot: 'bg-red-500', text: 'text-red-700' },
  Medium: { bar: 'bg-orange-400', dot: 'bg-orange-500', text: 'text-orange-700' },
  Low: { bar: 'bg-green-400', dot: 'bg-green-500', text: 'text-green-700' },
};

const SkeletonCard = () => (
  <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-2xl p-4 rounded-3xl border border-white/70 dark:border-gray-700 flex items-center gap-3 animate-pulse">
    <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700" />
    <div className="flex-1 space-y-2">
      <div className="h-3.5 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />
      <div className="h-3 w-1/3 rounded bg-gray-200/70 dark:bg-gray-700/50" />
    </div>
  </div>
);

/* ---------- component ---------- */
const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { tasks, isLoading, isError, message } = useSelector((state) => state.task);
  const { isDarkMode } = useSelector((state) => state.ui);
  
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

  const pendingCount = tasks.filter((t) => !t.isCompleted).length;
  const hasNoTasksAtAll = tasks.length === 0;
  const initial = user?.name?.charAt(0)?.toUpperCase() || '?';

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-start justify-center py-8 px-4">
        <div className="w-full max-w-6xl space-y-3">
          <div className="h-12 w-1/4 rounded-2xl bg-white/40 dark:bg-gray-800/40 animate-pulse mb-6" />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-start justify-center py-8 px-4 md:px-8 bg-transparent overflow-y-auto transition-colors duration-300">
      {/* Desktop container width */}
      <div className="w-full max-w-6xl pb-20">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center text-2xl font-extrabold shadow-lg shadow-orange-500/30">
              {initial}
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium transition-colors">{getGreeting()}</p>
              <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white leading-tight transition-colors">{user?.name}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => dispatch(toggleTheme())} className="p-3 bg-white/40 dark:bg-gray-800/60 backdrop-blur-md rounded-full text-gray-700 dark:text-yellow-400 shadow-sm border border-white/60 dark:border-gray-700 hover:bg-white/60 dark:hover:bg-gray-700 transition">
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button onClick={onLogout} className="p-3 bg-white/40 dark:bg-gray-800/60 backdrop-blur-md rounded-full text-gray-500 dark:text-gray-400 shadow-sm border border-white/60 dark:border-gray-700 hover:bg-red-50/70 dark:hover:bg-red-500/20 hover:text-red-500 transition">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Stats - Grid layout for desktop */}
        <Stats tasks={tasks} />

        {/* Desktop Grid Layout: Left Form, Right Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
          
          {/* Left Column: Form (Takes 4/12 space) */}
          <div className="lg:col-span-4">
            <div className="sticky top-8">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Create Task</h2>
              <TaskForm />
            </div>
          </div>

          {/* Right Column: Filters + Tasks (Takes 8/12 space) */}
          <div className="lg:col-span-8">
            <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl p-6 rounded-3xl border border-white/70 dark:border-gray-700">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-0">Your Tasks</h2>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-gray-700/50 px-3 py-1 rounded-lg">
                  {pendingCount} pending · {processedTasks.length} shown
                </span>
              </div>

              <TaskFilters search={search} setSearch={setSearch} filter={filter} setFilter={setFilter} sort={sort} setSort={setSort} />

              <div className="space-y-3 mt-6">
                <AnimatePresence mode="popLayout">
                  {processedTasks.length === 0 ? (
                    <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl py-12 px-6 rounded-3xl border border-dashed border-gray-300/80 dark:border-gray-700 text-center transition-colors">
                      <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-white/60 dark:bg-gray-800/60 flex items-center justify-center text-gray-400 dark:text-gray-500">
                        {hasNoTasksAtAll ? <ClipboardList className="w-7 h-7" /> : <SearchX className="w-7 h-7" />}
                      </div>
                      <p className="text-gray-800 dark:text-gray-200 font-bold text-lg">
                        {hasNoTasksAtAll ? 'No tasks yet' : 'No matching tasks'}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                        {hasNoTasksAtAll ? 'Add your first task using the form.' : 'Try changing your search or filters.'}
                      </p>
                    </motion.div>
                  ) : (
                    processedTasks.map((task) => {
                      const p = priorityStyles[task.priority] || priorityStyles.Low;
                      const due = task.dueDate ? getDueInfo(task.dueDate, task.isCompleted) : null;

                      return (
                        <motion.div
                          key={task._id}
                          layout
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, x: -24 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                          className={`group relative overflow-hidden bg-white/40 dark:bg-gray-800/40 backdrop-blur-2xl py-4 pl-6 pr-4 rounded-2xl border border-white/70 dark:border-gray-700 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex items-start justify-between gap-4 hover:bg-white/60 dark:hover:bg-gray-800/60 hover:shadow-[0_8px_28px_rgb(0,0,0,0.06)] transition-all ${task.isCompleted ? 'opacity-70' : ''}`}
                        >
                          <span className={`absolute left-0 top-4 bottom-4 w-1.5 rounded-r-full ${task.isCompleted ? 'bg-gray-300 dark:bg-gray-600' : p.bar}`} />

                          <div className="flex items-start gap-4 min-w-0 flex-1">
                            <button onClick={() => toggleComplete(task)} className="shrink-0 mt-0.5">
                              {task.isCompleted ? <CheckCircle2 className="w-6 h-6 text-green-500" /> : <Circle className="w-6 h-6 text-gray-300 dark:text-gray-600 hover:text-orange-500 transition-colors" />}
                            </button>

                            <div className="min-w-0 flex-1">
                              <h3 className={`text-[16px] font-bold leading-snug break-words ${task.isCompleted ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                                {task.title}
                              </h3>
                              {task.description && <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 line-clamp-2 break-words">{task.description}</p>}

                              <div className="flex gap-2 mt-3 items-center flex-wrap">
                                <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white/70 dark:bg-gray-700/50 border border-white/80 dark:border-gray-600 ${task.isCompleted ? 'text-gray-400 dark:text-gray-500' : p.text}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${task.isCompleted ? 'bg-gray-300 dark:bg-gray-600' : p.dot}`} />
                                  {task.priority}
                                </span>
                                <span className="text-[11px] font-semibold px-2.5 py-1 bg-gray-200/50 dark:bg-gray-700/60 text-gray-600 dark:text-gray-300 rounded-lg">
                                  {task.category}
                                </span>
                                {due && (
                                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg inline-flex items-center gap-1 ${due.style}`}>
                                    <CalendarDays className="w-3.5 h-3.5" />
                                    {due.label}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center shrink-0 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                            <button onClick={() => openEditModal(task)} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50/60 dark:hover:bg-blue-500/10 rounded-xl transition-colors">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => dispatch(deleteTask(task._id))} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50/60 dark:hover:bg-red-500/10 rounded-xl transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
      <EditTaskModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} task={selectedTask} />
    </div>
  );
};

export default Dashboard;