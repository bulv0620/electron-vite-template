import { app, autoUpdater, BrowserWindow, ipcMain, nativeTheme, Tray } from 'electron'
import { createCustomWindow } from '../utils/window'
import { updateTray } from '../utils/tray'
import { checkUpdate } from '../utils/update'

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

  // 检查更新
  ipcMain.handle('check-update', () => {
    return checkUpdate()
  })

  // 重启并更新
  ipcMain.handle('apply-update', () => {
    autoUpdater.quitAndInstall()
  })

  // 获取当前版本号
  ipcMain.handle('get-current-version', () => {
    return app.getVersion()
  })
}
