import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface Task {
  title: string;
  dueDate: string; // ISO date string
  priority: 'high' | 'medium' | 'low';
  notes?: string;
}

app.post('/plan', async (req, res) => {

  // console.log('POST /plan received body:', req.body);


  const { goal, horizon } = req.body as {
    goal?: string;
    horizon?: 'today' | 'week'
  };
  if (!goal || !horizon) return res.status(400).json({
    error:
      'goal and horizon are required'
  });

  const horizonText = horizon === 'today' ? 'end of today' : 'end of this week';



  try {
    
    const prompt = `Generate a structured task plan for the goal: "${goal}". Time horizon: ${horizon}.
    Return a JSON array of tasks. Each task should have:
    - title: string
    - dueDate: ISO date string (for ${horizonText})
    - priority: 'high', 'medium', or 'low'
    - notes: optional string or emoji

    Make it realistic and actionable. Output only the JSON array or an object with a 'tasks' array.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-5-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No content from OpenAI');
    }

    const parsed = JSON.parse(content);
    const plan: Task[] = Array.isArray(parsed) ? parsed : parsed.tasks || [];

    console.log('Generated plan, tasks:', plan.length);
    res.json({ tasks: plan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate plan' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
