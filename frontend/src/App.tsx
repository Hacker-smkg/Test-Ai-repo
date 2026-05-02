import { useState } from 'react';
import { Search, BookOpen, BrainCircuit } from 'lucide-react';
import Analyzer from './components/Analyzer';
import Dictionary from './components/Dictionary';

function App() {
  const [activeTab, setActiveTab] = useState<'analyzer' | 'dictionary'>('analyzer');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">SentiOCR</span>
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('analyzer')}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2
                ${activeTab === 'analyzer' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Search className="w-4 h-4" />
              Analyzer
            </button>
            <button
              onClick={() => setActiveTab('dictionary')}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2
                ${activeTab === 'dictionary' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <BookOpen className="w-4 h-4" />
              Dictionary
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Handwritten Sentiment Analyzer
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Upload your handwritten notes and let AI extract the text and analyze its emotional tone using your custom dictionary.
          </p>
        </header>

        {activeTab === 'analyzer' ? <Analyzer /> : <Dictionary />}
      </main>

      <footer className="max-w-5xl mx-auto px-6 py-12 border-t border-slate-200 text-center text-slate-400 text-sm">
        <p>&copy; 2024 SentiOCR Tool • Built with React & FastAPI</p>
      </footer>
    </div>
  );
}

export default App;
