import { useState, useEffect } from 'react'
import axios from 'axios'
import useSWR from 'swr'

const API = 'https://jsonplaceholder.typicode.com'
const ITEMS_TO_SHOW = 10

// FETCH
const getData = (query, options) => (
  axios({
    method: 'get',
    url: `${API}/${query}`,
    ...options
  }).then(res => res.data)
)

// SWR HOOK
const useFetchCache = (key, fetchFn, ...args) => {
  const { data, error, ...rest } = useSWR(key, fetchFn)

  return { data, error, ...rest }
}

// APP
const App = () => {
  const [dataToFetch, setDataToFetch] = useState(null)
  // const [customDataToFetch, setCustomDataToFetch] = useState(0)
  const [pauseFetch, setPauseFetch] = useState(false)
  const [validating, setIsValidating] = useState(false)
  const [response, setResponse] = useState(null)
  
  const { data, isValidating, error } = useFetchCache(
    pauseFetch ? null : dataToFetch,
    getData
  )

  useEffect(
    () => {
      setResponse(null)
      if (!data) return
      setResponse(Array.isArray(data) ? data : [data])
    },
    [data, setResponse]
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
      <h2>Validating: <em>{validating.toString()}</em></h2>
      
      <button onClick={() => {
        setDataToFetch(null)
        setPauseFetch((prev) => !prev)
      }}>
        {pauseFetch ? 'Paused' : 'Running'}
      </button>

      <p>
        <button onClick={() => setDataToFetch('posts')}>Posts</button>
        <button onClick={() => setDataToFetch('users')}>Users</button>
        <button onClick={() => setDataToFetch('comments')}>Comments</button>
        <button onClick={() => setDataToFetch('photos')}>Photos</button>
      </p>

      <p>
        {'Set Custom: '}
        <input
          type="number"
          value={dataToFetch ? dataToFetch.match(/\d+/g) : 0}
          onChange={({ target: { value } }) => {
            setDataToFetch(
              () => `posts/${value > 1 ? value : 1}`
            )
          }}
        />
      </p>

      {error && (
        <p style={{ color: 'red' }}>Failed to load!</p>
      )}

      {!error && (
        <p>
          {validating
            ? <em style={{ color: 'green' }}>Loading...</em>
            : <em style={{ color: 'blue' }}>Waiting</em>
          }
        </p>
      )}
      
      {response && (
        <ul>
          {response.slice(0, ITEMS_TO_SHOW).map(
            ({ id, title, name, body, email, thumbnailUrl }) => (
              <li key={id}>
                <h3>{name || title}</h3>
                <p>{body || email || thumbnailUrl}</p>
              </li>
            )
          )}
        </ul>
      )}
    </>
  )
}

export default App