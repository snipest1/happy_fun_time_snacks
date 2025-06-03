import FormData from 'form-data';
import Mailgun from 'mailgun.js';
import { createClient } from '@supabase/supabase-js';

console.log("🚀 Function hit: test-email");
console.log("🔒 ENV CHECK", {
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_KEY: !!process.env.SUPABASE_ANON_KEY,
  MAILGUN: !!process.env.MAILGUN_API_KEY,
});


const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export const handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers };
  }

  try {
    console.log("📥 Function invoked");
    const formData = JSON.parse(event.body || '{}');
    const { name, email, company, phone, interest, message } = formData;
    console.log("🧾 Form Data:", formData);

    if (!name || !email || !message) {
      console.warn("⚠️ Missing required fields");
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    // ✅ SUPABASE
    const { error: supabaseError, data: supabaseData } = await supabase
      .from('contact_submissions')
      .insert([{ name, email, company, phone, interest, message }]);

    if (supabaseError) {
      console.error("❌ Supabase insert failed:", supabaseError);
      throw new Error("Supabase insert error: " + supabaseError.message);
    } else {
      console.log("✅ Supabase insert succeeded:", supabaseData);
    }

    // ✅ MAILGUN
    const mailgun = new Mailgun(FormData);
    const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY });

    const mailResponse = await mg.messages.create(process.env.MAILGUN_DOMAIN, {
      from: process.env.FROM_EMAIL,
      to: process.env.TO_EMAIL,
      subject: 'New Contact Form Submission',
      text: `
New Contact Form Submission:

Name: ${name}
Email: ${email}
Company: ${company || 'N/A'}
Phone: ${phone || 'N/A'}
Interest: ${interest || 'N/A'}

Message:
${message}
      `,
    });

    console.log("📧 Mailgun response:", mailResponse);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Contact form submitted successfully',
        id: mailResponse.id || 'no-mailgun-id',
      }),
    };

  } catch (err) {
    console.error("🔥 Function error:", err.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
