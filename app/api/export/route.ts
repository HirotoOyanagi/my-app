import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

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
    } else if (format === 'pdf') {
      // PDF形式でのエクスポート
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595.28, 841.89]); // A4サイズ
      
      // フォントの設定
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      
      // テキストの描画
      const fontSize = 12;
      const lineHeight = fontSize * 1.5;
      const margin = 50;
      const maxWidth = page.getWidth() - margin * 2;
      
      // テキストを行に分割
      const words = text.split(' ');
      let lines = [];
      let currentLine = '';
      
      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const width = font.widthOfTextAtSize(testLine, fontSize);
        
        if (width > maxWidth) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      
      if (currentLine) {
        lines.push(currentLine);
      }
      
      // 行ごとにテキストを描画
      lines.forEach((line, index) => {
        page.drawText(line, {
          x: margin,
          y: page.getHeight() - margin - lineHeight * index,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
        });
      });
      
      // PDFをバイナリデータに変換
      const pdfBytes = await pdfDoc.save();
      
      return new NextResponse(pdfBytes, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename=letter.pdf',
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