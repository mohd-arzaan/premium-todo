import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { Search, Filter, ArrowUpDown, Check, ChevronDown } from 'lucide-react';

const filterOptions = [
  { id: 'All', name: 'All Tasks' },
  { id: 'Active', name: 'Active' },
  { id: 'Completed', name: 'Completed' },
  { id: 'High', name: 'High Priority' },
];
const sortOptions = [
  { id: 'Newest', name: 'Newest First' },
  { id: 'Oldest', name: 'Oldest First' },
  { id: 'A-Z', name: 'Title (A-Z)' },
];

const TaskFilters = ({ search, setSearch, filter, setFilter, sort, setSort }) => {
  const selectedFilter = filterOptions.find((opt) => opt.id === filter);
  const selectedSort = sortOptions.find((opt) => opt.id === sort);

  return (
    <div className="flex flex-col gap-3 mb-4 relative z-20">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <Search className="w-4 h-4 text-gray-500" />
        </div>
        <input type="text" placeholder="Search tasks..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full py-3 pl-11 pr-4 text-gray-900 bg-white/40 backdrop-blur-xl border border-white/70 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-medium shadow-sm transition-all placeholder-gray-500" />
      </div>

      <div className="flex gap-2 relative z-20">
        <Listbox value={filter} onChange={setFilter}>
          <div className="relative w-full">
            <Listbox.Button className="relative w-full cursor-pointer bg-white/40 backdrop-blur-xl border border-white/70 rounded-xl py-2.5 pl-3 pr-10 text-left shadow-sm focus:outline-none text-sm font-medium text-gray-800 transition-all">
              <span className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-600" />
                <span className="block truncate">{selectedFilter?.name}</span>
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </span>
            </Listbox.Button>
            <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
              <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white/90 backdrop-blur-xl py-1 text-sm shadow-xl border border-white/50">
                {filterOptions.map((option) => (
                  <Listbox.Option key={option.id} className={({ active }) => `relative cursor-pointer select-none py-2.5 pl-10 pr-4 ${active ? 'bg-orange-100/50 text-orange-900' : 'text-gray-900'}`} value={option.id}>
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

        <Listbox value={sort} onChange={setSort}>
          <div className="relative w-full">
            <Listbox.Button className="relative w-full cursor-pointer bg-white/40 backdrop-blur-xl border border-white/70 rounded-xl py-2.5 pl-3 pr-10 text-left shadow-sm focus:outline-none text-sm font-medium text-gray-800 transition-all">
              <span className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-gray-600" />
                <span className="block truncate">{selectedSort?.name}</span>
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </span>
            </Listbox.Button>
            <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
              <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white/90 backdrop-blur-xl py-1 text-sm shadow-xl border border-white/50">
                {sortOptions.map((option) => (
                  <Listbox.Option key={option.id} className={({ active }) => `relative cursor-pointer select-none py-2.5 pl-10 pr-4 ${active ? 'bg-orange-100/50 text-orange-900' : 'text-gray-900'}`} value={option.id}>
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
    </div>
  );
};
export default TaskFilters;