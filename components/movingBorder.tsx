"use client"

import { useEffect, useState } from 'react'
import { motion, useAnimationControls } from 'framer-motion'

export default function MovingBorder({color1, color2, children}: {color1: string; color2: string; children: React.ReactNode}) {
  const [isHovered, setIsHovered] = useState(false)
  const controls = useAnimationControls()

  useEffect(() => {
    controls.start("animate")
  }, [controls])

  const handleMouseEnter = () => {
    setIsHovered(true)
    controls.start("hover")
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    controls.start("animate")
  }

  return (
      <div 
        className="relative w-full h-full rounded-lg shadow-lg overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <motion.svg
          className="absolute inset-0 w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.rect
            x="0"
            y="0"
            rx="12"
            ry="12"
            width={'100%'}
            height={'100%'}
            stroke="url(#gradient)"
            strokeWidth="8"
            strokeLinecap="round"
            initial={{ pathLength: 0, pathOffset: 0 }}
            animate={controls}
            variants={{
              animate: {
                pathLength: 0.25,
                pathOffset: [0, 1],
                transition: {
                  pathOffset: { duration: 5, repeat: Infinity, ease: "linear" },
                  pathLength: { duration: 0.01 },
                },
              },
              hover: {
                pathLength: 1,
                pathOffset: 0,
                transition: { duration: 1, ease: "easeOut" },
              },
            }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color1} />
              <stop offset="50%" stopColor={color2} />
              <stop offset="100%" stopColor={color1} />
            </linearGradient>
          </defs>
        </motion.svg>
        <div className="relative z-10 p-4 w-full h-full text-center">
        {children}
        </div>
      </div>
  )
}