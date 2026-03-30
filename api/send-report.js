const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, userName, results } = req.body;

    if (!email || !results) {
      return res.status(400).json({ error: 'Missing email or results' });
    }

    const { data, error } = await resend.emails.send({
      from: 'Negotiate Smarter <profiles@negotiatesmarter.com>',
      to: email,
      subject: `Your Negotiation Style Profile${userName ? ` — ${userName}` : ''}`,
      html: `
        <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:40px 20px;">
          <h1 style="font-size:22px;color:#1e3a8a;">Your Negotiation Profile</h1>
          <p style="color:#555;font-size:15px;line-height:1.6;">
            ${userName ? `Hi ${userName},` : 'Hi there,'}<br><br>
            Your negotiation archetype is <strong>${results.archetype?.name || 'N/A'}</strong>.
          </p>
          <p style="color:#555;font-size:15px;line-height:1.6;">${results.archetype?.desc || ''}</p>
          <h3 style="color:#1e3a8a;">Your Style Breakdown:</h3>
          <p style="color:#555;font-size:15px;"><strong>Primary:</strong> ${results.primary || 'N/A'}</p>
          <p style="color:#555;font-size:15px;"><strong>Secondary:</strong> ${results.secondary || 'N/A'}</p>
          ${results.scores ? Object.entries(results.scores).map(([style, score]) =>
            `<p style="color:#555;font-size:14px;">${style}: ${score}/50</p>`
          ).join('') : ''}
          <hr style="margin:20px 0;" />
          <p style="color:#999;font-size:12px;">Negotiation Profiler — negotiatesmarter.com</p>
        </div>
      `,
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