import { LanguageCode } from '../types';

export class VoiceService {
  private isSynthesizing = false;

  // Web Speech Text-To-Speech (🔊 सुनें)
  public speak(text: string, lang: LanguageCode = 'hi'): void {
    if (!('speechSynthesis' in window)) {
      console.warn('Text-to-speech not supported on this browser.');
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop any active audio
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95; // Slightly slower for clarity
      utterance.pitch = 1.0;

      if (lang === 'hi') {
        utterance.lang = 'hi-IN';
      } else {
        utterance.lang = 'en-US';
      }

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis failed:', err);
    }
  }

  public stopSpeaking(): void {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  // Web Speech Recognition (🎙️ बोलकर पूछें)
  public listen(
    lang: LanguageCode,
    onResult: (transcript: string) => void,
    onError?: (err: string) => void
  ): { stop: () => void } {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      if (onError) onError('Browser Speech Recognition not supported. Please type your query.');
      return { stop: () => {} };
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0]?.[0]?.transcript;
        if (transcript) {
          onResult(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        if (onError) onError(`Speech error: ${event.error}`);
      };

      recognition.start();

      return {
        stop: () => {
          try {
            recognition.stop();
          } catch {}
        }
      };
    } catch (e: any) {
      if (onError) onError(`Recognition init error: ${e.message}`);
      return { stop: () => {} };
    }
  }
}

export const voiceService = new VoiceService();
