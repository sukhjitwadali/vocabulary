'use client';

import { useState } from 'react';
import TabNavigation from '@/components/TabNavigation';
import AddWordTab from '@/components/AddWordTab';
import WordListTab from '@/components/WordListTab';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { WordData } from '@/types/vocabulary';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'add' | 'list'>('add');
  const [words, setWords] = useLocalStorage('vocabulary-words', []);

  const handleWordSaved = (newWord: WordData) => {
    setWords(prevWords => [newWord, ...prevWords]);
    setActiveTab('list'); // Switch to list tab after saving
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-lg">
        {activeTab === 'add' ? (
          <AddWordTab onWordSaved={handleWordSaved} />
        ) : (
          <WordListTab words={words} />
        )}
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
}