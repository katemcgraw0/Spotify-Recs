import { Configuration, OpenAIApi } from 'openai';
import { NextApiRequest, NextApiResponse } from 'next';
import { config } from 'dotenv';


const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

config();
export default async function(req, res) {
    console.log(req.body)
    const {prompt} = req.body;
  console.log(configuration.apiKey)  
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: 'OpenAI API key not configured',
      },
    });
    return;
  }
 
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.1,
      max_tokens: 100,
    });
    console.log(`request cost: ${completion.data.usage.total_tokens} tokens`);
    console.log(completion)
    res.status(200).json({ result: completion.data.choices[0].text });
    return completion.data.choices[0].text
  } 
  
  catch (error) {
    if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
      } else {
        console.log(error.message);
      }
  }
}


