import axios from 'axios'
import 'dotenv/config'
import bcrypt from 'bcrypt'
import { usersDBPath, bcryptDBPath } from '../utils/dataPath.js'

async function register(req, res) {
  try {
    const users = await getUsers() // Get users from database
    
    // check if username and password are valid
    const user = users.find(user => user.username === req.body.username)
    if (user) {
      // if username exists
      return res.status(409).json({message: 'Already have the same username', code: "1", username: req.body.username})
    } else if (!req.body.password) {
      // if password is empty
      return res.status(409).json({message: 'Password is empty', code: "2", username: req.body.username})
    } else {
      const saltRounds = await getSalt() // get salt
      const hash = await bcrypt.hash(req.body.password + "", saltRounds)

      await axios.post(usersDBPath, {
        username: req.body.username,
        password: hash
      })

      res.status(200).send({message: 'Register success', code: "0", username: req.body.username})
    }

  } catch (err) {
    console.log(err)
  }
}

async function getUsers() {
  const getUsers = await axios.get(usersDBPath)
  const users = getUsers.data
  return users
}

async function getSalt() {
  const getSaltRounds = await axios.get(bcryptDBPath)
  const saltRounds = getSaltRounds.data.saltRound
  return saltRounds
}

export { register }