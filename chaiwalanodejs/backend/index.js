import express from 'express';
import cors from 'cors';
const app = express();
app.use(cors());
// app.use(express.static('dist'));
const port = 3000;

// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

app.get('/api/jokes', (req, res) => {
  const jokes = [
    { 
      id: 1, 
      title: 'kapil sharam', 
      content: "Why don't scientists trust atoms? Because they make up everything!" 
    },
    { 
      id: 2, 
      title: 'krishna', 
      content: "Why did the scarecrow win an award? Because he was outstanding in his field!" 
    },
    { 
      id: 3, 
      title: 'sunil grover', 
      content: "Why don't skeletons fight each other? They don't have the guts!" 
    },
    { 
      id: 4, 
      title: 'rajpal yadav', 
      content: "What do you call fake spaghetti? An impasta!" 
    }
  ]
  res.send(jokes);
})

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});