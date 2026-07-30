import React, { useState, useEffect } from 'react';
import { X, Image as ImageIcon, Sparkles } from 'lucide-react';
import { Task, Priority, TaskStatus, TaskCategory } from '../types';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTask: (taskData: Omit<Task, 'id' | 'createdOn'> & { id?: string }) => void;
  taskToEdit?: Task | null;
}

const PRESET_IMAGES = [
  {
    name: 'Party / Birthday',
    url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Design / Laptop',
    url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Presentation',
    url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Dog / Park',
    url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Office Meeting',
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=300&q=80',
  },
];

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  onSaveTask,
  taskToEdit,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('Moderate');
  const [status, setStatus] = useState<TaskStatus>('Not Started');
  const [category, setCategory] = useState<TaskCategory>('Work');
  const [imageUrl, setImageUrl] = useState('');
  const [isVital, setIsVital] = useState(false);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setPriority(taskToEdit.priority);
      setStatus(taskToEdit.status);
      setCategory(taskToEdit.category);
      setImageUrl(taskToEdit.imageUrl || '');
      setIsVital(!!taskToEdit.isVital);
    } else {
      setTitle('');
      setDescription('');
      setPriority('Moderate');
      setStatus('Not Started');
      setCategory('Work');
      setImageUrl('');
      setIsVital(false);
    }
  }, [taskToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSaveTask({
      id: taskToEdit?.id,
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      category,
      imageUrl: imageUrl.trim() || undefined,
      isVital,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 overflow-hidden relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="text-[#FF5F5E]">{taskToEdit ? 'Edit' : 'Create New'}</span> Task
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-4 overflow-y-auto flex-1 pr-1">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Task Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Landing Page Design for TravelDays"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5F5E]/30"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Provide details about the task, location, or time..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5F5E]/30 resize-none"
            />
          </div>

          {/* Priority & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FF5F5E]/30"
              >
                <option value="Low">Low</option>
                <option value="Moderate">Moderate</option>
                <option value="High">High</option>
                <option value="Vital">Vital</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FF5F5E]/30"
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {(['Work', 'Personal', 'Design', 'Meeting', 'Event'] as TaskCategory[]).map(
                (cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                      category === cat
                        ? 'bg-[#FF5F5E] text-white border-[#FF5F5E]'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Image Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
                Thumbnail Image URL
              </span>
              <span className="text-[10px] text-slate-400">Optional</span>
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#FF5F5E]/30"
            />

            {/* Presets */}
            <div className="mt-2.5">
              <p className="text-[11px] text-slate-500 mb-1.5 font-medium">
                Or pick a preset thumbnail:
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {PRESET_IMAGES.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => setImageUrl(preset.url)}
                    className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                      imageUrl === preset.url
                        ? 'border-[#FF5F5E] ring-2 ring-[#FF5F5E]/30'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                    title={preset.name}
                  >
                    <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Is Vital Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isVital"
              checked={isVital}
              onChange={(e) => setIsVital(e.target.checked)}
              className="w-4 h-4 rounded text-[#FF5F5E] focus:ring-[#FF5F5E]"
            />
            <label htmlFor="isVital" className="text-xs font-medium text-slate-700 flex items-center gap-1 cursor-pointer">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Mark as Vital Task (Show in Vital Task tab)
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-3 bg-[#FF5F5E] hover:bg-[#ff4a49] text-white font-semibold text-sm rounded-xl transition-colors shadow-sm"
            >
              {taskToEdit ? 'Save Changes' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
