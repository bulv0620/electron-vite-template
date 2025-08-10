import { app, BrowserWindow, dialog, ipcMain, nativeTheme, Tray } from 'electron'
import { createCustomWindow } from '../utils/window'
import { updateTray } from '../utils/tray'
import { checkUpdate, downloadUpdate } from '../utils/update'
import { messages } from '../locales'

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
    global.lang = lang
    updateTray(tray, lang, { mainWindow })
  })

  // 检查更新（只检查，不下载）
  ipcMain.handle('check-update', () => {
    return checkUpdate()
  })
  // 下载更新（用户点击后才下载）
  ipcMain.handle('download-update', () => {
    return downloadUpdate(mainWindow)
  })

  // 获取当前版本号
  ipcMain.handle('get-current-version', () => {
    return app.getVersion()
  })

  // 测试dialog
  ipcMain.handle('test-dialog', () => {
    dialog.showMessageBox({
      type: 'info',
      buttons: [
        messages[global.lang || 'en_US'].update.confirm,
        messages[global.lang || 'en_US'].update.later,
      ],
      title: messages[global.lang || 'en_US'].update.prompt,
      message: messages[global.lang || 'en_US'].update.confirmMessage,
    })
  })
}
