import jsPDF from 'jspdf';
import type { Article } from '@/lib/supabase';

export function generateNewsletterPDF(articles: Article[]): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 50;
  const contentWidth = pageWidth - margin * 2;

  // Colors
  const woodDark: [number, number, number] = [61, 43, 31];
  const woodMid: [number, number, number] = [92, 61, 46];
  const gold: [number, number, number] = [184, 134, 11];
  const goldLight: [number, number, number] = [212, 160, 23];
  const cream: [number, number, number] = [250, 246, 237];
  const ink: [number, number, number] = [44, 32, 22];

  let y = 0;

  // --- Cover Page ---
  // Wood background
  doc.setFillColor(...woodDark);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Decorative border
  doc.setDrawColor(...gold);
  doc.setLineWidth(2);
  doc.roundedRect(margin, margin, contentWidth, pageHeight - margin * 2, 8, 8, 'S');
  doc.setLineWidth(0.5);
  doc.roundedRect(margin + 8, margin + 8, contentWidth - 16, pageHeight - margin * 2 - 16, 6, 6, 'S');

  // Title
  doc.setTextColor(...goldLight);
  doc.setFont('times', 'bold');
  doc.setFontSize(48);
  doc.text('NISHTHA', pageWidth / 2, pageHeight / 2 - 80, { align: 'center' });

  // Subtitle
  doc.setFont('times', 'italic');
  doc.setFontSize(14);
  doc.setTextColor(...cream);
  doc.text('Neutrality, Integrity, Stability, Transparency,', pageWidth / 2, pageHeight / 2 - 50, {
    align: 'center',
  });
  doc.text('Honesty and Accountability', pageWidth / 2, pageHeight / 2 - 32, {
    align: 'center',
  });

  // Gold line
  doc.setDrawColor(...gold);
  doc.setLineWidth(1);
  doc.line(pageWidth / 2 - 60, pageHeight / 2 - 15, pageWidth / 2 + 60, pageHeight / 2 - 15);

  // Newsletter label
  doc.setFont('times', 'normal');
  doc.setFontSize(22);
  doc.setTextColor(...goldLight);
  doc.text('Newsletter', pageWidth / 2, pageHeight / 2 + 15, { align: 'center' });

  // Date
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(...cream);
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  doc.text(dateStr, pageWidth / 2, pageHeight / 2 + 40, { align: 'center' });

  // Tagline
  doc.setFont('times', 'italic');
  doc.setFontSize(12);
  doc.setTextColor(...cream);
  doc.text('Knowledge for Governance', pageWidth / 2, pageHeight - margin - 30, {
    align: 'center',
  });

  // --- Content Pages ---
  const featuredArticles = articles.filter((a) => a.pinned);
  const otherArticles = articles.filter((a) => !a.pinned);
  const allArticles = [...featuredArticles, ...otherArticles];

  if (allArticles.length === 0) {
    return;
  }

  // Add a new page for the first article
  doc.addPage();

  const drawPageBackground = () => {
    doc.setFillColor(...cream);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Subtle ruled lines
    doc.setDrawColor(230, 223, 200);
    doc.setLineWidth(0.3);
    for (let ly = margin + 40; ly < pageHeight - margin; ly += 26) {
      doc.line(margin + 15, ly, pageWidth - margin - 15, ly);
    }
  };

  const drawHeader = (title: string, author: string, isFeatured: boolean) => {
    // Header bar
    doc.setFillColor(...woodDark);
    doc.rect(0, 0, pageWidth, 40, 'F');

    doc.setTextColor(...goldLight);
    doc.setFont('times', 'bold');
    doc.setFontSize(10);
    doc.text('NISHTHA PUBLICATION', margin, 25);

    if (isFeatured) {
      doc.setFontSize(8);
      doc.setTextColor(...gold);
      doc.text('FEATURED', pageWidth - margin, 25, { align: 'right' });
    }

    // Article title
    y = 70;
    doc.setTextColor(...woodDark);
    doc.setFont('times', 'bold');
    doc.setFontSize(24);
    const titleLines = doc.splitTextToSize(title, contentWidth);
    doc.text(titleLines, margin, y);
    y += titleLines.length * 28;

    // Author
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...woodMid);
    doc.text(`By ${author}`, margin, y + 5);

    // Gold divider
    y += 18;
    doc.setDrawColor(...gold);
    doc.setLineWidth(1);
    doc.line(margin, y, pageWidth - margin, y);
    y += 20;
  };

  const drawFooter = (pageNum: number) => {
    doc.setDrawColor(...gold);
    doc.setLineWidth(0.5);
    doc.line(pageWidth / 2 - 20, pageHeight - 30, pageWidth / 2 + 20, pageHeight - 30);

    doc.setFont('times', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(...woodMid);
    doc.text('NISHTHA — Knowledge for Governance', pageWidth / 2, pageHeight - 20, {
      align: 'center',
    });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...woodMid);
    doc.text(`${pageNum}`, pageWidth - margin, pageHeight - 20, { align: 'right' });
  };

  let pageNum = 1;
  drawPageBackground();

  allArticles.forEach((article, idx) => {
    if (idx > 0) {
      doc.addPage();
      drawPageBackground();
      pageNum++;
    }

    drawHeader(article.heading, article.name, article.pinned);

    // Article body
    doc.setTextColor(...ink);
    doc.setFont('times', 'normal');
    doc.setFontSize(12);

    const paragraphs = article.description.split('\n').filter((p) => p.trim() !== '');
    const lineHeight = 18;
    const bottomLimit = pageHeight - margin - 30;

    for (const para of paragraphs) {
      const lines = doc.splitTextToSize(para, contentWidth - 15);
      for (const line of lines) {
        if (y > bottomLimit) {
          drawFooter(pageNum);
          doc.addPage();
          drawPageBackground();
          pageNum++;
          y = margin + 20;
        }
        doc.text(line, margin + 8, y);
        y += lineHeight;
      }
      y += 6;
    }

    // Article end ornament
    if (y < bottomLimit - 20) {
      y += 10;
      doc.setDrawColor(...gold);
      doc.setLineWidth(0.5);
      doc.line(pageWidth / 2 - 15, y, pageWidth / 2 + 15, y);
      doc.setFont('times', 'italic');
      doc.setFontSize(9);
      doc.setTextColor(...woodMid);
      doc.text('§', pageWidth / 2, y + 14, { align: 'center' });
    }

    drawFooter(pageNum);
  });

  // --- Back Page ---
  doc.addPage();
  doc.setFillColor(...woodDark);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  doc.setDrawColor(...gold);
  doc.setLineWidth(2);
  doc.roundedRect(margin, margin, contentWidth, pageHeight - margin * 2, 8, 8, 'S');

  doc.setTextColor(...goldLight);
  doc.setFont('times', 'bold');
  doc.setFontSize(28);
  doc.text('Thank You', pageWidth / 2, pageHeight / 2 - 30, { align: 'center' });

  doc.setDrawColor(...gold);
  doc.setLineWidth(0.5);
  doc.line(pageWidth / 2 - 40, pageHeight / 2 - 15, pageWidth / 2 + 40, pageHeight / 2 - 15);

  doc.setFont('times', 'italic');
  doc.setFontSize(13);
  doc.setTextColor(...cream);
  doc.text('For reading the NISHTHA Newsletter', pageWidth / 2, pageHeight / 2 + 10, {
    align: 'center',
  });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...cream);
  doc.text('Visit us for more governance insights', pageWidth / 2, pageHeight / 2 + 35, {
    align: 'center',
  });

  doc.setFont('times', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(...goldLight);
  doc.text('© NISHTHA — All rights reserved', pageWidth / 2, pageHeight - margin - 20, {
    align: 'center',
  });

  doc.save(`NISHTHA-Newsletter-${new Date().toISOString().split('T')[0]}.pdf`);
}
