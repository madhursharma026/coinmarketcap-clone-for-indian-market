import axios from 'axios'

export default async function handler(req, res) {
  try {
    const homepage = await axios.get('https://www.nseindia.com', {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    })

    const cookies = homepage.headers['set-cookie']
    const cookieString = cookies.map((c) => c.split(';')[0]).join('; ')

    // Delay 1 second
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const response = await axios.get(
      'https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%20500',
      {
        headers: {
          'User-Agent': 'Mozilla/5.0',
          Accept: 'application/json',
          Referer: 'https://www.nseindia.com/',
          Cookie: cookieString,
        },
      }
    )

    res.status(200).json(response.data)
  } catch (error) {
    console.error('NSE API Error:', error.message)
    res.status(500).json({ error: 'Failed to fetch NSE stock data' })
  }
}
