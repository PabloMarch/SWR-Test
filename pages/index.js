import { useState, useEffect } from 'react';
import axios from 'axios';
import swr from 'swr'

const getData = (query) => (
  axios.get(`https://jsonplaceholder.typicode.com/${query}`)
)

const App = () => {
  const [dataToFetch, setDataToFetch] = useState(null)
  const { data: payload, isValidating, error } = swr(dataToFetch, getData)
  const [response, setResponse] = useState(payload?.data)
  const [validating, setIsValidating] = useState(false)

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

      <p>
        <button onClick={() => setDataToFetch('posts')}>Posts</button>
        <button onClick={() => setDataToFetch('users')}>Users</button>
        <button onClick={() => setDataToFetch('comments')}>comments</button>
      </p>

      {error && <div>failed to load</div>}

      {!response && <div>loading...</div> }
      
      {response && (
        <ul>
          {response.map(
            ({ id, title, name, body, email }) => (
              <li key={id}>
                <h3>{name || title}</h3>
                <p>{body || email}</p>
              </li>
            )
          )}
        </ul>
      )}
    </>
  )
}

export default App