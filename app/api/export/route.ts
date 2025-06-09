import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { text, format } = await req.json();
    
    if (!text) {
      return NextResponse.json(
        { error: 'テキストが提供されていません' },
        { status: 400 }
      );
    }

    if (format === 'text') {
      // テキスト形式でのエクスポート
      const buffer = Buffer.from(text, 'utf-8');
      
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Content-Disposition': 'attachment; filename=letter.txt',
        },
      });
    } else {
      return NextResponse.json(
        { error: '不正なフォーマットが指定されました' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('エクスポートエラー:', error);
    return NextResponse.json(
      { error: 'エクスポート中にエラーが発生しました' },
      { status: 500 }
    );
  }
} 