import { useState, useEffect, Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { Dialog, Transition, Listbox } from '@headlessui/react';
import { ChevronDown, Check, X, Calendar } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { updateTask } from '../features/taskSlice';

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

const EditTaskModal = ({ isOpen, setIsOpen, task }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: '', description: '', priority: 'Medium', category: 'Personal', dueDate: null,
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'Medium',
        category: task.category || 'Personal',
        dueDate: task.dueDate ? new Date(task.dueDate) : null,
      });
    }
  }, [task]);

  const { title, description, priority, category, dueDate } = formData;
  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(updateTask({ id: task._id, ...formData }));
    setIsOpen(false);
  };

  const selectedPriority = priorities.find((p) => p.id === priority);
  const selectedCategory = categories.find((c) => c.id === category);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-3xl bg-white/90 backdrop-blur-2xl p-6 text-left align-middle shadow-xl transition-all border border-white/50">
                
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title as="h3" className="text-lg font-extrabold text-gray-900">Edit Task</Dialog.Title>
                  <button onClick={() => setIsOpen(false)} className="p-1 text-gray-500 hover:bg-gray-100 rounded-full transition"><X className="w-5 h-5" /></button>
                </div>

                <form onSubmit={onSubmit} className="space-y-4 relative z-50">
                  <input type="text" name="title" value={title} onChange={onChange} placeholder="Task title" className="w-full p-3 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium" required />
                  <input type="text" name="description" value={description} onChange={onChange} placeholder="Description (optional)" className="w-full p-3 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />

                  <div className="flex gap-2 relative z-50">
                    <Listbox value={priority} onChange={(val) => setFormData({ ...formData, priority: val })}>
                      <div className="relative w-full">
                        <Listbox.Button className="relative w-full cursor-pointer bg-white border border-gray-200 rounded-xl py-2.5 pl-3 pr-10 text-left shadow-sm focus:outline-none text-sm font-medium text-gray-800">
                          <span className="block truncate">{selectedPriority?.name}</span>
                          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"><ChevronDown className="h-4 w-4 text-gray-400" /></span>
                        </Listbox.Button>
                        <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                          <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-sm shadow-lg border border-gray-100">
                            {priorities.map((option) => (
                              <Listbox.Option key={option.id} className={({ active }) => `relative cursor-pointer select-none py-2.5 pl-10 pr-4 ${active ? 'bg-orange-50 text-orange-900' : 'text-gray-900'}`} value={option.id}>
                                {({ selected }) => (
                                  <>
                                    <span className={`block truncate ${selected ? 'font-bold' : 'font-normal'}`}>{option.name}</span>
                                    {selected && <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-orange-500"><Check className="h-4 w-4" /></span>}
                                  </>
                                )}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
                      </div>
                    </Listbox>

                    <Listbox value={category} onChange={(val) => setFormData({ ...formData, category: val })}>
                      <div className="relative w-full">
                        <Listbox.Button className="relative w-full cursor-pointer bg-white border border-gray-200 rounded-xl py-2.5 pl-3 pr-10 text-left shadow-sm focus:outline-none text-sm font-medium text-gray-800">
                          <span className="block truncate">{selectedCategory?.name}</span>
                          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"><ChevronDown className="h-4 w-4 text-gray-400" /></span>
                        </Listbox.Button>
                        <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                          <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-sm shadow-lg border border-gray-100">
                            {categories.map((option) => (
                              <Listbox.Option key={option.id} className={({ active }) => `relative cursor-pointer select-none py-2.5 pl-10 pr-4 ${active ? 'bg-orange-50 text-orange-900' : 'text-gray-900'}`} value={option.id}>
                                {({ selected }) => (
                                  <>
                                    <span className={`block truncate ${selected ? 'font-bold' : 'font-normal'}`}>{option.name}</span>
                                    {selected && <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-orange-500"><Check className="h-4 w-4" /></span>}
                                  </>
                                )}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
                      </div>
                    </Listbox>
                  </div>

                  {/* Date Picker Edit */}
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                      <Calendar className="w-4 h-4 text-gray-500" />
                    </div>
                    <DatePicker
                      selected={dueDate}
                      onChange={(date) => setFormData({ ...formData, dueDate: date })}
                      placeholderText="Set a due date (optional)"
                      className="w-full p-3 pl-10 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      dateFormat="dd/MM/yyyy"
                    />
                  </div>

                  <button type="submit" className="w-full py-3 mt-2 text-white bg-gray-900 rounded-xl hover:bg-black transition-all font-semibold">Save Changes</button>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EditTaskModal;