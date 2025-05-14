import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'

interface Joke {
  id: number
  title: string
  content: string
}


function App() {
  const [jokes, setJokes] = useState<Joke[]>([])

  useEffect(() => {
        axios.get('/api/jokes')
        .then((response) => {
          console.log(response.data)
          setJokes(response.data)
        }
      )
      .catch ((error) => {
        console.error('Error fetching jokes:', error)
      }
    )
  })
  return (
    <>
      <p>Jokes: {jokes.length}</p>
      {
        jokes.map((joke) => (
          <div key={joke.id}>
            <h2>{joke.title}</h2>
            <p>{joke.content}</p>
          </div>
        ))
      }
    </>
  )
}

export default App
