// 도장(인장) SVG — 이야기터_프로토타입_최종.html의 sealSVG 이식.
import { useId } from 'react'

export default function Seal({ mark = '', size = 80 }) {
  const raw = useId()
  const id = raw.replace(/:/g, '')
  const ch = [...String(mark)].slice(0, 2)
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id={`r${id}`} x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="5" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id={`k${id}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="2" seed="7" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.96  0 0 0 0 0.93  0 0 0 0 0.88  0 0 0 -1.35 1.1" />
        </filter>
      </defs>
      <g filter={`url(#r${id})`}>
        <rect x="10" y="10" width="80" height="80" rx="10" fill="#AF3527" />
        <rect x="16" y="16" width="68" height="68" rx="6" fill="none" stroke="#FCEEE9" strokeWidth="2.3" opacity="0.9" />
        {ch.length >= 2 ? (
          <>
            <text x="50" y="41" fontFamily="'Gowun Batang',serif" fontSize="33" fontWeight="700" fill="#FCEEE9" textAnchor="middle">{ch[0]}</text>
            <text x="50" y="80" fontFamily="'Gowun Batang',serif" fontSize="33" fontWeight="700" fill="#FCEEE9" textAnchor="middle">{ch[1]}</text>
          </>
        ) : (
          <text x="50" y="64" fontFamily="'Gowun Batang',serif" fontSize="42" fontWeight="700" fill="#FCEEE9" textAnchor="middle">{ch[0] || ''}</text>
        )}
      </g>
      <rect x="10" y="10" width="80" height="80" rx="10" filter={`url(#k${id})`} opacity="0.28" />
    </svg>
  )
}
