import { useEffect } from 'react'
import useSWR, { mutate } from 'swr'
import useLocalStorage, { getStateFromLocalStorage } from './useLocalStorage'

// const useForceUpdate = () => useState()[1]

const useFetchCache = (key, fetchFn, options) => {
  const [storagedData, setStorageData, removeStoragedData] = useLocalStorage(key)
  const swrOptions = {
    ...options,
    onError: () => {
      removeStoragedData(key)
    },
    onSuccess: (data) => {
      console.log("onSuccess:: ", data)
      debugger
      setStorageData(data)
    }
  }

  const { response, error, ...rest } = useSWR(
    key,
    (k) => {
      debugger
      return fetchFn(k)
    },
    swrOptions
  )

  // initialize hook with localstorage data
  useEffect(
    () => {
      if (!key) return
      const data = getStateFromLocalStorage(key)
      if (data) mutate(key, data, false)
    },
    [key]
  )

  useEffect(
    () => {
      if (!storagedData) return
      debugger
    },
    [storagedData]
  )

  return { data: storagedData, error, ...rest }
}

export default useFetchCache