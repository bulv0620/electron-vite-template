import { BrowserWindow, ipcMain } from 'electron'
import { createCustomWindow } from '../utils/window'

export function createEventHandler(mainWindow: BrowserWindow) {
  // IPC test
  ipcMain.on('create-about-win', () => {
    createCustomWindow({
      width: 300,
      height: 200,
      hideMenuBar: true,
      location: '/about',
      parent: mainWindow,
      modal: true,
    })
  })
}
