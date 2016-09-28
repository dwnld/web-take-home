const express = require('express')
const uuid = require('uuid')

const app = express()

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/assets/index.html')
})

app.use('/assets', express.static(__dirname + '/assets'))

const messages = [{
  subject: "Hi!",
  body: "something"
}, {
  subject: "And the winner is...",
  body: "Jim"
}]

const messagesWithIds = messages.map(function (msg) {
  return Object.assign({}, msg, { id: uuid.v4() })
})

app.get('/api/messages', function (req, res) {
  const resp =  messagesWithIds.map(function (msg) {
    return { id: msg.id, subject: msg.subject }
  })
  res.send(resp)
})

app.get('/api/messages/:messageId', function (req, res) {
  const message = messagesWithIds.find(function (msg) {
    return msg.id === req.params.messageId
  })
  if (message)
    res.send(message)
  else
    res.status(404).send()
})

app.listen(3000, function () {
  console.log('Server listening on port 3000')
})
