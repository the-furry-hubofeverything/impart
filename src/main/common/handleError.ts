interface ImpartError {
  message: string
  stack?: string
  name?: string
}

export async function handleError<T>(func: () => Promise<T>): Promise<T | ImpartError> {
  try {
    return await func()
  } catch (e) {
    if (e instanceof Error) {
      return e
    } else if (typeof e === 'string') {
      return {
        message: e
      }
    } else {
      return {
        message: 'An unknown error has occurred'
      }
    }
  }
}
