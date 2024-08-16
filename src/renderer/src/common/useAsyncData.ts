import { DependencyList, useCallback, useEffect, useRef, useState } from 'react'

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T

export function useAsyncDataCallback<
  T extends (...args: any[]) => Promise<any>,
  TArgs extends Parameters<T>,
  TResult extends UnwrapPromise<ReturnType<T>>
>(requestMethod: T, deps: DependencyList, defaultValue?: TResult) {
  const [data, setData] = useState<TResult | undefined>(defaultValue || undefined)
  const [isLoading, setIsLoading] = useState(false)
  const fetchingRef = useRef(false)
  const [error, setError] = useState<Error>()

  const executeRequest = useCallback(async (...params: TArgs) => {
    if (fetchingRef.current) {
      return
    }

    setIsLoading(true)
    fetchingRef.current = true

    try {
      const response = await requestMethod(...params)
      fetchingRef.current = false
      setData(response)
      setIsLoading(false)
      setError(undefined)
    } catch (e) {
      fetchingRef.current = false
      setIsLoading(false)
      setError(e as Error)
    }
  }, deps)

  return { data, setData, isLoading, error, executeRequest }
}

export function useAsyncData<T>(
  requestMethod: () => Promise<T>,
  deps: DependencyList,
  defaultValue?: T
) {
  const [isLoading, setIsLoading] = useState(true)
  const {
    data,
    setData,
    error,
    isLoading: callbackIsLoading,
    executeRequest
  } = useAsyncDataCallback(requestMethod, deps, defaultValue)

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      await executeRequest()
      setIsLoading(false)
    })()
  }, deps)

  return {
    data,
    setData,
    isLoading: isLoading || callbackIsLoading,
    error,
    executeRequest
  }
}
