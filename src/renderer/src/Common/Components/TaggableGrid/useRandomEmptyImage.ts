import { useLocalStorage } from '@renderer/Common/Hooks/useLocalStorage'
import { useState, useEffect } from 'react'
import { emptyImages, secretImage } from './EmptyImages'

function getRandomEmptyImage(allowSecret?: boolean) {
  if (allowSecret && Math.random() < 1 / (emptyImages.length + 1) / 100) {
    return secretImage
  }

  return emptyImages[Math.floor(Math.random() * emptyImages.length)]
}

const VIEWED_EMPTY_COUNT_KEY = 'viewedEmptyCount'

export function useRandomEmptyImage(taggableCount: number) {
  const [viewedEmptyCount, setViewedEmptyCount] = useLocalStorage(VIEWED_EMPTY_COUNT_KEY, 0)
  const allowSecret = viewedEmptyCount > 100

  const [emptyImage, setEmptyImage] = useState(getRandomEmptyImage(allowSecret))

  useEffect(() => {
    //To prevent flickering, we only change the image if there ARE taggables
    // rather than if there aren't
    if (taggableCount > 0) {
      setEmptyImage(getRandomEmptyImage(allowSecret))
    } else {
      setViewedEmptyCount((count) => count + 1)
    }
  }, [taggableCount, allowSecret])

  return emptyImage
}
