import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { yieldPredictionEngine } from '../../services/yieldPredictionEngine';
import { cropEconomicsEngine } from '../../services/cropEconomicsEngine';
import { googleAiService } from '../../services/googleAiService';
import { Breadcrumbs } from '../ui/Breadcrumbs';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Bot, Mic, Send, Volume2, Sparkles, User, RefreshCw } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const AgroGPT: React.FC = () => {
  const { selectedFarm, weatherData, soilData, satelliteData, healthBreakdown, language } = useApp();
  const [inputQuery, setInputQuery] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);

  const obs = satelliteData[0] || { ndvi: 0.71 };

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    setMessages([
      {
        id: `welcome-${selectedFarm.id}`,
        sender: 'ai',
        text: `Namaste ${selectedFarm.name}! I am AgroGPT, your context-aware agricultural assistant. I have loaded your farm profile for ${selectedFarm.location} (${selectedFarm.crop}). Latest Sentinel-2 NDVI: ${obs.ndvi}, Weather: ${weatherData.rainProbability}% rain chance, Soil pH: ${soilData.ph}. How can I assist your field decisions today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [selectedFarm.id]);

  const quickPrompts = [
    "Should I irrigate today?",
    "When will my harvest be ready? (Yield Forecast)",
    "Which crop should I plant for maximum profit?",
    "What is my crop yield risk & harvest window?",
    "How is my data protected for cross-border research?"
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');

    // Compute live intelligence models
    const yieldResult = yieldPredictionEngine.predictYield(selectedFarm, soilData, weatherData, obs);
    const economicsResult = cropEconomicsEngine.calculateCropEconomics(selectedFarm, soilData, weatherData, 'IN');

    // Query Google AI service for grounded response
    const aiReply = await googleAiService.processFarmerQuery(query, selectedFarm, yieldResult, economicsResult, language);

    const aiMsg: ChatMessage = {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text: aiReply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, aiMsg]);
  };

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-US';
      
      setIsListening(true);
      recognition.start();

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputQuery(transcript);
        setIsListening(false);
        handleSend(transcript);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
    } else {
      alert("Browser Speech Recognition API unavailable. Please type your query.");
    }
  };

  const handleTextToSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs items={[{ label: 'Farm Dashboard', view: 'overview' }, { label: 'AgroGPT Assistant' }]} />

      {/* Header Banner */}
      <div className="bg-[#111a14] border border-[#23362a] rounded-2xl p-5 lg:p-6 shadow-xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
              <span>AgroGPT Voice Assistant</span>
              <Badge variant="success">Farm Context Active</Badge>
            </h1>
            <p className="text-xs text-gray-400">
              Context-aware LLM grounded in {selectedFarm.name}'s real-time satellite, soil, & weather state.
            </p>
          </div>
        </div>
      </div>

      {/* Chat Messages Container */}
      <Card className="h-[460px] flex flex-col justify-between" bodyClassName="flex flex-col justify-between h-full p-4">
        <div className="space-y-3 overflow-y-auto pr-2 flex-1">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start space-x-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-xl p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed space-y-1 ${
                m.sender === 'user'
                  ? 'bg-emerald-600 text-white font-medium rounded-tr-none'
                  : 'bg-[#18261e] border border-[#294233] text-gray-200 rounded-tl-none'
              }`}>
                <div>{m.text}</div>
                <div className="flex items-center justify-between text-[10px] opacity-70 pt-1">
                  <span>{m.timestamp}</span>
                  {m.sender === 'ai' && (
                    <button
                      onClick={() => handleTextToSpeech(m.text)}
                      className="hover:text-emerald-300 transition-colors flex items-center gap-1"
                      title="Listen to audio response"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Listen</span>
                    </button>
                  )}
                </div>
              </div>

              {m.sender === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0 font-bold text-xs">
                  {selectedFarm.name.substring(0, 2).toUpperCase()}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Prompts & Controls */}
        <div className="pt-2 border-t border-[#23362a]">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(qp)}
                className="whitespace-nowrap px-3 py-1.5 rounded-lg bg-[#18261e] hover:bg-[#203328] border border-[#294233] text-emerald-300 text-xs font-medium transition-colors shrink-0"
              >
                {qp}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2 mt-2">
            <button
              onClick={handleVoiceInput}
              className={`p-3 rounded-xl border transition-colors flex items-center justify-center ${
                isListening 
                  ? 'bg-red-600 text-white animate-pulse border-red-500' 
                  : 'bg-[#18261e] border-[#294233] text-emerald-400 hover:bg-[#203328]'
              }`}
              title="Voice Input"
            >
              <Mic className="w-5 h-5" />
            </button>

            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={`Ask AgroGPT anything about ${selectedFarm.name}...`}
              className="flex-1 bg-[#18261e] border border-[#294233] rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
            />

            <Button size="md" onClick={() => handleSend()} icon={Send} variant="primary">
              Send
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
