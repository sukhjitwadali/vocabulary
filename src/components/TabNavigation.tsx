'use client';


import { BookOpen, List } from 'lucide-react';

interface TabNavigationProps {
  activeTab: 'add' | 'list';
  onTabChange: (tab: 'add' | 'list') => void;
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex">
        <button
          onClick={() => onTabChange('add')}
          className={`flex-1 flex flex-col items-center py-3 px-4 ${
            activeTab === 'add'
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <BookOpen className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Add Word</span>
        </button>
        <button
          onClick={() => onTabChange('list')}
          className={`flex-1 flex flex-col items-center py-3 px-4 ${
            activeTab === 'list'
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <List className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">My Words</span>
        </button>
      </div>
    </div>
  );
}
