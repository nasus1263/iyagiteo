import { Routes, Route, NavLink, Navigate } from 'react-router-dom'
import Onboarding from './pages/Onboarding.jsx'
import Places from './pages/Places.jsx'
import Trips from './pages/Trips.jsx'
import TripEdit from './pages/TripEdit.jsx'
import Play from './pages/Play.jsx'
import Stamps from './pages/Stamps.jsx'
import Settings from './pages/Settings.jsx'
import { useStore } from './store.jsx'

function Statusbar() {
  return (
    <div className="statusbar">
      <span>9:41</span>
      <div className="dots"><span></span><span></span><span></span></div>
    </div>
  )
}

function Shell({ children }) {
  return (
    <>
      <Statusbar />
      <div className="scroll">{children}</div>
      <nav className="nav">
        <NavLink to="/places" className="navbtn">
          <span className="i">📍</span><span className="t">여행지</span>
        </NavLink>
        <NavLink to="/trips" className="navbtn">
          <span className="i">🧭</span><span className="t">여행</span>
        </NavLink>
        <NavLink to="/stamps" className="navbtn">
          <span className="i">🏅</span><span className="t">스탬프</span>
        </NavLink>
        <NavLink to="/settings" className="navbtn">
          <span className="i">⚙️</span><span className="t">설정</span>
        </NavLink>
      </nav>
    </>
  )
}

export default function App() {
  const { state } = useStore()
  const onboarded = !!state.interestId

  return (
    <div className="stage">
      <div className="phone">
        <div className="dancheong-strip" />
        <div className="screen">
          <div className="notch" />
          <Routes>
            <Route path="/onboarding" element={<><Statusbar /><Onboarding /></>} />
            <Route path="/play/:tripId" element={<Play />} />
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
        </div>
      </div>
    </div>
  )
}
