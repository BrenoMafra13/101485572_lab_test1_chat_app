const express = require('express')
const path = require('path')
const mongoose = require('mongoose')

require('dotenv').config()

const app = express()
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/chat_app'

mongoose.connect(mongoUri)

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  firstname: { type: String, required: true, trim: true },
  lastname: { type: String, required: true, trim: true },
  password: { type: String, required: true },
  createdAt: { type: String, required: true }
})

const User = mongoose.model('User', userSchema)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/view', express.static(path.join(__dirname, 'view')))
app.use('/public', express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
  res.redirect('/view/login.html')
})

app.post('/api/signup', async (req, res) => {
  try {
    const { username, firstname, lastname, password } = req.body
    if (!username || !firstname || !lastname || !password) {
      return res.status(400).json({ message: 'Please fill all the fields' })
    }
    const existing = await User.findOne({ username })
    if (existing) {
      return res.status(400).json({ message: 'User already exists' })
    }
    const createdAt = new Date().toLocaleString('en-US')
    await User.create({ username, firstname, lastname, password, createdAt })
    return res.json({ ok: true })
  } catch (err) {
    return res.status(500).json({ message: 'Signup failed' })
  }
})

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' })
    }
    const user = await User.findOne({ username, password })
    if (!user) {
      return res.status(401).json({ message: 'Credentials invalid' })
    }
    return res.json({ ok: true })
  } catch (err) {
    return res.status(500).json({ message: 'Login failed' })
  }
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
