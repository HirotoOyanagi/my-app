"use client"

import { useState, useRef, useEffect } from 'react';

interface VoiceInputProps {
  onTranscriptionComplete: (text: string) => void;
}

export default function VoiceInput({ onTranscriptionComplete }: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 録音時間の更新
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording, isPaused]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        sendAudioForTranscription(audioBlob);
        
        // トラックの停止
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);
    } catch (error) {
      console.error('音声録音の開始に失敗しました:', error);
      alert('マイクへのアクセスが許可されていません。設定から許可してください。');
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (!isPaused) {
        mediaRecorderRef.current.pause();
        setIsPaused(true);
      } else {
        mediaRecorderRef.current.resume();
        setIsPaused(false);
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
    }
  };

  const sendAudioForTranscription = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (response.ok) {
        onTranscriptionComplete(data.text);
      } else {
        console.error('文字起こしエラー:', data.error);
        alert('音声の文字起こしに失敗しました。');
      }
    } catch (error) {
      console.error('音声の送信に失敗しました:', error);
      alert('サーバーとの通信に失敗しました。');
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      {isRecording ? (
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center mb-4">
            <div className={`w-4 h-4 rounded-full mr-2 ${isPaused ? 'bg-yellow-500' : 'bg-red-500 animate-pulse'}`}></div>
            <p className="text-[#2d1f0e] text-xl">{isPaused ? '一時停止中' : '録音中'} - {formatTime(recordingTime)}</p>
          </div>
          
          <div className="flex gap-4 w-full">
            <button
              className="button flex-1"
              onClick={pauseRecording}
            >
              {isPaused ? '再開' : '一時停止'}
            </button>
            
            <button
              className="button flex-1"
              onClick={stopRecording}
            >
              録音終了
            </button>
          </div>
        </div>
      ) : (
        <button
          className="button"
          onClick={startRecording}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-[#2d1f0e]"
          >
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
            <line x1="12" x2="12" y1="19" y2="22"></line>
          </svg>
          <span>音声入力をはじめる</span>
        </button>
      )}
    </div>
  );
} 