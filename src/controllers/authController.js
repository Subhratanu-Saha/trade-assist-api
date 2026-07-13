import { loginAgent as agentLoginService} from '../services/agentLoginService.js';
import { SuccessResponse } from '../utils/responses.js';

export const getAgentAuth = async (req, res) => { //handles GET requests to the /agent/auth endpoint
  try {
    return res.status(200).json(//returns a JSON response with a success message and the available methods for the endpoint
      new SuccessResponse('Agent auth endpoint', {
        methods: ['GET', 'POST'],
        user: req.user || null,
      })
    );
  } catch (error) {//catches any errors that occur during the execution of the try block and returns a JSON response with an error message and status code
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const loginAgent = async (req, res) => { //handles POST requests to the /agent/auth endpoint for agent login
  try {    //extracts the email and password from the request body
    const { email, password } = req.body;

    const agent = await agentLoginService.loginAgent(email, password);

    return res.status(200).json(
      new SuccessResponse('Login successful', {
        user: agent,
      })
    );
  } catch (error) { //catches any errors that occur during the execution of the try block and returns a JSON response with an error message and status code
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};