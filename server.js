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
}, 
  {
  subject: "And the winner is...",
  body: "Jim"
},
  {
  subject: "Re: And the winner is...  ",
  body: "Jim"
},
  { 
    subject:"Payment Protection Insurance (PPI)",
    body:"IMPORTANT - You could be entitled up to £3,160 in compensation from mis-sold PPI on a credit card or loan. Please reply PPI for info or STOP to opt out."
  },
  { 
    subject:"Quick Loans",
    body:"A [redacted] loan for £950 is approved for you if you receive this SMS. 1 min verification & cash in 1 hr at www.[redacted].co.uk to opt out reply stop"
  },
  { 
    subject:"Accident compensation",
    body:"You have still not claimed the compensation you are due for the accident you had. To start the process please reply YES. To opt out text STOP"
  },
  { 
    subject:"Debt forgiveness",
    body:"Due to a new legislation, those struggling with debt can now apply to have it written off. For more information text the word INFO or to opt out text STOP"
  },
  { 
    subject:"Pension reviews",
    body:"Our records indicate your Pension is under performing to see higher growth and up to 25% cash release reply PENSION for a free review. To opt out reply STOP"
  },
  {
    subject: "You've won a million dollars",
    body: "you just need to wire me the $1000 to process it"
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

