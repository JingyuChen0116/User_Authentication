import axios from 'axios';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { usersDBPath } from '../utils/dataPath.js';

async function loginToken(req, res) {
  // const { username, password } = req.body
  const username = req.username
  const password = req.password
  const token = req.token

  console.log(username, password)

  // 如果用path.join，http://中的一个/会被吞掉
  const userDatabasePath = process.env.DB_PATH + '/user'

  const users = await axios.get(userDatabasePath).then(res => res.data).catch(err => {
    // console.log(err)
  })

  if (!(users && Array.isArray(users) && users.length > 0)) {
    res.status(500).json({message: 'No Users Found', code: 2 });
  } else {
    const user = users.find(user => user.username === username && user.password === password && user.token && user.token === token);
    if (!user) {
      res.status(401).json({ message: 'Invalid Credentials', code: 1 });
    } else {

      const userTokenInfo = {
        username,
        password: user.password,
        date: new Date()
      }
      const token = jwt.sign(userTokenInfo, process.env.ACCESS_TOKEN_SECRET)
      await axios.put(usersDBPath + '/' + user.id, {'username': username, 'password': user.password, 'token': token})
      res.status(200).json({ message: 'Login Successfully', code: 0, token, username });
    }
  }
  
}

export { loginToken }