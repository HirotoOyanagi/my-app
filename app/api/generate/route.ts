import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// OpenAI APIクライアントの初期化
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    
    if (!text) {
      return NextResponse.json(
        { error: 'テキストが提供されていません' },
        { status: 400 }
      );
    }

    // OpenAI API 4.5を使用して手紙文を生成
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: `あなたは手紙を代筆する専門家です。入力された内容を元に、心のこもった美しい手紙文に変換してください。
          以下のポイントを守ってください：
          - 丁寧な言葉遣いと適切な敬語を使用
          - 文章の構造を整える（序文、本文、結び）
          - 感情を豊かに表現
          - 読みやすく、温かみのある文体
          - 相手への思いやりを感じさせる表現を使用`
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