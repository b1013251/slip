var {app} = require('electron');
var {BrowserWindow} =  require('electron')
var electron = require('electron')
var ipc = electron.ipcMain
var Menu = electron.Menu
var dialog = electron.dialog
const loadDevtool = require('electron-load-devtool');

let win
let fullWin
let createWindow = () => {
  win = new BrowserWindow({
    width: 1024,
    height:764,
    toolbar: false
  })
  win.loadURL(`file://${__dirname}/../client/index.html`)
  win.on('closed', () => {
    win = null
    app.quit()
  })

  /*DevTool*/
  // loadDevtool(loadDevtool.REDUX_DEVTOOLS);
  // win.openDevTools();

  fullWin = new BrowserWindow()
  fullWin.setFullScreen(true)
  fullWin.loadURL(`file://${__dirname}/../client/full.html`)
  fullWin.on('closed', () => {
    fullWin = null
  })
  fullWin.setMenuBarVisibility(false);
  fullWin.setAlwaysOnTop(true)
  fullWin.setAutoHideMenuBar(true);
}

let initWindowMenu = () => {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Open PDF',
          click() {
            dialog.showOpenDialog(null, {
              properties: ['openFile'],
              title: 'ファイル(単独選択)',
              defaultPath: '.',
              filters: [
                  {name: 'PDFファイル', extensions: ['pdf']},
              ]
            }, (fileName) => {
              console.log(fileName[0])
              win.webContents.send('openFile', fileName[0])
              fullWin.webContents.send('openFile', fileName[0])
            })
          }
        },
        {
          label: 'Open MemoText',
          click() {
            dialog.showOpenDialog(null, {
              properties: ['openFile'],
              title: 'ファイル(単独選択)',
              defaultPath: '.',
              filters: [
              ]
            }, (fileName) => {
              console.log(fileName[0])
              win.webContents.send('openMemo', fileName[0])
            })
          }
        },
        {
          label: 'Close',
          click() {app.quit()}
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

ipc.on('getCanvas', (event, args) => {
  console.log(args)
  fullWin.webContents.send('canvas', args)
  // ipc.sender.send('canvas', args)
})

app.on('ready', () => {
  createWindow()
  initWindowMenu()
})

// for Mac
app.on('window-all-closed', () => {
  if(process.platform !== "darwin") {
    app.quit()
  }
})

app.on('activate', (_e, hasVisibleWindows) => {
  if(!hasVisibleWindows) {
    createWindow()
  }
})
