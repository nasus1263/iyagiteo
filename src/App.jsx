import { Routes, Route, NavLink, Navigate } from 'react-router-dom'
import Onboarding from './pages/Onboarding.jsx'
import Places from './pages/Places.jsx'
import Trips from './pages/Trips.jsx'
import TripEdit from './pages/TripEdit.jsx'
import Play from './pages/Play.jsx'
import Stamps from './pages/Stamps.jsx'
import Settings from './pages/Settings.jsx'
import { useStore } from './store.jsx'

function Shell({ children }) {
  return (
    <div className="app">
      <header className="topbar">
        <span className="brand">이야기터</span>
        <span className="brand-sub">전주 한옥마을</span>
      </header>
      <main className="content">{children}</main>
      <nav className="tabbar">
        <NavLink to="/places" className="tab">📍<span>여행지</span></NavLink>
        <NavLink to="/trips" className="tab">🧭<span>여행</span></NavLink>
        <NavLink to="/stamps" className="tab">🏅<span>스탬프</span></NavLink>
        <NavLink to="/settings" className="tab">⚙️<span>설정</span></NavLink>
      </nav>
    </div>
  )
}

export default function App() {
  const { state } = useStore()
  const onboarded = !!state.interestId

  return (
    <Routes>
      <Route path="/onboarding" element={<Onboarding />} />
      <Route
        path="/play/:tripId"
        element={<Play />}
      />
      <Route
        path="*"
        element={
          onboarded ? (
            <Shell>
              <Routes>
                <Route path="/" element={<Navigate to="/places" replace />} />
                <Route path="/places" element={<Places />} />
                <Route path="/trips" element={<Trips />} />
                <Route path="/trips/:tripId" element={<TripEdit />} />
                <Route path="/stamps" element={<Stamps />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/places" replace />} />
              </Routes>
            </Shell>
          ) : (
            <Navigate to="/onboarding" replace />
          )
        }
      />
    </Routes>
  )
}
