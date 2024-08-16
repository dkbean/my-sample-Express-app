document
  .getElementById("download-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault()

    const fileName = document.getElementById("fileName").value

    if (!fileName) {
      alert("Please enter a file name.")
      return
    }

    try {
      const response = await fetch(
        `/download?fileName=${encodeURIComponent(fileName)}`
      )

      if (response.ok) {
        const blob = await response.blob()
        const downloadLink = document.createElement("a")
        downloadLink.href = URL.createObjectURL(blob)
        downloadLink.download = fileName
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
      } else {
        alert("File not found or could not be downloaded.")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error downloading the file.")
    }
  })
