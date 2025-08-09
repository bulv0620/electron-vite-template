import { BrowserWindow } from 'electron'
import { autoUpdater } from 'electron-updater'

export function checkUpdate(mainWindow: BrowserWindow) {
  return new Promise<string>((resolve) => {
    // 开发模式跳过更新检测
    if (process.env.NODE_ENV === 'development') {
      resolve('')
    }

    // 检查更新
    autoUpdater.checkForUpdates()

    // 发现新版本
    autoUpdater.on('update-available', (info) => {
      resolve(info.version)
    })

    // 没有新版本
    autoUpdater.on('update-not-available', () => {
      resolve('')
    })

    // 下载出错
    autoUpdater.on('error', (error) => {
      mainWindow.webContents.send('new-version-download-failed', error.message)
    })

    // 下载完成
    autoUpdater.on('update-downloaded', () => {
      mainWindow.webContents.send('new-version-ready')
    })
  })
}
