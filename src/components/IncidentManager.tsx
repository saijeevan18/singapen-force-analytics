'use client';

import React, { useState, useMemo } from 'react';
import { Incident } from '@/data/incidents';
import { PRIORITY_COLORS, STATUS_COLORS } from '@/data/analytics';
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  SlidersHorizontal,
  ArrowUpDown,
  Filter,
  FileText,
  Eye,
  Calendar,
  X
} from 'lucide-react';

interface IncidentManagerProps {
  incidents: Incident[];
  onOpenIncident: (incident: Incident) => void;
  selectedRegionFilter: string | null;
  onSelectRegionFilter: (region: string | null) => void;
}

export default function IncidentManager({
  incidents,
  onOpenIncident,
  selectedRegionFilter,
  onSelectRegionFilter
}: IncidentManagerProps) {
  // Local filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [sortField, setSortField] = useState<'date' | 'priority'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  // Extract dropdown choices
  const regionsList = useMemo(() => {
    return Array.from(new Set(incidents.map(i => i.region))).sort();
  }, [incidents]);

  const prioritiesList = ['Low', 'Medium', 'High', 'Critical'];
  const statusesList = ['New', 'Assigned', 'Investigating', 'Resolved', 'Closed'];

  // Apply filters and sorting
  const processedIncidents = useMemo(() => {
    let list = [...incidents];

    // 1. Text Search (ID, Title, Desc, Reporter, Unit)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      list = list.filter(
        i => 
          i.id.toLowerCase().includes(term) ||
          i.title.toLowerCase().includes(term) ||
          i.description.toLowerCase().includes(term) ||
          i.reporter.toLowerCase().includes(term) ||
          (i.assignedUnit && i.assignedUnit.toLowerCase().includes(term))
      );
    }

    // 2. Region Filter
    if (selectedRegionFilter) {
      list = list.filter(i => i.region === selectedRegionFilter);
    }

    // 3. Priority Filter
    if (priorityFilter) {
      list = list.filter(i => i.priority === priorityFilter);
    }

    // 4. Status Filter
    if (statusFilter) {
      list = list.filter(i => i.status === statusFilter);
    }

    // 5. Sorting
    list.sort((a, b) => {
      if (sortField === 'date') {
        const timeA = new Date(a.timestamp).getTime();
        const timeB = new Date(b.timestamp).getTime();
        return sortDirection === 'asc' ? timeA - timeB : timeB - timeA;
      } else {
        // Priority weight comparison
        const weight: Record<string, number> = { Low: 1, Medium: 2, High: 3, Critical: 4 };
        const weightA = weight[a.priority] || 0;
        const weightB = weight[b.priority] || 0;
        if (weightA === weightB) {
          // fallback to date sorting if weights are equal
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        }
        return sortDirection === 'asc' ? weightA - weightB : weightB - weightA;
      }
    });

    return list;
  }, [incidents, searchTerm, selectedRegionFilter, priorityFilter, statusFilter, sortField, sortDirection]);

  // Reset page number on filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedRegionFilter, priorityFilter, statusFilter, sortField, sortDirection, itemsPerPage]);

  // Pagination bounds
  const totalItems = processedIncidents.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedIncidents = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return processedIncidents.slice(startIdx, startIdx + itemsPerPage);
  }, [processedIncidents, currentPage, itemsPerPage]);

  const toggleSort = (field: 'date' | 'priority') => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    onSelectRegionFilter(null);
    setPriorityFilter('');
    setStatusFilter('');
    setSortField('date');
    setSortDirection('desc');
  };

  const hasActiveFilters = searchTerm || selectedRegionFilter || priorityFilter || statusFilter;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[700px]">
      {/* Search and Filter Panel */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-3 bg-slate-50/50 dark:bg-slate-900/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Text Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search reports by ID, title, description, unit, reporter..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700/60 rounded-xl py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 dark:text-white"
            />
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => toggleSort('date')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-colors ${
                sortField === 'date'
                  ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/40 dark:border-blue-900 dark:text-blue-400'
                  : 'bg-white border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Sort by Date</span>
              <ArrowUpDown className="w-3 h-3 ml-0.5" />
            </button>

            <button
              onClick={() => toggleSort('priority')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-colors ${
                sortField === 'priority'
                  ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/40 dark:border-blue-900 dark:text-blue-400'
                  : 'bg-white border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Sort by Severity</span>
              <ArrowUpDown className="w-3 h-3 ml-0.5" />
            </button>
          </div>
        </div>

        {/* Dropdown Filters Grid */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-1 text-slate-400 text-xs font-bold mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          {/* Region Dropdown */}
          <select
            value={selectedRegionFilter || ''}
            onChange={(e) => onSelectRegionFilter(e.target.value || null)}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="">All Regions</option>
            {regionsList.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          {/* Priority Dropdown */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="">All Priorities</option>
            {prioritiesList.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="">All Statuses</option>
            {statusesList.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Clear Button */}
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 hover:bg-red-100 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          {/* Results Count */}
          <div className="ml-auto text-slate-400 text-xs font-medium">
            Found <span className="font-bold text-slate-700 dark:text-slate-200">{totalItems}</span> matching records
          </div>
        </div>
      </div>

      {/* Incident List Table */}
      <div className="flex-1 overflow-auto min-h-0">
        {paginatedIncidents.length > 0 ? (
          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 bg-slate-100 dark:bg-slate-850 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold border-b border-slate-250 dark:border-slate-800 z-10">
              <tr>
                <th className="py-3.5 px-4 w-24">Incident ID</th>
                <th className="py-3.5 px-4 hidden md:table-cell w-36">Timestamp</th>
                <th className="py-3.5 px-4 w-32">Region</th>
                <th className="py-3.5 px-4">Title & Context</th>
                <th className="py-3.5 px-4 w-28">Category</th>
                <th className="py-3.5 px-4 w-24">Priority</th>
                <th className="py-3.5 px-4 w-24">Status</th>
                <th className="py-3.5 px-4 text-center w-16">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 dark:divide-slate-800/60">
              {paginatedIncidents.map((inc) => (
                <tr
                  key={inc.id}
                  onClick={() => onOpenIncident(inc)}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-4 font-mono font-bold text-slate-500">{inc.id}</td>
                  <td className="py-3 px-4 hidden md:table-cell text-slate-400">
                    {new Date(inc.timestamp).toLocaleString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                    {inc.region}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {inc.title}
                    </div>
                    <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                      {inc.description}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-500 dark:text-slate-400 font-medium">
                    {inc.category}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold"
                      style={{
                        backgroundColor: `${PRIORITY_COLORS[inc.priority]}15`,
                        color: PRIORITY_COLORS[inc.priority]
                      }}
                    >
                      {inc.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold"
                      style={{
                        backgroundColor: `${STATUS_COLORS[inc.status]}15`,
                        color: STATUS_COLORS[inc.status]
                      }}
                    >
                      {inc.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenIncident(inc);
                      }}
                      className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-400 hover:text-blue-600 rounded-lg transition-all"
                      title="Inspect Incident Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3 text-slate-400">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Incidents Found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Your filters and queries did not return any operations logs. Adjust your search keywords or clear current dashboard constraints.
            </p>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-500/20"
              >
                Clear All Constraints
              </button>
            )}
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/40">
        <div className="flex items-center space-x-4 text-xs text-slate-500 dark:text-slate-400">
          <span>
            Showing{' '}
            <span className="font-bold text-slate-700 dark:text-slate-200">
              {totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
            </span>{' '}
            to{' '}
            <span className="font-bold text-slate-700 dark:text-slate-200">
              {Math.min(currentPage * itemsPerPage, totalItems)}
            </span>{' '}
            of <span className="font-bold text-slate-700 dark:text-slate-200">{totalItems}</span> incidents
          </span>

          {/* Items Per Page Select */}
          <div className="flex items-center space-x-1.5">
            <span>Per page:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 px-2 py-0.5 rounded-lg text-xs font-semibold focus:outline-none cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-slate-250 dark:border-slate-750 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent transition-colors text-slate-500"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="text-xs font-bold text-slate-600 dark:text-slate-300">
            Page {currentPage} of {totalPages}
          </div>

          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-slate-250 dark:border-slate-750 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent transition-colors text-slate-500"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
