import { Configuration, OpenAIApi } from 'openai'
import { config } from 'dotenv'

// Load environment variables
config()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

export default async function handler(req, res) {
  if (!configuration.apiKey) {
    return res.status(500).json({
      error: { message: 'OpenAI API key not configured' },
    })
  }

  const { prompt } = req.body
  if (!prompt) {
    return res.status(400).json({
      error: { message: 'Prompt is required' },
    })
  }

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 150,
      temperature: 1,
    })

    const assistantResponse = completion.data.choices[0]?.message?.content || ''
    console.log(`request cost: ${completion.data.usage.total_tokens} tokens`)

    return res.status(200).json({ result: assistantResponse })
  } catch (error) {
    if (error.response) {
      console.error('Error status:', error.response.status)
      console.error('Error data:', error.response.data)
      return res.status(error.response.status).json(error.response.data)
    } else {
      console.error('Request error:', error.message)
      return res.status(500).json({ error: { message: error.message } })
    }
  }
}
