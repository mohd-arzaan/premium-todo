import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Plus } from 'lucide-react';
import { addTask } from '../features/taskSlice';

const TaskForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    category: 'Personal',
  });

  const { title, description, priority, category } = formData;
  const dispatch = useDispatch();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    
    if (!title) {
      toast.error('Please enter a task title');
      return;
    }

    const taskData = { title, description, priority, category };
    dispatch(addTask(taskData));
    
    // Form reset karo
    setFormData({
      title: '',
      description: '',
      priority: 'Medium',
      category: 'Personal',
    });
  };

  return (
    <form onSubmit={onSubmit} className="bg-gray-800 p-6 rounded-lg border border-gray-700 mb-8 space-y-4">
      <h2 className="text-xl font-bold mb-4">Add New Task</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Title */}
        <input
          type="text"
          name="title"
          value={title}
          onChange={onChange}
          placeholder="Task title..."
          className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
          required
        />

        {/* Description */}
        <input
          type="text"
          name="description"
          value={description}
          onChange={onChange}
          placeholder="Description (optional)..."
          className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
        />

        {/* Priority */}
        <select
          name="priority"
          value={priority}
          onChange={onChange}
          className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
        >
          <option value="Low">Low Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="High">High Priority</option>
        </select>

        {/* Category */}
        <select
          name="category"
          value={category}
          onChange={onChange}
          className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
        >
          <option value="Personal">Personal</option>
          <option value="Work">Work</option>
          <option value="Study">Study</option>
        </select>
      </div>

      <button
        type="submit"
        className="flex items-center justify-center w-full py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none"
      >
        <Plus className="w-5 h-5 mr-2" />
        Add Task
      </button>
    </form>
  );
};

export default TaskForm;