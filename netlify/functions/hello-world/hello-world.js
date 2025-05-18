export const handler = async (event, context) => {
  try {
    const subject = event.queryStringParameters.name || 'World';
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Hello, ${subject}!`,
        timestamp: new Date().toISOString()
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to execute function' })
    };
  }
};