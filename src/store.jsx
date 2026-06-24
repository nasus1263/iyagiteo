// 백엔드 없음 → 상태는 localStorage에 보관.
import { createContext, useContext, useEffect, useState } from 'react'

const KEY = 'iyagiteo.state.v1'

const initial = {
  interestId: null, // 온보딩에서 선택
  durationMin: 120,
  trips: [], // {id, name, interestId, durationMin, routePoints:[{id, placeId, story?:{text,visuals,generatedByAI}}]}
  stamps: {}, // { [placeId]: { acquired:bool, storyPlayed:bool } }
}

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...initial, ...JSON.parse(raw) } : initial
  } catch {
    return initial
  }
}

const StoreContext = createContext(null)

let counter = 0
const uid = () => `${Date.now().toString(36)}${(counter++).toString(36)}`

export function StoreProvider({ children }) {
  const [state, setState] = useState(load)

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(state))
  }, [state])

  const api = {
    state,

    setInterest(interestId, durationMin) {
      setState((s) => ({ ...s, interestId, durationMin: durationMin ?? s.durationMin }))
    },

    createTrip({ name, interestId, durationMin, placeIds = [] }) {
      const trip = {
        id: uid(),
        name: name || '새 여행',
        interestId: interestId || state.interestId,
        durationMin: durationMin || state.durationMin,
        routePoints: placeIds.map((placeId) => ({ id: uid(), placeId, story: null })),
      }
      setState((s) => ({ ...s, trips: [...s.trips, trip] }))
      return trip.id
    },

    deleteTrip(tripId) {
      setState((s) => ({ ...s, trips: s.trips.filter((t) => t.id !== tripId) }))
    },

    addPoint(tripId, placeId) {
      setState((s) => ({
        ...s,
        trips: s.trips.map((t) =>
          t.id === tripId
            ? { ...t, routePoints: [...t.routePoints, { id: uid(), placeId, story: null }] }
            : t
        ),
      }))
    },

    removePoint(tripId, pointId) {
      setState((s) => ({
        ...s,
        trips: s.trips.map((t) =>
          t.id === tripId
            ? { ...t, routePoints: t.routePoints.filter((p) => p.id !== pointId) }
            : t
        ),
      }))
    },

    setStory(tripId, pointId, story) {
      setState((s) => ({
        ...s,
        trips: s.trips.map((t) =>
          t.id === tripId
            ? {
                ...t,
                routePoints: t.routePoints.map((p) =>
                  p.id === pointId ? { ...p, story } : p
                ),
              }
            : t
        ),
      }))
    },

    acquireStamp(placeId, { storyPlayed = false } = {}) {
      setState((s) => ({
        ...s,
        stamps: {
          ...s.stamps,
          [placeId]: {
            acquired: true,
            storyPlayed: storyPlayed || (s.stamps[placeId]?.storyPlayed ?? false),
          },
        },
      }))
    },

    getTrip(tripId) {
      return state.trips.find((t) => t.id === tripId)
    },
  }

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
