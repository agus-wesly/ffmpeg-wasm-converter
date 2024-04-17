import { useEffect, useState } from 'react'
import './App.css'
import Converter from './components/converter'
import useFFmpeg from './hooks/useFFmpeg'
import { toBlobURL } from '@ffmpeg/util'

function App() {
  const { ffmpegRef } = useFFmpeg()

  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    async function load() {
      const baseURL = 'https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm'
      const ffmpeg = ffmpegRef.current

      await ffmpeg.load({
        coreURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.js`,
          'text/javascript',
        ),
        wasmURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.wasm`,
          'application/wasm',
        ),
        workerURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.worker.js`,
          'text/javascript',
        ),
      })
      setLoaded(true)
    }

    load()

    // eslint-disable-rule react-hooks/exhaustive-deps
  }, [])

  return loaded ? (
    <Converter />
  ) : (
    <>
      <AppLoading />
    </>
  )
}

function AppLoading() {
  return (
    <div className="text-center text-lg h-screen w-screen flex items-center justify-center">
      <h1>Loading app...</h1>
    </div>
  )
}

export default App
