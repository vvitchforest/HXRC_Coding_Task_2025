import React, { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import Deck from '../components/Deck'
import Card from '../components/Card'
import { animateDeal } from './animations/dealcards'
// import { animateHover } from './animations/hovercard'
import './app.css'
import { useIsMobile } from './hooks/useIsMobile'
import { onHover, onHoverExit } from './animations/hovercard'

export default function App() {
  const [dealtCards, setDealtCards] = useState([])
  const [deckCount, setDeckCount] = useState(0)

  const dealtRefs = useRef([])
  const deckGroupRef = useRef()

  const isMobile = useIsMobile()

  const handleDeckChange = (count) => setDeckCount(count)

  const handleDeal = (cards) => {
    dealtRefs.current = cards.map(() => React.createRef())
    setDealtCards(cards)
  }

  useEffect(() => {
    if (!dealtRefs.current || !Array.isArray(dealtRefs.current)) return
    if (dealtRefs.current.length === 0 || !deckGroupRef.current) return

    const tryAnimate = () => {
      const ready = dealtRefs.current.every((ref) => ref?.current)
      if (ready) {
        animateDeal(dealtRefs.current, deckGroupRef, isMobile)
      } else {
        requestAnimationFrame(tryAnimate)
      }
    }

    tryAnimate()
  }, [dealtCards])

  const requestDeal = (n) =>
    window.dispatchEvent(new CustomEvent('deal-request', { detail: n }))

  const resetDeck = () => window.dispatchEvent(new Event('reset-deck'))

  return (
    <div className="flex h-screen w-screen ">
      <div className="flex-1 relative bg-slate-950 canvas-wrapper">
        <Canvas
          className="full-canvas "
          shadows
          dpr={[1, 2]}
          camera={{ position: [0, 2, 12], fov: 50 }}
          style={{ width: '100%', height: '100%' }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight
            castShadow
            position={[5, 5, 5]}
            intensity={1}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />

          <Deck
            onDeal={handleDeal}
            onDeckChange={handleDeckChange}
            groupRef={deckGroupRef}
            position={isMobile ? [0, 3, -1] : [5, 1.5, -1]}
            scale={isMobile ? [0.5, 0.5, 0.5] : [1, 1, 1]}
          />

          {dealtCards.map((code, idx) => {
            const count = dealtCards.length
            //const xOffset = -((count - 1) / 2) + idx * 1.2
            const rotY = (idx - (count - 1) / 2) * 0.1
            const origin = deckGroupRef.current.position
            return (
              <Card
                key={`${code}-${idx}`}
                ref={dealtRefs.current[idx]}
                code={code}
                dealt={true}
                rotation={[0, rotY, 0]}
                position={[origin.x, origin.y, origin.z]}
                scale={isMobile ? [0.5, 0.5, 0.5] : [1, 1, 1]}
                onPointerOver={(e) => {
                  e.stopPropagation()
                  onHover(dealtRefs.current[idx], -2, 200)
                }}
                onPointerOut={(e) => {
                  e.stopPropagation()
                  onHoverExit(dealtRefs.current[idx])
                }}
                onPointerDown={(e) => {
                  e.stopPropagation()
                  onHover(dealtRefs.current[idx], -3, 200)
                }}
                onPointerUp={(e) => {
                  e.stopPropagation()
                  onHoverExit(dealtRefs.current[idx])
                }}
              />
            )
          })}
        </Canvas>
      </div>
      <div
        className="
          w-full xl:w-1/2 
          flex flex-col justify-center 
          absolute z-[9001] bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 
          bg-violet-950/20       
          backdrop-blur-lg      
          border border-slate-700/20  
          rounded-3xl          
          p-2 md:p-6       
          controls
          "
      >
        <div className="deck-count self-end">Deck: {deckCount} cards left</div>
        <div className="text-lg text-white mb-2 md:mb-4 self-center">
          Select number of cards
        </div>
        <div className="w-full flex flex-wrap justify-center gap-2 md:gar:4 buttons">
          {[1, 2, 3, 4, 5, 6, 7].map((n) => (
            <button
              key={n}
              onClick={() => requestDeal(n)}
              className="
                  bg-violet-950 text-white 
                  rounded-lg
                  transition-shadow duration-500 ease-linear
                  hover:shadow-[0_0_6px_oklch(60.6%_0.25_292.717),_0_0_24px_oklch(60.6%_0.25_292.717)]
                  "
            >
              {n}
            </button>
          ))}
          <button
            onClick={resetDeck}
            className="w-32 self-end px-4 py-2 
                  bg-transparent text-white 
                  rounded-lg
                  transition-shadow duration-500 ease-linear
                  shadow-[0_0_6px_oklch(55.8%_0.288_302.321)]
                  hover:shadow-[0_0_6px_oklch(60.6%_0.25_292.717),_0_0_24px_oklch(60.6%_0.25_292.717)]"
          >
            Reset Deck
          </button>
        </div>
      </div>
    </div>
  )
}
