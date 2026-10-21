import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LogOut, Trash2 } from 'lucide-react';
import { logout } from '../features/authSlice';
import { getTasks, deleteTask, reset } from '../features/taskSlice';
import TaskForm from '../components/TaskForm'; // Import added

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { tasks, isLoading, isError, message } = useSelector((state) => state.task);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isError) {
      console.log(message);
    }

    if (!user) {
      navigate('/login');
    } else {
      dispatch(getTasks());
    }

    return () => {
      dispatch(reset());
    };
  }, [user, navigate, isError, message, dispatch]);

  const onLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (isLoading) {
    return <div className="text-white text-center mt-10">Loading tasks...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Tasks</h1>
            <p className="text-gray-400 mt-1">Welcome back, {user?.name}</p>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center px-4 py-2 text-red-500 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>

        {/* Task Form Component */}
        <TaskForm />

        {/* Task List */}
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 text-center">
              <p className="text-gray-400">No tasks yet. Start by adding a new task.</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task._id}
                className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex items-center justify-between"
              >
                <div>
                  <h3 className={`text-lg font-semibold ${task.isCompleted ? 'line-through text-gray-500' : ''}`}>
                    {task.title}
                  </h3>
                  <p className="text-gray-400 text-sm">{task.description}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs px-2 py-1 bg-gray-700 rounded-full">{task.priority}</span>
                    <span className="text-xs px-2 py-1 bg-gray-700 rounded-full">{task.category}</span>
                  </div>
                </div>
                <button
                  onClick={() => dispatch(deleteTask(task._id))}
                  className="p-2 text-red-500 hover:bg-gray-700 rounded-lg transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;