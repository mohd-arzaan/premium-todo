import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LogOut, Trash2, Circle, CheckCircle2, Pencil, CalendarDays, ClipboardList, SearchX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { logout } from '../features/authSlice';
import { getTasks, deleteTask, updateTask, reset } from '../features/taskSlice';
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

// Due date ko "Today / Tomorrow / Overdue / 22 Oct" mein convert karta hai
const getDueInfo = (dueDate, isCompleted) => {
  const due = startOfDay(dueDate);
  const today = startOfDay(new Date());
  const diffDays = Math.round((due - today) / 86400000);
  const dateText = due.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

  if (isCompleted) return { label: dateText, style: 'bg-gray-100/80 text-gray-400' };
  if (diffDays < 0) return { label: `Overdue · ${dateText}`, style: 'bg-red-100/80 text-red-700' };
  if (diffDays === 0) return { label: 'Today', style: 'bg-orange-100/80 text-orange-700' };
  if (diffDays === 1) return { label: 'Tomorrow', style: 'bg-blue-100/80 text-blue-700' };
  return { label: dateText, style: 'bg-blue-100/80 text-blue-700' };
};

const priorityStyles = {
  High: { bar: 'bg-red-400', dot: 'bg-red-500', text: 'text-red-700' },
  Medium: { bar: 'bg-orange-400', dot: 'bg-orange-500', text: 'text-orange-700' },
  Low: { bar: 'bg-green-400', dot: 'bg-green-500', text: 'text-green-700' },
};

const SkeletonCard = () => (
  <div className="bg-white/40 backdrop-blur-2xl p-4 rounded-3xl border border-white/70 flex items-center gap-3 animate-pulse">
    <div className="w-6 h-6 rounded-full bg-gray-200" />
    <div className="flex-1 space-y-2">
      <div className="h-3.5 w-2/3 rounded bg-gray-200" />
      <div className="h-3 w-1/3 rounded bg-gray-200/70" />
    </div>
  </div>
);

/* ---------- component ---------- */

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

  const pendingCount = tasks.filter((t) => !t.isCompleted).length;
  const hasNoTasksAtAll = tasks.length === 0;
  const initial = user?.name?.charAt(0)?.toUpperCase() || '?';

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-start justify-center py-8 px-4">
        <div className="w-full max-w-md space-y-3">
          <div className="h-12 w-1/2 rounded-2xl bg-white/40 animate-pulse mb-6" />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-start justify-center py-8 px-4 bg-transparent overflow-y-auto">
      <div className="w-full max-w-md pb-20">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center text-lg font-extrabold shadow-lg shadow-orange-500/30">
              {initial}
            </div>
            <div>
              <p className="text-gray-500 text-xs font-medium">{getGreeting()}</p>
              <h1 className="text-xl font-extrabold text-gray-900 leading-tight">{user?.name}</h1>
            </div>
          </div>

          <button
            onClick={onLogout}
            aria-label="Logout"
            className="p-2.5 bg-white/40 backdrop-blur-md rounded-full text-gray-500 shadow-sm border border-white/60 hover:bg-red-50/70 hover:text-red-500 transition"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </motion.div>

        <Stats tasks={tasks} />
        <TaskForm />
        <TaskFilters search={search} setSearch={setSearch} filter={filter} setFilter={setFilter} sort={sort} setSort={setSort} />

        {/* List heading */}
        {!hasNoTasksAtAll && (
          <div className="flex items-baseline justify-between mt-6 mb-3 px-1">
            <h2 className="text-sm font-bold text-gray-800">Your tasks</h2>
            <span className="text-xs font-medium text-gray-500">
              {pendingCount} pending · {processedTasks.length} shown
            </span>
          </div>
        )}

        {/* Task list */}
        <div className={`space-y-3 ${hasNoTasksAtAll ? 'mt-6' : ''}`}>
          <AnimatePresence mode="popLayout">
            {processedTasks.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white/30 backdrop-blur-xl py-10 px-6 rounded-3xl border border-dashed border-gray-300/80 text-center"
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-white/60 flex items-center justify-center text-gray-400">
                  {hasNoTasksAtAll ? <ClipboardList className="w-6 h-6" /> : <SearchX className="w-6 h-6" />}
                </div>
                <p className="text-gray-800 font-bold text-sm">
                  {hasNoTasksAtAll ? 'No tasks yet' : 'No matching tasks'}
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  {hasNoTasksAtAll
                    ? 'Upar form mein apna pehla task add karo.'
                    : 'Search ya filter change karke dekho.'}
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
                    className={`group relative overflow-hidden bg-white/40 backdrop-blur-2xl py-4 pl-5 pr-3 rounded-3xl border border-white/70 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex items-start justify-between gap-2 hover:bg-white/60 hover:shadow-[0_8px_28px_rgb(0,0,0,0.06)] transition-all ${
                      task.isCompleted ? 'opacity-70' : ''
                    }`}
                  >
                    {/* Priority accent bar */}
                    <span className={`absolute left-0 top-4 bottom-4 w-1 rounded-r-full ${task.isCompleted ? 'bg-gray-300' : p.bar}`} />

                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <button
                        onClick={() => toggleComplete(task)}
                        aria-label={task.isCompleted ? 'Mark as active' : 'Mark as completed'}
                        className="shrink-0 mt-0.5"
                      >
                        {task.isCompleted ? (
                          <CheckCircle2 className="w-6 h-6 text-green-500" />
                        ) : (
                          <Circle className="w-6 h-6 text-gray-300 hover:text-orange-500 transition-colors" />
                        )}
                      </button>

                      <div className="min-w-0 flex-1">
                        <h3 className={`text-[15px] font-bold leading-snug break-words ${task.isCompleted ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className="text-gray-500 text-xs mt-1 line-clamp-2 break-words">{task.description}</p>
                        )}

                        <div className="flex gap-1.5 mt-2.5 items-center flex-wrap">
                          <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-1 rounded-lg bg-white/70 border border-white/80 ${task.isCompleted ? 'text-gray-400' : p.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${task.isCompleted ? 'bg-gray-300' : p.dot}`} />
                            {task.priority}
                          </span>

                          <span className="text-[11px] font-semibold px-2 py-1 bg-gray-200/50 text-gray-600 rounded-lg">
                            {task.category}
                          </span>

                          {due && (
                            <span className={`text-[11px] font-semibold px-2 py-1 rounded-lg inline-flex items-center gap-1 ${due.style}`}>
                              <CalendarDays className="w-3 h-3" />
                              {due.label}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions: desktop par hover pe dikhte hain, mobile par hamesha */}
                    <div className="flex items-center shrink-0 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditModal(task)}
                        aria-label="Edit task"
                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50/60 rounded-xl transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => dispatch(deleteTask(task._id))}
                        aria-label="Delete task"
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50/60 rounded-xl transition-colors"
                      >
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

      <EditTaskModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} task={selectedTask} />
    </div>
  );
};

export default Dashboard;