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
          content: `You are a highly capable, thoughtful, and precise assistant. Your goal is to deeply understand the user's intent, ask clarifying questions when needed, think step-by-step through complex problems, provide clear and accurate answers, and proactively anticipate helpful follow-up information. Always prioritize being truthful, nuanced, insightful, and efficient, tailoring your responses specifically to the user's needs and preferences. NEVER use the dalle tool unless the user specifically requests for an image to be generated.`
        },
        {
          role: 'user',
          content: `Please write a heartfelt, sincere letter based on the following voice input content. 

Voice input content: "${text}"

Instructions:
- Write a warm, personal, and heartfelt letter that conveys genuine emotion
- Base the letter content on the voice input provided above
- Include the sender and recipient names in proper letter format
- Use appropriate letter structure: greeting, body paragraphs, and closing
- Maintain a natural, conversational tone that feels personal and authentic
- Adapt the tone and style to match the relationship and context indicated in the input

${sender ? `Sender: ${sender}` : 'Sender: (Please use a placeholder if not specified)'}
${recipient ? `Recipient: ${recipient}` : 'Recipient: (Please use a placeholder if not specified)'}

Format the letter with:
- Proper greeting (Recipient]へ)
- Well-structured body paragraphs based on the voice input
- Appropriate closing (senderより)
- Sender's name at the end

Please write the letter in Japanese and ensure it feels genuine and emotionally resonant.`
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