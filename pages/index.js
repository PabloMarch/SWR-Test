import { useState, useEffect } from 'react';
import axios from 'axios';
import swr from 'swr'

const getData = (query) => (
  axios.get(`https://jsonplaceholder.typicode.com/${query}`)
)

const App = () => {
  const { data: payload, isValidating, error } = swr('posts', getData)
  const [validating, setIsValidating] = useState(false)
  const [response, setResponse] = useState(payload?.data)

  useEffect(
    () => {
      if (!payload) return
      setResponse(payload.data)
    },
    [payload, setResponse]
  )

  useEffect(
    () => {
      setIsValidating(isValidating)
    },
    [isValidating, setIsValidating]
  )

  return (
    <>
      <h1>SWR TEST</h1>
      <h2>Validating: {validating.toString()}</h2>

      {error && <div>failed to load</div>}

      {!response && <div>loading...</div> }
      
      {response && (
        <ul>
          {response.map(
            ({ id, title, body }) => (
              <li key={id}>
                <h3>{title}</h3>
                <p>{body}</p>
              </li>
            )
          )}
        </ul>
      )}
    </>
  )
}

export default App