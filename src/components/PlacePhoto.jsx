// 장소 사진 표시. Google 사진이 있으면 <img>, 없으면 카테고리 이모지로 폴백.
import { useEffect, useState } from 'react'
import { resolvePhotoName, photoUrlFromName } from '../services/googlePhotos.js'
import { categoryEmoji } from '../data/places.js'

export default function PlacePhoto({ place, px = 480, className = '', emojiClassName = 'thumb-fallback' }) {
  const [name, setName] = useState(null)
  const [err, setErr] = useState(false)

  useEffect(() => {
    let alive = true
    setName(null)
    setErr(false)
    resolvePhotoName(place).then((n) => {
      if (alive) setName(n)
    })
    return () => {
      alive = false
    }
  }, [place?.id])

  const url = name ? photoUrlFromName(name, px) : null
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
