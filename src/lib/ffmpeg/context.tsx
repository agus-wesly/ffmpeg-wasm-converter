import { FFmpeg } from '@ffmpeg/ffmpeg'
import { MutableRefObject, ReactNode, createContext, useRef } from 'react'

export const ffmpegContext = createContext<null | MutableRefObject<FFmpeg>>(
  null,
)

export function Provider({ children }: { children: ReactNode }) {
  const ffmpegRef = useRef(new FFmpeg())

  return (
    <ffmpegContext.Provider value={ffmpegRef}>
      {children}
    </ffmpegContext.Provider>
  )
}
