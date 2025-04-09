import { BrowserWindow, ipcMain, nativeTheme, Tray } from 'electron'
import { createCustomWindow } from '../utils/window'
import ElectronStore from 'electron-store'
import { updateTray } from '../utils/tray'

export function createEventHandler({
  mainWindow,
  store,
  tray,
}: {
  mainWindow: BrowserWindow
  store: ElectronStore
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

  // 获取APP当前主题模式
  ipcMain.handle('current-theme', () => {
    return nativeTheme.themeSource
  })

  // 设置APP主题模式
  ipcMain.handle('switch-theme', (_, type: 'light' | 'dark' | 'system') => {
    nativeTheme.themeSource = type
    store.set('theme', type)
  })

  // 设置APP语言更新tray
  ipcMain.handle('switch-lang', (_, lang: string) => {
    BrowserWindow.getAllWindows().forEach((win) => {
      win.webContents.send('switch-lang', lang)
    })

    updateTray(tray, lang, { mainWindow })
  })
}
