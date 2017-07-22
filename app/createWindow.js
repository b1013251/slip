var {BrowserWindow} =  require('electron')

let win
let createWindow = () => {
  win = new BrowserWindow({width: 1024, height:764})
  win.loadURL(`file://${__dirname}/../client/index.html`)
  win.on('closed', () => {
    win = null
  })

  win2 = new BrowserWindow()
  win2.setFullScreen(true)
  win2.loadURL(`file://${__dirname}/../client/full.html`)
  win2.on('closed', () => {
    win2 = null
  })
}

module.exports = createWindow
