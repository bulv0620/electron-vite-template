// update.ts
import { BrowserWindow } from 'electron'
import { autoUpdater } from 'electron-updater'

export function initUpdater(mainWindow: BrowserWindow) {
  // 绑定事件（全局只执行一次）
  autoUpdater.on('update-available', (info) => {
    mainWindow.webContents.send('update-available', info.version)
  })

  autoUpdater.on('update-not-available', () => {
    mainWindow.webContents.send('update-not-available')
  })

  autoUpdater.on('error', (error) => {
    mainWindow.webContents.send('new-version-download-failed', error.message)
  })

  autoUpdater.on('update-downloaded', () => {
    mainWindow.webContents.send('new-version-ready')
  })
}

export function checkUpdate() {
  if (process.env.NODE_ENV === 'development') {
    return
  }
  autoUpdater.autoDownload = true // 确保有更新就下载
  autoUpdater.checkForUpdates()
}

export function applyUpdate() {
  autoUpdater.quitAndInstall()
}
