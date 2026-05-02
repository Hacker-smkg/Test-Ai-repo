import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Activity } from 'lucide-react';
import api from '../api';
import type { AnalyzeResponse } from '../types';

export default function Analyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
    setResult(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: { 'image/*': ['.jpeg', '.jpg', '.png'] },
    multiple: false
  });

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const { data } = await api.post<AnalyzeResponse>('/api/analyze', formData);
      setResult(data);
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Upload className="w-5 h-5 text-blue-500" />
          Upload Image
        </h2>
        
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'}`}
        >
          <input {...getInputProps()} />
          {file ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <p className="font-medium text-slate-700">{file.name}</p>
              <p className="text-sm text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-slate-600 font-medium">Drag & drop your handwritten image here</p>
              <p className="text-sm text-slate-400">Supports PNG, JPG, JPEG</p>
            </div>
          )}
        </div>

        {file && (
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Activity className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze Sentiment'
            )}
          </button>
        )}
      </div>

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-4">Extracted Text</h3>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 min-h-[100px] text-slate-700 leading-relaxed italic">
              "{result.extracted_text || 'No text found in image.'}"
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-4">Sentiment Result</h3>
            <div className="flex flex-col items-center justify-center h-full gap-4 pb-4">
              <div className={`text-4xl font-bold px-6 py-2 rounded-full 
                ${result.sentiment === 'Positive' ? 'text-green-600 bg-green-50' : 
                  result.sentiment === 'Negative' ? 'text-red-600 bg-red-50' : 'text-slate-600 bg-slate-50'}`}>
                {result.sentiment}
              </div>
              <div className="w-full max-w-[200px]">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Score</span>
                  <span>{result.sentiment_score.toFixed(2)}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 
                      ${result.sentiment === 'Positive' ? 'bg-green-500' : 
                        result.sentiment === 'Negative' ? 'bg-red-500' : 'bg-slate-400'}`}
                    style={{ width: `${Math.min(Math.max((result.sentiment_score + 1) * 50, 0), 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
