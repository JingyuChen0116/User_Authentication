import express from 'express'
import cors from 'cors'
import ip from 'ip'
import bodyParser from 'body-parser';
import 'dotenv/config';

import { login } from './src/api/login.js';
import { authToken } from './src/auth/authToken.js'
import { loginToken } from './src/api/loginToken.js'
import { register } from './src/api/register.js'

const app = express();
app.use(cors({origin: '*'}));

const jsonParser = bodyParser.json();

const port = process.env.PORT || 9090;

app.post('/api/login', jsonParser, login)
app.post('/api/loginToken', jsonParser, authToken, loginToken)
app.post('/api/register', jsonParser, register)

app.listen(port, () => {
  // console.clear();
  console.log(`Server running on port ${port}`);
  console.log(`http://${ip.address()}:${port}`);
})
