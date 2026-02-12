const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function sendMessage(message, history = []) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message,
        history
      })
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export async function getChartData(symbol, period = '3mo', interval = '1d') {
  try {
    const url = new URL(`${API_BASE_URL}/api/chart/${symbol}`);
    url.searchParams.append('period', period);
    url.searchParams.append('interval', interval);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Chart API Error:', error);
    throw error;
  }
}

export async function getQuote(symbol) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/quote/${symbol}`);

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Quote API Error:', error);
    throw error;
  }
}

export async function getMultipleQuotes(symbols) {
  try {
    const quotes = await Promise.all(
      symbols.map((symbol) => getQuote(symbol).catch((err) => ({ symbol, error: err.message })))
    );
    return quotes;
  } catch (error) {
    console.error('Multiple Quotes API Error:', error);
    throw error;
  }
}
