import { BrowserWindow, ipcMain, nativeTheme, Tray } from 'electron'
import { createCustomWindow } from '../utils/window'
import { updateTray } from '../utils/tray'

export function createEventHandler({
  mainWindow,
  tray,
}: {
  mainWindow: BrowserWindow
  tray: Tray
}) {
  // IPC test
  ipcMain.handle('create-about-win', () => {
    createCustomWindow({
      width: 300,
      height: 200,
      resizable: true,
      hideMenuBar: true,
      location: '/about',
      parent: mainWindow,
      modal: false,
    })
  })

  // 设置APP主题模式
  ipcMain.handle('switch-theme', (_, type: 'light' | 'dark' | 'system') => {
    nativeTheme.themeSource = type
  })

  // 设置APP语言更新tray
  ipcMain.handle('switch-lang', (_, lang: string) => {
    BrowserWindow.getAllWindows().forEach((win) => {
      win.webContents.send('switch-lang', lang)
    })

    updateTray(tray, lang, { mainWindow })
  })
}
