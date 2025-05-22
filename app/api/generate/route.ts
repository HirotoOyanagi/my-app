import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// OpenAI APIクライアントの初期化
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { text, sender, recipient } = await req.json();
    
    if (!text) {
      return NextResponse.json(
        { error: 'テキストが提供されていません' },
        { status: 400 }
      );
    }

    // OpenAI API 4.5を使用して手紙文を生成
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `あなたは手紙を代筆する専門家です。入力された内容を元に、心のこもった美しい手紙文に変換してください。
          以下のポイントを守ってください：
          - 関係性によって、丁寧な言葉使いや、少し砕けた言葉遣い、様々な言葉遣いを使い分ける
          - 感情を豊かに表現
          - 読みやすく、温かみのある文体
          - 相手への思いやりを感じさせる表現を使用
          - 宛名は「${recipient}」、送り主は「${sender}」として手紙を作成してください
          - 手紙の最後には必ず送り主の名前を入れてください`
        },
        {
          role: 'user',
          content: text
        }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    return NextResponse.json({ 
      letter: completion.choices[0].message.content 
    });
  } catch (error) {
    console.error('文章生成エラー:', error);
    return NextResponse.json(
      { error: '文章生成中にエラーが発生しました' },
      { status: 500 }
    );
  }
} 