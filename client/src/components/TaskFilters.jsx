import { Search, Filter, ArrowUpDown } from 'lucide-react';

const TaskFilters = ({ search, setSearch, filter, setFilter, sort, setSort }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
      
      {/* Search Bar */}
      <div className="relative w-full md:w-1/3">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-4 h-4 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full py-2 pl-10 pr-4 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
        />
      </div>

      <div className="flex gap-4 w-full md:w-auto">
        {/* Filter */}
        <div className="flex items-center gap-2 bg-gray-700 rounded-lg px-3 py-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-transparent text-white text-sm focus:outline-none w-full"
          >
            <option value="All" className="bg-gray-800">All Tasks</option>
            <option value="Active" className="bg-gray-800">Active</option>
            <option value="Completed" className="bg-gray-800">Completed</option>
            <option value="High" className="bg-gray-800">High Priority</option>
          </select>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 bg-gray-700 rounded-lg px-3 py-2 w-full md:w-auto">
          <ArrowUpDown className="w-4 h-4 text-gray-400" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-transparent text-white text-sm focus:outline-none w-full"
          >
            <option value="Newest" className="bg-gray-800">Newest First</option>
            <option value="Oldest" className="bg-gray-800">Oldest First</option>
            <option value="A-Z" className="bg-gray-800">Title (A-Z)</option>
          </select>
        </div>
      </div>

    </div>
  );
};

export default TaskFilters;