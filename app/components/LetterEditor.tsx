"use client"

import { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';

interface LetterEditorProps {
  initialText: string;
}

export default function LetterEditor({ initialText }: LetterEditorProps) {
  const [letterText, setLetterText] = useState(initialText);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isSavingPhoto, setIsSavingPhoto] = useState(false);
  const letterDisplayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLetterText(initialText);
  }, [initialText]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLetterText(e.target.value);
  };

  const regenerateLetter = async () => {
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: letterText }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setLetterText(data.letter);
      } else {
        console.error('手紙生成エラー:', data.error);
        alert('手紙の生成に失敗しました。');
      }
    } catch (error) {
      console.error('API呼び出しエラー:', error);
      alert('サーバーとの通信に失敗しました。');
    } finally {
      setIsGenerating(false);
    }
  };

  const exportLetter = async (format: 'text' | 'pdf') => {
    setIsExporting(true);
    
    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: letterText, format }),
      });
      
      if (response.ok) {
        // レスポンスをBlobとして取得
        const blob = await response.blob();
        
        // ダウンロードリンクを作成
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `letter.${format}`;
        document.body.appendChild(a);
        a.click();
        
        // クリーンアップ
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const errorData = await response.json();
        console.error('エクスポートエラー:', errorData.error);
        alert('手紙のエクスポートに失敗しました。');
      }
    } catch (error) {
      console.error('API呼び出しエラー:', error);
      alert('サーバーとの通信に失敗しました。');
    } finally {
      setIsExporting(false);
    }
  };

  const saveAsPhoto = async () => {
    if (!letterDisplayRef.current) {
      alert('手紙の表示領域が見つかりません。');
      return;
    }

    setIsSavingPhoto(true);
    
    try {
      // ブラウザ互換性チェック
      if (!window.HTMLCanvasElement) {
        throw new Error('このブラウザは画像保存機能をサポートしていません。');
      }

      // HTML2Canvasでキャプチャ
      const canvas = await html2canvas(letterDisplayRef.current, {
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#f8e8c8', // 手紙の背景色
        width: letterDisplayRef.current.scrollWidth,
        height: letterDisplayRef.current.scrollHeight,
        scrollX: 0,
        scrollY: 0,
        x: 0,
        y: 0,
      } as any);

      // Blobに変換
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            throw new Error('画像の生成に失敗しました。');
          }

          // ダウンロード処理
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `letter_${new Date().toISOString().slice(0, 10)}.png`;
          document.body.appendChild(a);
          a.click();
          
          // クリーンアップ
          URL.revokeObjectURL(url);
          document.body.removeChild(a);
        },
        'image/png',
        1.0 // 高品質
      );
    } catch (error) {
      console.error('写真保存エラー:', error);
      const errorMessage = error instanceof Error ? error.message : '手紙の写真保存に失敗しました。';
      alert(errorMessage);
    } finally {
      setIsSavingPhoto(false);
    }
  };

  const sendEmail = async () => {
    // メール送信機能の実装
    alert('メール送信機能は現在実装中です。');
  };

  return (
    <div className="w-full max-w-md">
      <h2 className="text-2xl text-[#2d1f0e] font-medium mb-4 text-center">手紙の編集</h2>
      
      {/* 手紙表示領域（写真保存用） */}
      <div 
        ref={letterDisplayRef}
        className="letter-display mb-4 p-6 border-2 border-[#2d1f0e] rounded-md bg-[#f8e8c8] shadow-lg"
        style={{ 
          fontFamily: 'serif',
          lineHeight: '1.8',
          letterSpacing: '0.05em'
        }}
      >
        <div className="text-[#2d1f0e] whitespace-pre-wrap">
          {letterText || 'ここに手紙の内容が表示されます...'}
        </div>
      </div>
      
      <textarea
        className="w-full h-80 p-4 border-2 border-[#2d1f0e] rounded-md bg-[#f8e8c8] text-[#2d1f0e] font-serif"
        value={letterText}
        onChange={handleTextChange}
        placeholder="ここに手紙の内容を編集できます..."
      />
      
      <div className="flex flex-col gap-3 mt-4">
        <button
          className="button"
          onClick={regenerateLetter}
          disabled={isGenerating}
        >
          {isGenerating ? '生成中...' : '手紙を再生成する'}
        </button>
        
        <div className="flex gap-2">
          <button
            className="button flex-1"
            onClick={() => exportLetter('text')}
            disabled={isExporting}
          >
            テキスト保存
          </button>
          
          <button
            className="button flex-1"
            onClick={() => exportLetter('pdf')}
            disabled={isExporting}
          >
            PDF保存
          </button>
        </div>
        
        <div className="flex gap-2">
          <button
            className="button flex-1"
            onClick={saveAsPhoto}
            disabled={isSavingPhoto}
          >
            {isSavingPhoto ? '保存中...' : '写真で保存'}
          </button>
          
          <button
            className="button flex-1"
            onClick={sendEmail}
            disabled={isExporting}
          >
            メール送信
          </button>
        </div>
      </div>
    </div>
  );
} 