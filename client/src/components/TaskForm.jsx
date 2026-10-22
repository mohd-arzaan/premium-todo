import { useState, Fragment } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Plus, ChevronDown, Check, Calendar } from 'lucide-react';
import { Listbox, Transition } from '@headlessui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { addTask } from '../features/taskSlice';

const priorities = [
  { id: 'Low', name: 'Low Priority' },
  { id: 'Medium', name: 'Medium Priority' },
  { id: 'High', name: 'High Priority' },
];
const categories = [
  { id: 'Personal', name: 'Personal' },
  { id: 'Work', name: 'Work' },
  { id: 'Study', name: 'Study' },
];

// Calendar ko seedha document.body mein render karta hai,
// taaki backdrop-blur / z-index wale parent ke stacking context mein na fase.
const CalendarPortal = ({ children }) => createPortal(children, document.body);

const TaskForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    category: 'Personal',
    dueDate: null,
  });
  const { title, description, priority, category, dueDate } = formData;
  const dispatch = useDispatch();

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    if (!title) return toast.error('Please enter a task title');

    dispatch(
      addTask({
        title,
        description,
        priority,
        category,
        // Date object ko string bana kar bhejo (Redux serializable warning se bachne ke liye)
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      })
    );

    setFormData({ title: '', description: '', priority: 'Medium', category: 'Personal', dueDate: null });
  };

  const selectedPriority = priorities.find((p) => p.id === priority);
  const selectedCategory = categories.find((c) => c.id === category);

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white/30 backdrop-blur-2xl p-5 rounded-3xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-6 space-y-3 relative z-50"
    >
      <input
        type="text"
        name="title"
        value={title}
        onChange={onChange}
        placeholder="What needs to be done?"
        className="w-full p-3 bg-white/50 border border-white/60 rounded-2xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all font-medium placeholder-gray-500"
        required
      />

      <input
        type="text"
        name="description"
        value={description}
        onChange={onChange}
        placeholder="Add a note (optional)"
        className="w-full p-3 bg-white/50 border border-white/60 rounded-2xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all placeholder-gray-500"
      />

      <div className="flex gap-2 relative z-40">
        {/* Priority */}
        <Listbox value={priority} onChange={(val) => setFormData({ ...formData, priority: val })}>
          <div className="relative w-full">
            <Listbox.Button className="relative w-full cursor-pointer bg-white/50 border border-white/60 rounded-xl py-2.5 pl-3 pr-10 text-left shadow-sm focus:outline-none text-sm font-medium text-gray-800 transition-all">
              <span className="block truncate">{selectedPriority?.name}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </span>
            </Listbox.Button>
            <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
              <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white/90 backdrop-blur-xl py-1 text-sm shadow-xl border border-white/50">
                {priorities.map((option) => (
                  <Listbox.Option
                    key={option.id}
                    className={({ active }) =>
                      `relative cursor-pointer select-none py-2.5 pl-10 pr-4 ${
                        active ? 'bg-orange-100/50 text-orange-900' : 'text-gray-900'
                      }`
                    }
                    value={option.id}
                  >
                    {({ selected }) => (
                      <>
                        <span className={`block truncate ${selected ? 'font-bold' : 'font-normal'}`}>{option.name}</span>
                        {selected && (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-orange-500">
                            <Check className="h-4 w-4" />
                          </span>
                        )}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>

        {/* Category */}
        <Listbox value={category} onChange={(val) => setFormData({ ...formData, category: val })}>
          <div className="relative w-full">
            <Listbox.Button className="relative w-full cursor-pointer bg-white/50 border border-white/60 rounded-xl py-2.5 pl-3 pr-10 text-left shadow-sm focus:outline-none text-sm font-medium text-gray-800 transition-all">
              <span className="block truncate">{selectedCategory?.name}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </span>
            </Listbox.Button>
            <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
              <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white/90 backdrop-blur-xl py-1 text-sm shadow-xl border border-white/50">
                {categories.map((option) => (
                  <Listbox.Option
                    key={option.id}
                    className={({ active }) =>
                      `relative cursor-pointer select-none py-2.5 pl-10 pr-4 ${
                        active ? 'bg-orange-100/50 text-orange-900' : 'text-gray-900'
                      }`
                    }
                    value={option.id}
                  >
                    {({ selected }) => (
                      <>
                        <span className={`block truncate ${selected ? 'font-bold' : 'font-normal'}`}>{option.name}</span>
                        {selected && (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-orange-500">
                            <Check className="h-4 w-4" />
                          </span>
                        )}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      </div>

      {/* Due date */}
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
          <Calendar className="w-4 h-4 text-gray-500" />
        </div>
        <DatePicker
          selected={dueDate ? new Date(dueDate) : null}
          onChange={(date) => setFormData({ ...formData, dueDate: date })}
          placeholderText="Set a due date (optional)"
          className="w-full p-3 pl-10 bg-white/50 border border-white/60 rounded-2xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all placeholder-gray-500 cursor-pointer"
          dateFormat="dd/MM/yyyy"
          popperPlacement="bottom-start"
          popperClassName="!z-[9999]"
          popperContainer={CalendarPortal}
          showPopperArrow={false}
        />
      </div>

      <button
        type="submit"
        className="flex items-center justify-center w-full py-3 mt-2 text-white bg-gray-900 rounded-2xl hover:bg-black shadow-lg shadow-gray-900/20 transition-all font-semibold relative z-30"
      >
        <Plus className="w-5 h-5 mr-2" /> Add Task
      </button>
    </form>
  );
};

export default TaskForm;