import express from 'express';
import dialogflow from '@google-cloud/dialogflow';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Create a new session client
const sessionClient = new dialogflow.SessionsClient();
const projectId = process.env.DIALOGFLOW_PROJECT_ID;

router.post('/message', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // A unique identifier for the given session
    const sessionId = uuidv4();

    // Create a new session
    const sessionPath = sessionClient.projectAgentSessionPath(
      projectId,
      sessionId
    );

    // The text query request
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: message,
          languageCode: 'en-US',
        },
      },
    };

    // Send request and log result
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;

    res.json({
      message: result.fulfillmentText,
      intent: result.intent.displayName,
      confidence: result.intentDetectionConfidence,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Dialogflow Error:', error);
    res.status(500).json({ 
      message: 'Failed to process message',
      error: error.message 
    });
  }
});

export default router;