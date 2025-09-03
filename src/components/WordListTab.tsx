'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, isToday, isYesterday, isThisWeek, isThisYear, startOfDay, differenceInDays } from 'date-fns';
import { WordData, DateGroup } from '@/types/vocabulary';

interface WordListTabProps {
  words: WordData[];
}

export default function WordListTab({ words }: WordListTabProps) {
  const [expandedWords, setExpandedWords] = useState<Set<string>>(new Set());
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const toggleExpanded = (word: string) => {
    const newExpanded = new Set(expandedWords);
    if (newExpanded.has(word)) {
      newExpanded.delete(word);
    } else {
      newExpanded.add(word);
    }
    setExpandedWords(newExpanded);
  };

  const toggleDateExpanded = (date: string) => {
    const newExpanded = new Set(expandedDates);
    if (newExpanded.has(date)) {
      newExpanded.delete(date);
    } else {
      newExpanded.add(date);
    }
    setExpandedDates(newExpanded);
  };

  const formatDate = (date: Date) => {
    return format(new Date(date), 'MMM dd, yyyy');
  };

  const formatTime = (date: Date) => {
    return format(new Date(date), 'h:mm a');
  };

  const getDisplayDate = (date: Date): string => {
    const dateObj = new Date(date);
    
    if (isToday(dateObj)) {
      return 'Today';
    } else if (isYesterday(dateObj)) {
      return 'Yesterday';
    } else {
      return format(dateObj, 'MMM dd, yyyy'); // Dec 15, 2023
    }
  };

  const getDateCategory = (date: Date): string => {
    const dateObj = new Date(date);
    
    if (isToday(dateObj)) {
      return 'today';
    } else if (isYesterday(dateObj)) {
      return 'yesterday';
    } else {
      return 'other';
    }
  };

  const groupWordsByDate = (): DateGroup[] => {
    const todayWords: WordData[] = [];
    const yesterdayWords: WordData[] = [];
    const otherWords: { [key: string]: WordData[] } = {};
    
    words.forEach(word => {
      const wordDate = new Date(word.savedAt);
      const category = getDateCategory(wordDate);
      
      if (category === 'today') {
        todayWords.push(word);
      } else if (category === 'yesterday') {
        yesterdayWords.push(word);
      } else {
        const dateKey = format(startOfDay(wordDate), 'yyyy-MM-dd');
        if (!otherWords[dateKey]) {
          otherWords[dateKey] = [];
        }
        otherWords[dateKey].push(word);
      }
    });

    const result: DateGroup[] = [];

    // Add Today section if there are words
    if (todayWords.length > 0) {
      result.push({
        date: 'today',
        displayDate: 'Today',
        words: todayWords.sort((a, b) => 
          new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
        )
      });
    }

    // Add Yesterday section if there are words
    if (yesterdayWords.length > 0) {
      result.push({
        date: 'yesterday',
        displayDate: 'Yesterday',
        words: yesterdayWords.sort((a, b) => 
          new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
        )
      });
    }

    // Add other dates
    Object.keys(otherWords)
      .sort((a, b) => b.localeCompare(a)) // Sort dates in descending order (newest first)
      .forEach(dateKey => {
        result.push({
          date: dateKey,
          displayDate: getDisplayDate(new Date(dateKey)),
          words: otherWords[dateKey].sort((a, b) => 
            new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
          )
        });
      });

    return result;
  };

  const dateGroups = groupWordsByDate();

  if (words.length === 0) {
    return (
      <div className="p-4 pb-20">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">My Words</h1>
          <div className="bg-gray-50 rounded-lg p-8">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No words saved yet</h3>
            <p className="text-gray-500">Start by adding your first word in the &quot;Add Word&quot; tab!</p>
          </div>
        </div>
      </div>
    );
  }

  // If a specific date is selected, show only words from that date
  if (selectedDate) {
    const selectedGroup = dateGroups.find(group => group.date === selectedDate);
    if (!selectedGroup) return null;

    return (
      <div className="p-4 pb-20">
        <div className="max-w-md mx-auto">
          <div className="flex items-center mb-6">
            <button
              onClick={() => setSelectedDate(null)}
              className="mr-3 p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">
              {selectedGroup.displayDate}
            </h1>
          </div>
          
          <div className="space-y-3">
            {selectedGroup.words.map((wordData) => {
              const isExpanded = expandedWords.has(wordData.word);
              
              return (
                <div
                  key={`${wordData.word}-${wordData.savedAt.getTime()}`}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <button
                    onClick={() => toggleExpanded(wordData.word)}
                    className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 capitalize">
                        {wordData.word}
                      </h3>
                      <div className="flex items-center space-x-1 mt-1 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(wordData.savedAt)}</span>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-gray-100">
                      <div className="pt-4 space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Meaning:</h4>
                          <p className="text-gray-900 leading-relaxed">{wordData.meaning}</p>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Examples:</h4>
                          <ul className="space-y-2">
                            {wordData.examples.map((example, index) => (
                              <li key={index} className="text-gray-900 leading-relaxed">
                                <span className="text-blue-600 font-medium">{index + 1}.</span> {example}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Main view - show all dates
  return (
    <div className="p-4 pb-20">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          My Words ({words.length})
        </h1>
        
                 <div className="space-y-4">
           {dateGroups.map((group) => {
             const isExpanded = expandedDates.has(group.date);
             const isToday = group.date === 'today';
             const isYesterday = group.date === 'yesterday';
             
             return (
               <div
                 key={group.date}
                 className={`border rounded-lg shadow-sm ${
                   isToday 
                     ? 'bg-blue-50 border-blue-200' 
                     : isYesterday 
                     ? 'bg-green-50 border-green-200' 
                     : 'bg-white border-gray-200'
                 }`}
               >
                 <button
                   onClick={() => toggleDateExpanded(group.date)}
                   className={`w-full p-4 text-left flex items-center justify-between rounded-lg ${
                     isToday 
                       ? 'hover:bg-blue-100' 
                       : isYesterday 
                       ? 'hover:bg-green-100' 
                       : 'hover:bg-gray-50'
                   }`}
                 >
                   <div className="flex items-center space-x-3">
                     <Calendar className={`w-5 h-5 ${
                       isToday 
                         ? 'text-blue-600' 
                         : isYesterday 
                         ? 'text-green-600' 
                         : 'text-gray-600'
                     }`} />
                     <div>
                       <h3 className={`text-lg font-semibold ${
                         isToday 
                           ? 'text-blue-900' 
                           : isYesterday 
                           ? 'text-green-900' 
                           : 'text-gray-900'
                       }`}>
                         {group.displayDate}
                       </h3>
                       <p className={`text-sm ${
                         isToday 
                           ? 'text-blue-600' 
                           : isYesterday 
                           ? 'text-green-600' 
                           : 'text-gray-500'
                       }`}>
                         {group.words.length} word{group.words.length !== 1 ? 's' : ''}
                       </p>
                     </div>
                   </div>
                   {isExpanded ? (
                     <ChevronUp className="w-5 h-5 text-gray-400" />
                   ) : (
                     <ChevronDown className="w-5 h-5 text-gray-400" />
                   )}
                 </button>
                
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-gray-100">
                    <div className="pt-4 space-y-3">
                      {group.words.map((wordData) => {
                        const isWordExpanded = expandedWords.has(wordData.word);
                        
                        return (
                          <div
                            key={`${wordData.word}-${wordData.savedAt.getTime()}`}
                            className="bg-gray-50 border border-gray-200 rounded-lg p-3"
                          >
                            <button
                              onClick={() => toggleExpanded(wordData.word)}
                              className="w-full text-left flex items-center justify-between hover:bg-gray-100 rounded p-2 -m-2"
                            >
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900 capitalize">
                                  {wordData.word}
                                </h4>
                                <div className="flex items-center space-x-1 mt-1 text-xs text-gray-500">
                                  <Clock className="w-3 h-3" />
                                  <span>{formatTime(wordData.savedAt)}</span>
                                </div>
                              </div>
                              {isWordExpanded ? (
                                <ChevronUp className="w-4 h-4 text-gray-400" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                              )}
                            </button>
                            
                            {isWordExpanded && (
                              <div className="mt-3 pt-3 border-t border-gray-200">
                                <div className="space-y-3">
                                  <div>
                                    <h5 className="text-xs font-medium text-gray-700 mb-1">Meaning:</h5>
                                    <p className="text-sm text-gray-900 leading-relaxed">{wordData.meaning}</p>
                                  </div>
                                  
                                  <div>
                                    <h5 className="text-xs font-medium text-gray-700 mb-1">Examples:</h5>
                                    <ul className="space-y-1">
                                      {wordData.examples.map((example, index) => (
                                        <li key={index} className="text-sm text-gray-900 leading-relaxed">
                                          <span className="text-blue-600 font-medium">{index + 1}.</span> {example}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}