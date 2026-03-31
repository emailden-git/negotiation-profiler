const { Resend } = require('resend');
const PDFDocument = require('pdfkit');

const resend = new Resend(process.env.RESEND_API_KEY);

function generatePDF(data) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 50, bottom: 60, left: 50, right: 50 },
      info: {
        Title: 'Negotiation Style Profile',
        Author: 'The Buckingham Academy',
      },
    });

    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const pw = doc.page.width - 100;
    const left = 50;

    const c = {
      blue: '#1E40AF',
      headerBg: '#0F172A',
      red: '#DC2626',
      purple: '#9333EA',
      green: '#16A34A',
      amber: '#D97706',
      dark: '#1F2937',
      body: '#374151',
      gray: '#6B7280',
      light: '#9CA3AF',
      rule: '#E5E7EB',
      barBg: '#F3F4F6',
    };

    const styleCol = {
      dominator: '#DC2626',
      integrator: '#9333EA',
      yielder: '#16A34A',
      calculator: '#2563EB',
    };

    const clean = (t) =>
      (t || '')
        .replace(/[\u{1F300}-\u{1FFFF}]/gu, '')
        .replace(/[\u2700-\u27BF]/g, '')
        .trim();

    const space = (needed) => {
      if (doc.y + needed > doc.page.height - 70) doc.addPage();
    };

    const rule = () => {
      space(25);
      doc.moveTo(left, doc.y).lineTo(left + pw, doc.y)
        .strokeColor(c.rule).lineWidth(0.5).stroke();
      doc.moveDown(0.8);
    };

    const heading = (text, color) => {
      space(35);
      doc.fontSize(13).font('Helvetica-Bold').fillColor(color)
        .text(text, left, doc.y, { width: pw });
      doc.moveDown(0.4);
    };

    const body = (text) => {
      doc.fontSize(9.5).font('Helvetica').fillColor(c.body)
        .text(clean(text), left, doc.y, { width: pw, lineGap: 3 });
      doc.moveDown(0.8);
    };

    // ──────── HEADER BAR ────────
    doc.rect(0, 0, doc.page.width, 95).fill(c.headerBg);
    doc.fontSize(7.5).font('Helvetica').fillColor('#64748B')
      .text('THE BUCKINGHAM ACADEMY', left, 22, { width: pw, align: 'center', characterSpacing: 4 });
    doc.fontSize(20).font('Helvetica-Bold').fillColor('white')
      .text('Negotiation Style Profile', left, 40, { width: pw, align: 'center' });
    if (data.userName) {
      doc.fontSize(9).font('Helvetica').fillColor('#94A3B8')
        .text('Prepared for ' + data.userName, left, 68, { width: pw, align: 'center' });
    }

    doc.y = 115;

    // ──────── ARCHETYPE ────────
    doc.fontSize(8).font('Helvetica').fillColor(c.light)
      .text('YOUR NEGOTIATION ARCHETYPE', left, doc.y, { width: pw, align: 'center', characterSpacing: 2 });
    doc.moveDown(0.4);
    doc.fontSize(22).font('Helvetica-Bold').fillColor(c.blue)
      .text(data.archetype.name || '', left, doc.y, { width: pw, align: 'center' });
    if (data.archetype.tagline) {
      doc.moveDown(0.2);
      doc.fontSize(10).font('Helvetica-Oblique').fillColor(c.gray)
        .text(data.archetype.tagline, left, doc.y, { width: pw, align: 'center' });
    }
    doc.moveDown(0.6);

    // Primary / Secondary labels
    const pLabel = data.styleMeta?.[data.primary]?.label || data.primary;
    const sLabel = data.styleMeta?.[data.secondary]?.label || data.secondary;
    const pCol = styleCol[data.primary] || c.blue;
    const sCol = styleCol[data.secondary] || c.gray;

    const tagY = doc.y;
    doc.fontSize(9).font('Helvetica-Bold').fillColor(pCol)
      .text('Primary: ' + pLabel, left, tagY, { width: pw / 2, align: 'center' });
    doc.fontSize(9).font('Helvetica-Bold').fillColor(sCol)
      .text('Secondary: ' + sLabel, left + pw / 2, tagY, { width: pw / 2, align: 'center' });
    doc.y = tagY + 18;
    doc.moveDown(1);

    // ──────── SCORE BARS ────────
    rule();
    doc.fontSize(8).font('Helvetica').fillColor(c.light)
      .text('STYLE DISTRIBUTION', left, doc.y, { width: pw, align: 'center', characterSpacing: 2 });
    doc.moveDown(0.8);

    const total = 16;
    ['dominator', 'integrator', 'yielder', 'calculator'].forEach((style) => {
      const score = data.scores?.[style] || 0;
      const pct = Math.round((score / total) * 100);
      const col = styleCol[style];
      const label = data.styleMeta?.[style]?.label || style;

      const y = doc.y;
      doc.fontSize(9).font('Helvetica-Bold').fillColor(col).text(label, left, y);
      doc.fontSize(9).font('Helvetica-Bold').fillColor(col)
        .text(pct + '%', left + pw - 35, y, { width: 35, align: 'right' });
      doc.roundedRect(left, y + 15, pw, 6, 3).fill(c.barBg);
      const bw = Math.max((pct / 100) * pw, 3);
      doc.roundedRect(left, y + 15, bw, 6, 3).fill(col);
      doc.y = y + 30;
    });

    doc.moveDown(0.6);

    // ──────── NARRATIVE ────────
    rule();
    heading('Your Archetype: ' + (data.archetype.name || ''), c.blue);
    body(data.archetype.narrative);

    // ──────── PRIMARY STYLE ────────
    rule();
    heading('Primary Style: ' + pLabel, pCol);
    body(data.primaryDesc);

    // ──────── SECONDARY STYLE ────────
    rule();
    heading('Secondary Influence: ' + sLabel, sCol);
    body(data.secondaryDesc);

    // ──────── HOW OTHERS SEE YOU ────────
    rule();
    heading('How Others Experience You', c.blue);
    body(data.archetype.howOthersSeeYou);

    // ──────── STRENGTHS ────────
    rule();
    heading('Your Strengths', c.green);
    (data.archetype.strengths || '').split('. ').filter((s) => s.trim().length > 10).forEach((s) => {
      space(20);
      doc.fontSize(9.5).font('Helvetica').fillColor(c.body)
        .text('  +   ' + s.trim().replace(/\.$/, '') + '.', left, doc.y, { width: pw, lineGap: 2 });
      doc.moveDown(0.25);
    });
    doc.moveDown(0.5);

    // ──────── WEAKNESSES ────────
    rule();
    heading('Your Weaknesses', c.red);
    (data.archetype.weaknesses || '').split('. ').filter((s) => s.trim().length > 10).forEach((s) => {
      space(20);
      doc.fontSize(9.5).font('Helvetica').fillColor(c.body)
        .text('  -   ' + s.trim().replace(/\.$/, '') + '.', left, doc.y, { width: pw, lineGap: 2 });
      doc.moveDown(0.25);
    });
    doc.moveDown(0.5);

    // ──────── BLIND SPOTS ────────
    rule();
    heading('Your Blind Spots', c.purple);
    body(data.archetype.blindSpots);

    // ──────── UNDER PRESSURE ────────
    rule();
    heading('Under Pressure', c.amber);
    body(data.archetype.underPressure);

    // ──────── WATCH OUT ────────
    rule();
    heading('Watch Out', c.red);
    body(data.archetype.watchOut);

    // ──────── GROWTH EDGE ────────
    rule();
    heading('Your Growth Edge', c.green);
    body(data.archetype.growthEdge);

    if (data.archetype.growthSteps && data.archetype.growthSteps.length > 0) {
      data.archetype.growthSteps.forEach((step, i) => {
        space(30);
        doc.fontSize(9.5).font('Helvetica-Bold').fillColor(c.green)
          .text((i + 1) + '.', left + 8, doc.y, { continued: true });
        doc.font('Helvetica').fillColor(c.body)
          .text('  ' + step, { width: pw - 25, lineGap: 2 });
        doc.moveDown(0.4);
      });
      doc.moveDown(0.5);
    }

    // ──────── SHADOW ASSESSMENT ────────
    if (data.shadowLevel) {
      rule();
      const shMap = { green: c.green, yellow: '#CA8A04', amber: c.amber, red: c.red };
      const shCol = shMap[data.shadowLevel.color] || c.gray;
      heading('Shadow Assessment: ' + (data.shadowLevel.title || ''), shCol);
      doc.fontSize(10).font('Helvetica-Bold').fillColor(shCol)
        .text(data.shadowLevel.sub || '', left, doc.y, { width: pw });
      doc.moveDown(0.4);
      body(data.shadowLevel.msg);
    }

    // ──────── FOOTER ────────
    space(50);
    rule();
    doc.fontSize(7.5).font('Helvetica').fillColor(c.light)
      .text('(c) 2026 The Buckingham Academy Limited. All rights reserved.', left, doc.y, { width: pw, align: 'center' });
    doc.moveDown(0.3);
    doc.text('To book a custom negotiation programme: admin@bucademy.com', { width: pw, align: 'center' });

    doc.end();
  });
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      email, userName, scores, shadow, primary, secondary,
      archetype, primaryDesc, secondaryDesc, shadowLevel, styleMeta,
    } = req.body;

    if (!email || !archetype) {
      return res.status(400).json({ error: 'Missing email or results' });
    }

    const pdfBuffer = await generatePDF({
      userName, scores, shadow, primary, secondary,
      archetype, primaryDesc, secondaryDesc, shadowLevel, styleMeta,
    });

    const { data, error } = await resend.emails.send({
      from: 'Negotiate Smarter <profiles@negotiatesmarter.com>',
      to: email,
      subject: 'Your Negotiation Style Profile' + (userName ? ' — ' + userName : ''),
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:40px 20px;">
          <h1 style="font-size:20px;color:#1e3a8a;margin-bottom:16px;">Your Negotiation Profile</h1>
          <p style="color:#555;font-size:15px;line-height:1.7;">
            ${userName ? 'Hi ' + userName + ',' : 'Hi there,'}<br><br>
            Your negotiation archetype is <strong>${archetype.name || 'N/A'}</strong>.<br><br>
            Your full personalised report is attached as a PDF.
          </p>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
          <p style="color:#999;font-size:11px;">The Buckingham Academy</p>
        </div>
      `,
      attachments: [
        {
          filename: 'Negotiation-Profile' + (userName ? '-' + userName : '') + '.pdf',
          content: pdfBuffer,
        },
      ],
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true, id: data.id });
  } catch (err) {
    console.error('API error:', err);
    return res.status(500).json({ error: 'Failed to send email' });
  }
};