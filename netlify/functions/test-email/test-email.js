import FormData from 'form-data';
import Mailgun from 'mailgun.js';

export const handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers };
  }

  try {
    if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN || !process.env.TO_EMAIL || !process.env.FROM_EMAIL) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Missing Mailgun configuration' })
      };
    }

    const formData = JSON.parse(event.body || '{}');
    const { name, email, company, phone, interest, message } = formData;

    if (!name || !email || !message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    const mailgun = new Mailgun(FormData);
    const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY });

    const emailContent = `
New Contact Form Submission:

Name: ${name}
Email: ${email}
Company: ${company || 'N/A'}
Phone: ${phone || 'N/A'}
Interest: ${interest || 'N/A'}

Message:
${message}
    `;

    const response = await mg.messages.create(process.env.MAILGUN_DOMAIN, {
      from: process.env.FROM_EMAIL,
      to: process.env.TO_EMAIL,
      subject: 'New Contact Form Submission',
      text: emailContent,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Contact form submitted successfully', id: response.id })
    };

  } catch (error) {
    console.error('Error sending dynamic email:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to send email', details: error.message })
    };
  }
};
