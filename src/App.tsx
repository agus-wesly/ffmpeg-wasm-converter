import { useRef, useState } from 'react'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import './App.css'
import { fetchFile, toBlobURL } from '@ffmpeg/util'
import Dropzone from 'react-dropzone'

function getFileExtension(file_name: string) {
  const regex = /(?:\.([^.]+))?$/ // Matches the last dot and everything after it
  const match = regex.exec(file_name)
  if (match && match[1]) {
    return match[1]
  }
  return '' // No file extension found
}

function removeFileExtension(file_name: string) {
  const lastDotIndex = file_name.lastIndexOf('.')
  if (lastDotIndex !== -1) {
    return file_name.slice(0, lastDotIndex)
  }
  return file_name // No file extension found
}

function App() {
  const [loaded, setLoaded] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const videoRef = useRef<HTMLImageElement>(null)
  const messageRef = useRef<HTMLParagraphElement>(null)
  const ffmpegRef = useRef(new FFmpeg())

  async function transcode() {
    if (!file) return
    const ffmpeg = ffmpegRef.current
    const input = getFileExtension(file.name)
    await ffmpeg.writeFile('input.png', await fetchFile(file))
    await ffmpeg.exec(['-i', 'input.png', 'input.jpg'])
    const fileData = await ffmpeg.readFile('input.jpg')
    const data = new Uint8Array(fileData as ArrayBuffer)
    if (videoRef.current) {
      const urlImage = URL.createObjectURL(
        new Blob([data.buffer], { type: file.type.split('/')[0] }),
      )
      console.log('u', urlImage)
      videoRef.current.src = urlImage
    }
  }

  async function load() {
    const baseURL = 'https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm'
    const ffmpeg = ffmpegRef.current
    ffmpeg.on('log', ({ message }) => {
      if (messageRef.current) messageRef.current.innerHTML = message
    })

    // toBlobURL is used to bypass CORS issue, urls with the same
    // domain can be used directly.
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
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

  return loaded ? (
    <>
      <img style={{ width: '300px', height: '300px' }} ref={videoRef} />
      <br />
      <Dropzone onDrop={(data) => setFile(data[0])}>
        {({ getRootProps, getInputProps }) => (
          <section>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <p>Drag 'n' drop some files here, or click to select files</p>
            </div>
          </section>
        )}
      </Dropzone>
      <button onClick={transcode}>Transcode avi to mp4</button>
      <p ref={messageRef}></p>
    </>
  ) : (
    <>
      <button onClick={load}>Load ffmpeg-core</button>
    </>
  )
}

export default App
