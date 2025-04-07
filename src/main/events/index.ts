import { BrowserWindow, ipcMain, nativeTheme } from 'electron'
import { createCustomWindow } from '../utils/window'
import ElectronStore from 'electron-store'

export function createEventHandler(mainWindow: BrowserWindow, store: ElectronStore) {
  // IPC test
  ipcMain.on('create-about-win', () => {
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
}
