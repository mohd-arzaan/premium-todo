import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LogOut, Trash2, Circle, CheckCircle } from 'lucide-react';
import { logout } from '../features/authSlice';
import { getTasks, deleteTask, updateTask, reset } from '../features/taskSlice';
import TaskForm from '../components/TaskForm';
import TaskFilters from '../components/TaskFilters';
import Stats from '../components/Stats'; // Naya Import

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { tasks, isLoading, isError, message } = useSelector((state) => state.task);

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('Newest');

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

  const toggleComplete = (task) => {
    dispatch(updateTask({ id: task._id, isCompleted: !task.isCompleted }));
  };

  let processedTasks = [...tasks];

  if (search) {
    processedTasks = processedTasks.filter((task) =>
      task.title.toLowerCase().includes(search.toLowerCase()) || 
      (task.description && task.description.toLowerCase().includes(search.toLowerCase()))
    );
  }

  if (filter === 'Active') {
    processedTasks = processedTasks.filter((task) => !task.isCompleted);
  } else if (filter === 'Completed') {
    processedTasks = processedTasks.filter((task) => task.isCompleted);
  } else if (filter === 'High') {
    processedTasks = processedTasks.filter((task) => task.priority === 'High');
  }

  if (sort === 'Newest') {
    processedTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (sort === 'Oldest') {
    processedTasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  } else if (sort === 'A-Z') {
    processedTasks.sort((a, b) => a.title.localeCompare(b.title));
  }

  if (isLoading) {
    return <div className="text-white text-center mt-10">Loading tasks...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        
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

        {/* Stats Component Add kiya */}
        <Stats tasks={tasks} />

        <TaskForm />

        <TaskFilters 
          search={search} 
          setSearch={setSearch} 
          filter={filter} 
          setFilter={setFilter} 
          sort={sort} 
          setSort={setSort} 
        />

        <div className="space-y-4">
          {processedTasks.length === 0 ? (
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 text-center">
              <p className="text-gray-400">No tasks found matching your criteria.</p>
            </div>
          ) : (
            processedTasks.map((task) => (
              <div
                key={task._id}
                className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <button onClick={() => toggleComplete(task)}>
                    {task.isCompleted ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400 hover:text-white" />
                    )}
                  </button>

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
                </div>
                
                <button
                  onClick={() => dispatch(deleteTask(task._id))}
                  className="flex items-center gap-2 px-3 py-1 text-sm text-red-500 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
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