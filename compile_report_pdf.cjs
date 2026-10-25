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

  const htmlPath = path.join(__dirname, 'SHIVAJI_UNIVERSITY_PROJECT_REPORT.html')
  await win.loadFile(htmlPath)

  const pdfData = await win.webContents.printToPDF({
    pageSize: 'A4',
    margins: {
      top: 0.4,
      bottom: 0.4,
      left: 0.4,
      right: 0.4
    },
    printBackground: true
  })

  const out1 = path.join(__dirname, 'SHIVAJI_UNIVERSITY_PROJECT_REPORT.pdf')
  const out2 = path.join(__dirname, '..', 'SHIVAJI_UNIVERSITY_PROJECT_REPORT.pdf')
  const out3 = path.join(__dirname, '..', 'Nexus_POS_Final_Submission', '02_Documentation', 'SHIVAJI_UNIVERSITY_PROJECT_REPORT.pdf')

  fs.writeFileSync(out1, pdfData)
  fs.writeFileSync(out2, pdfData)
  fs.writeFileSync(out3, pdfData)

  console.log('SHIVAJI UNIVERSITY REPORT PDF GENERATED SUCCESSFULLY!')
  console.log('Saved to:', out1)
  console.log('Saved to:', out2)
  console.log('Saved to:', out3)

  app.exit(0)
})
