import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// OpenAI APIクライアントの初期化
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File;
    
    if (!audioFile) {
      return NextResponse.json(
        { error: '音声ファイルが提供されていません' },
        { status: 400 }
      );
    }

    // 音声をバイナリデータに変換
    const buffer = Buffer.from(await audioFile.arrayBuffer());
    
    // OpenAI Whisper APIを使用して音声をテキストに変換
    const transcription = await openai.audio.transcriptions.create({
      file: new File([buffer], audioFile.name, { type: audioFile.type }),
      model: 'whisper-1',
      language: 'ja',
    });

    return NextResponse.json({ text: transcription.text });
  } catch (error) {
    console.error('音声認識エラー:', error);
    return NextResponse.json(
      { error: '音声認識中にエラーが発生しました' },
      { status: 500 }
    );
  }
} 