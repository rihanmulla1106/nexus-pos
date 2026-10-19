const { app, BrowserWindow } = require('electron')
const path = require('path')
const fs = require('fs')

app.disableHardwareAcceleration()

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    show: false,
    webPreferences: {
      offscreen: true
    }
  })

  const htmlPath = path.join(__dirname, 'PROJECT_SYNOPSIS.html')
  await win.loadFile(htmlPath)

  const pdfData = await win.webContents.printToPDF({
    pageSize: 'A4',
    margins: {
      top: 0.5,
      bottom: 0.5,
      left: 0.5,
      right: 0.5
    },
    printBackground: true
  })

  const outPath1 = path.join(__dirname, 'PROJECT_SYNOPSIS.pdf')
  const outPath2 = path.join(__dirname, '..', 'PROJECT_SYNOPSIS.pdf')
  const outPath3 = path.join(__dirname, '..', 'Nexus_POS_Final_Submission', '02_Documentation', 'PROJECT_SYNOPSIS.pdf')

  fs.writeFileSync(outPath1, pdfData)
  fs.writeFileSync(outPath2, pdfData)
  fs.writeFileSync(outPath3, pdfData)

  console.log('PDF GENERATED SUCCESSFULLY!')
  console.log('Saved to:', outPath1)
  console.log('Saved to:', outPath2)
  console.log('Saved to:', outPath3)

  app.exit(0)
})
