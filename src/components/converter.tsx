import { useState } from 'react'
import Dropzone from 'react-dropzone'
import useFFmpeg from '../hooks/useFFmpeg'

export default function Converter() {
  const [files, setFiles] = useState<Array<File>>([])

  return (
    <div className="flex flex-col items-center py-20 gap-2">
      <h1 className="text-4xl font-bold">File converter</h1>
      <p className="text-lg">Convert file easily</p>

      <Dropzone
        onDrop={(acceptedFiles) => {
          setFiles([...files, acceptedFiles[0]])
        }}
      >
        {({ getRootProps, getInputProps }) => (
          <section className="my-10 border-blue-600 cursor-pointer">
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <p>Add file</p>
            </div>
          </section>
        )}
      </Dropzone>

      <ul className="flex flex-col gap-2">
        {files.map((file) => (
          <FileListCard key={file.name} file={file} />
        ))}
      </ul>
    </div>
  )
}

function FileListCard({ file }) {
  const [selectedFormat, setSelectedFormat] = useState('png')
  const { convert } = useFFmpeg()

  return (
    <div className="flex items-center gap-8">
      <p className="max-w-[30ch] truncate">{file.name}</p>

      <select
        value={selectedFormat}
        onChange={(e) => setSelectedFormat(e.target.value)}
        name="format"
      >
        <option value="png">PNG</option>
        <option value="jpg">JPG</option>
        <option value="svg">SVG</option>
        <option value="ogg">OGG</option>
      </select>

      <button
        onClick={() => convert(file, selectedFormat)}
        className="text-blue-600 underline"
      >
        Convert now
      </button>
    </div>
  )
}
