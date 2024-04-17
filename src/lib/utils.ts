export function getFileExtension(file_name: string) {
  const regex = /(?:\.([^.]+))?$/ // Matches the last dot and everything after it
  const match = regex.exec(file_name)
  if (match && match[1]) {
    return match[1]
  }
  return '' // No file extension found
}

export function removeFileExtension(file_name: string) {
  const lastDotIndex = file_name.lastIndexOf('.')
  if (lastDotIndex !== -1) {
    return file_name.slice(0, lastDotIndex)
  }
  return file_name // No file extension found
}

export function download(url: string, output: string) {
  const a = document.createElement('a')
  a.style.display = 'none'
  a.href = url
  a.download = output

  document.body.appendChild(a)
  a.click()

  // Clean up after download
  URL.revokeObjectURL(url)
  document.body.removeChild(a)
}
