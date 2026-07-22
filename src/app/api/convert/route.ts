import { NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { marked } from 'marked';
import sharp from 'sharp';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const targetFormat = formData.get('targetFormat') as string;

    if (!file || !targetFormat) {
      return NextResponse.json({ error: 'Missing file or target format' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = file.name;
    const ext = fileName.split('.').pop()?.toLowerCase();
    
    const imageExtensions = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp', 'tiff'];

    // 1. Image to Image Conversion using Sharp
    if (imageExtensions.includes(ext!) && imageExtensions.includes(targetFormat)) {
      let outputBuffer: Buffer;
      
      const sharpInstance = sharp(buffer);

      switch (targetFormat) {
        case 'png': outputBuffer = await sharpInstance.png().toBuffer(); break;
        case 'jpg':
        case 'jpeg': outputBuffer = await sharpInstance.jpeg().toBuffer(); break;
        case 'webp': outputBuffer = await sharpInstance.webp().toBuffer(); break;
        case 'gif': outputBuffer = await sharpInstance.gif().toBuffer(); break;
        case 'tiff': outputBuffer = await sharpInstance.tiff().toBuffer(); break;
        default:
          return NextResponse.json({ error: 'Unsupported target format for images' }, { status: 400 });
      }

      return new NextResponse(new Uint8Array(outputBuffer), {
        headers: {
          'Content-Type': `image/${targetFormat === 'jpg' ? 'jpeg' : targetFormat}`,
          'Content-Disposition': `attachment; filename="converted_${fileName.split('.')[0]}.${targetFormat}"`,
        },
      });
    }

    // 2. Text / Markdown to PDF
    if ((ext === 'txt' || ext === 'md') && targetFormat === 'pdf') {
      let textContent = buffer.toString('utf-8');
      
      if (ext === 'md') {
         textContent = textContent.replace(/#+\s/g, '').replace(/\*\*/g, '');
      }

      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const page = pdfDoc.addPage();
      const { width, height } = page.getSize();
      const fontSize = 12;
      
      const lines = textContent.split('\n');
      let y = height - 4 * fontSize;
      
      for (const line of lines) {
        if (y < 40) break; // simple pagination skip for demo
        
        // Strip non-ASCII characters to avoid pdf-lib WinAnsi encoding errors
        const sanitizedLine = line.replace(/[^\x00-\x7F]/g, "");
        page.drawText(sanitizedLine.substring(0, 90), { x: 50, y, size: fontSize, font, color: rgb(0, 0, 0) });
        y -= fontSize * 1.5;
      }

      const pdfBytes = await pdfDoc.save();
      
      return new NextResponse(pdfBytes, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="converted_${fileName.split('.')[0]}.pdf"`,
        },
      });
    }
    
    // 3. Image to PDF
    if (imageExtensions.includes(ext!) && targetFormat === 'pdf') {
      const pdfDoc = await PDFDocument.create();
      // Ensure image is JPG or PNG for pdf-lib (convert other formats first using sharp)
      let finalImgBuffer = buffer;
      if (!['png', 'jpg', 'jpeg'].includes(ext!)) {
        finalImgBuffer = await sharp(buffer).jpeg().toBuffer();
      }

      let image;
      try {
        if (ext === 'png') {
          image = await pdfDoc.embedPng(finalImgBuffer);
        } else {
          image = await pdfDoc.embedJpg(finalImgBuffer);
        }
      } catch (e) {
        // Fallback if embedding fails
        finalImgBuffer = await sharp(buffer).jpeg().toBuffer();
        image = await pdfDoc.embedJpg(finalImgBuffer);
      }
      
      const page = pdfDoc.addPage([image.width, image.height]);
      page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });

      const pdfBytes = await pdfDoc.save();
      return new NextResponse(pdfBytes, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="converted_${fileName.split('.')[0]}.pdf"`,
        },
      });
    }

    // Default mock response for other unmatched conversions
    const mockContent = `Mock converted content for ${fileName} to ${targetFormat}.`;
    return new NextResponse(mockContent, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="converted.${targetFormat}"`,
      },
    });

  } catch (error) {
    console.error('Conversion error:', error);
    return NextResponse.json({ error: 'Conversion failed' }, { status: 500 });
  }
}
