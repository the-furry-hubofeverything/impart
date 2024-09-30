import { DependencyList, useCallback, useEffect, useRef, useState } from 'react'

type AsyncCall<Params extends any[], Result> = (...params: Params) => Promise<Result>

export function useImpartIpcCall<Params extends any[], Result>(
  call: AsyncCall<Params, Result>,
  deps: DependencyList
) {
  const [isLoading, setLoading] = useState(false)
  const callIpc = useCallback(async (...params: Params) => {
    setLoading(true)
    const result = await call(...params)
    setLoading(false)

    return result
  }, deps)

  return { callIpc, isLoading }
}

export function useImpartIpcData<Result>(call: AsyncCall<[], Result>, deps: DependencyList) {
  const [data, setData] = useState<Result>()

  //This needs its own loading state since it gets initialized to true instead of false
  const [isLoading, setLoading] = useState(true)
  const { callIpc, isLoading: _discarded, ...everythingElse } = useImpartIpcCall(call, deps)

  const requestIdRef = useRef(0)

  const loadData = useCallback(async () => {
    requestIdRef.current++
    const requestId = requestIdRef.current
    setLoading(true)
    const result = await callIpc()

    if (requestId === requestIdRef.current) {
      setLoading(false)
      setData(result)
    }
  }, [callIpc])

  useEffect(() => {
    loadData()
  }, [loadData])

  return { data, isLoading, reload: loadData, ...everythingElse }
}
