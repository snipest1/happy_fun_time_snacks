export const handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { 
      statusCode: 204, 
      headers 
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { name, company, email, phone, interest, message } = JSON.parse(event.body);

    if (!name || !email || !interest || !message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Missing required fields',
          missing: Object.entries({ name, email, interest, message })
            .filter(([_, value]) => !value)
            .map(([key]) => key)
        })
      };
    }

    // Here you could add your own logic to handle the form data
    // For now, we'll just return a success response
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        message: 'Form submitted successfully',
        data: { name, company, email, phone, interest, message }
      })
    };
  } catch (error) {
    console.error('Form submission error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to process form submission',
        details: error.message
      })
    };
  }
};