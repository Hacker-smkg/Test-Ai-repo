import { useState, useEffect } from 'react';
import { Plus, Trash2, Tag } from 'lucide-react';
import api from '../api';
import type { Word } from '../types';

export default function Dictionary() {
  const [words, setWords] = useState<Word[]>([]);
  const [newWord, setNewWord] = useState('');
  const [newType, setNewType] = useState('positive');
  const [loading, setLoading] = useState(false);

  const fetchWords = async () => {
    const { data } = await api.get<Word[]>('/api/words');
    setWords(data);
  };

  useEffect(() => {
    fetchWords();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord) return;
    setLoading(true);
    try {
      await api.post('/api/words', { word: newWord, sentiment_type: newType });
      setNewWord('');
      fetchWords();
    } catch (error) {
      alert('Word already exists or failed to add.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/api/words/${id}`);
      fetchWords();
    } catch (error) {
      alert('Failed to delete word.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Plus className="w-5 h-5 text-blue-500" />
          Add New Word
        </h2>
        <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            placeholder="Enter word (e.g. awesome)"
            className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <select
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <option value="positive">Positive</option>
            <option value="negative">Negative</option>
            <option value="neutral">Neutral</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            Add Word
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(['positive', 'negative', 'neutral'] as const).map((type) => (
          <div key={type} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="capitalize font-bold text-slate-700 flex items-center gap-2">
                <Tag className={`w-4 h-4 ${type === 'positive' ? 'text-green-500' : type === 'negative' ? 'text-red-500' : 'text-slate-400'}`} />
                {type} Words
              </h3>
              <span className="bg-slate-100 text-slate-500 text-xs px-2 py-1 rounded-full font-bold">
                {words.filter(w => w.sentiment_type === type).length}
              </span>
            </div>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
              {words.filter(w => w.sentiment_type === type).map((w) => (
                <div key={w.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg group hover:bg-slate-100 transition-colors">
                  <span className="text-slate-600">{w.word}</span>
                  <button 
                    onClick={() => handleDelete(w.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {words.filter(w => w.sentiment_type === type).length === 0 && (
                <p className="text-sm text-slate-400 italic py-4 text-center">No words yet.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
