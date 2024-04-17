import { useContext } from 'react'
import { ffmpegContext } from '../lib/ffmpeg/context'
import { fetchFile } from '@ffmpeg/util'
import { download, getFileExtension, removeFileExtension } from '../lib/utils'

export default function useFFmpeg() {
  const ffmpegRef = useContext(ffmpegContext)
  if (!ffmpegRef?.current) throw new Error('')

  async function convert(inputFile: File, outputFormat: string) {
    if (!ffmpegRef) return

    try {
      const ffmpeg = ffmpegRef.current
      const fileExtension = getFileExtension(inputFile.name)
      const fileName = removeFileExtension(inputFile.name)
      const output = fileName + '.' + outputFormat

      await ffmpeg.writeFile(fileExtension, await fetchFile(inputFile))
      await ffmpeg.exec(['-i', fileExtension, output])
      const fileData = await ffmpeg.readFile(output)

      const data = new Uint8Array(fileData as ArrayBuffer)
      const urlFile = URL.createObjectURL(
        new Blob([data.buffer], { type: inputFile.type.split('/')[0] }),
      )

      console.log('url', urlFile)
      download(urlFile, output)
    } catch (error) {
      console.error('E', error)
    }
  }

  return {
    ffmpegRef,
    convert,
  }
}
