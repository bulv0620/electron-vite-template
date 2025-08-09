import { BrowserWindow } from 'electron'
import { autoUpdater } from 'electron-updater'

export function checkUpdate(mainWindow: BrowserWindow) {
  // 开发模式跳过更新检测
  if (process.env.NODE_ENV === 'development') {
    return
  }

  // 检查更新
  autoUpdater.checkForUpdates()

  // 下载出错
  autoUpdater.on('error', (error) => {
    console.error('[update] 更新出错:', error)
  })

  // 下载完成
  autoUpdater.on('update-downloaded', (info) => {
    mainWindow.webContents.send('new-version-ready', info.version)
  })
}
