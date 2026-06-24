// 마스코트 "터울" — 갓 쓴 동그란 캐릭터. (이야기터_프로토타입_최종.html의 mascot SVG 이식)
import { useId } from 'react'

export default function Mascot({ size = 104 }) {
  const raw = useId()
  const id = raw.replace(/[:]/g, '')
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="마스코트 터울"
    >
      <defs>
        <radialGradient id={`b${id}`} cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#FFFDF6" />
          <stop offset="52%" stopColor="#F7EEDA" />
          <stop offset="100%" stopColor="#E7D2AC" />
        </radialGradient>
        <linearGradient id={`h${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4A4946" />
          <stop offset="100%" stopColor="#191919" />
        </linearGradient>
        <radialGradient id={`c${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F4A98F" />
          <stop offset="100%" stopColor="#EC8167" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="60" cy="107" rx="30" ry="6" fill="#3a2c22" opacity="0.12" />
      <ellipse cx="27" cy="74" rx="7" ry="9" fill="#F0DDB8" transform="rotate(-18 27 74)" />
      <ellipse cx="93" cy="74" rx="7" ry="9" fill="#F0DDB8" transform="rotate(18 93 74)" />
      <ellipse cx="60" cy="67" rx="38" ry="36" fill={`url(#b${id})`} stroke="#E2CDA4" strokeWidth="1.4" />
      <ellipse cx="46" cy="50" rx="15" ry="10" fill="#FFFFFF" opacity="0.5" />
      <path d="M43 95 Q60 105 77 95 L73 101 Q60 108 47 101 Z" fill="#FFFFFF" opacity="0.95" />
      <path d="M49 99 L60 105 L71 99" fill="none" stroke="#C24632" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="39" cy="71" r="9.5" fill={`url(#c${id})`} />
      <circle cx="81" cy="71" r="9.5" fill={`url(#c${id})`} />
      <ellipse cx="49" cy="63" rx="5.4" ry="6.7" fill="#3A2C22" />
      <ellipse cx="71" cy="63" rx="5.4" ry="6.7" fill="#3A2C22" />
      <circle cx="50.9" cy="60.4" r="1.9" fill="#fff" />
      <circle cx="72.9" cy="60.4" r="1.9" fill="#fff" />
      <circle cx="47.4" cy="65" r="1" fill="#fff" opacity="0.85" />
      <circle cx="69.4" cy="65" r="1" fill="#fff" opacity="0.85" />
      <path d="M53 73 Q60 79.5 67 73" stroke="#3A2C22" strokeWidth="2.7" fill="none" strokeLinecap="round" />
      <path d="M40 36 Q39 50 43 60" stroke="#222" strokeWidth="1.7" fill="none" opacity="0.55" />
      <path d="M80 36 Q81 50 77 60" stroke="#222" strokeWidth="1.7" fill="none" opacity="0.55" />
      <ellipse cx="60" cy="35" rx="41" ry="8.5" fill={`url(#h${id})`} />
      <ellipse cx="60" cy="33.5" rx="36" ry="6" fill="#000" opacity="0.18" />
      <path d="M41 35 Q41 15 60 15 Q79 15 79 35 Z" fill={`url(#h${id})`} />
      <ellipse cx="52" cy="23" rx="6.5" ry="9" fill="#fff" opacity="0.12" />
      <rect x="41" y="31" width="38" height="4.2" rx="2.1" fill="#C24632" />
      <circle cx="60" cy="16.5" r="2.6" fill="#1d1d1d" />
    </svg>
  )
}
