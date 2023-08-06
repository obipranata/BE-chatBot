// vercel.json

{
  "version": 2,
  "builds": [
   {
       "src": "./index.js",
       "use": "@vercel/node"
   }
  ],
  "routes": [
   {
       "src": "/(.*)",
       "dest": "/"
   }
  ]
}
// defining the server port
const port = 5002

// initializing installed dependencies
const express = require('express')
require('dotenv').config()
const app = express()
const cors = require('cors')

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const CHAT_API_URL = 'https://api.openai.com/v1/chat/completions';


app.use(cors())

// listening for port 5000
app.listen(port, ()=> console.log(`Server is running on ${port}` ))

// API request
app.get('/', (req,res)=>{  

    const fetchData = async () => {
      const data = await fetch(CHAT_API_URL,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          "Access-Control-Allow-Origin": "https://obipranata.github.io/obito-chatBot/",
        },
        body: JSON.stringify({
            messages: [
              {
                role: "system",
                content: "You are a helpful assistant."
              }, 
              {
                role: "system",
                content: "Only answer in 50 words or less."
              }, 
              {
                role: "user",
                content: req.query.question
              }
            ],
            model: 'gpt-3.5-turbo'
        })
      });

      // convert the data to json
      const response = await data.json();
      const { choices } = response;
      const { message } = choices.pop();
      const { role, content } = message;
    
      const answer = role === "assistant" ? content : null;
      res.json(answer);

    }
  
    // call the function
    fetchData()
      .catch(console.error);;

})
