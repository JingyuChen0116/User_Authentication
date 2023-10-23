import 'dotenv/config'
import jwt from 'jsonwebtoken'

function authToken(req, res, next) {
  const headers = req.headers
  const token = headers.authorization.split(' ')[1]
  console.log(token)

  if (!token) {
    return res.status(401).json({ code: 1, message: "No token provided."})
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ code: 2, message: 'Unauthorized.'})
    }
    console.log(decoded)
    req.username = decoded.username
    req.password = decoded.password
    req.token = token
  })
  
  next()
}

export { authToken }