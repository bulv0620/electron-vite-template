import { BrowserWindow, shell } from 'electron'
import { is } from '@electron-toolkit/utils'
import { join } from 'path'
import icon from '../../../resources/icon.png?asset'

export interface IWindowOptions {
  width?: number
  height?: number
  hideMenuBar?: boolean
  location?: string
}

export function createCustomWindow(windowOption?: IWindowOptions): BrowserWindow {
  const mainWindow = new BrowserWindow({
    width: windowOption?.width || 900,
    height: windowOption?.height || 670,
    show: false,
    autoHideMenuBar: windowOption?.hideMenuBar || true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(
      process.env['ELECTRON_RENDERER_URL'] + getParsedLocation(windowOption?.location)
    )
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
    if (windowOption?.location) {
      mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.executeJavaScript(
          `window.location.hash = '${getParsedLocation(windowOption.location)}'`
        )
      })
    }
  }

  return mainWindow
}

function getParsedLocation(location?: string): string {
  if (!location) return ''
  return location.startsWith('/') ? location : '/' + location
}
