// 장소 사진 표시. Google 사진이 있으면 <img>, 없으면 카테고리 이모지로 폴백.
import { useEffect, useState } from 'react'
import { resolvePhotoUrl } from '../services/googlePhotos.js'
import { categoryEmoji } from '../data/places.js'

export default function PlacePhoto({ place, className = '', emojiClassName = 'thumb-fallback' }) {
  const [url, setUrl] = useState(null)
  const [err, setErr] = useState(false)

  useEffect(() => {
    let alive = true
    setUrl(null)
    setErr(false)
    resolvePhotoUrl(place).then((u) => {
      if (alive) setUrl(u)
    })
    return () => {
      alive = false
    }
  }, [place?.id])

  if (!url || err) {
    return <span className={emojiClassName}>{categoryEmoji(place?.category)}</span>
  }
  return (
    <img
      className={className}
      src={url}
      alt={place?.name || ''}
      loading="lazy"
      onError={() => setErr(true)}
    />
  )
}
