import { dialog } from 'electron'
import { autoUpdater } from 'electron-updater'
import log from 'electron-log'

export function checkUpdate() {
  // 开发模式跳过更新检测
  if (process.env.NODE_ENV === 'development') {
    log.info('[update] 开发模式，跳过自动更新检查')
    return
  }

  // 配置日志
  autoUpdater.logger = log
  ;(autoUpdater.logger as any).transports.file.level = 'info'

  // 检查更新
  autoUpdater.checkForUpdates()

  // 发现新版本
  autoUpdater.on('update-available', () => {
    log.info('[update] 检测到新版本，开始下载')
    dialog.showMessageBox({
      type: 'info',
      title: '发现新版本',
      message: '正在后台下载新版本...',
    })
  })

  // 没有新版本
  autoUpdater.on('update-not-available', () => {
    log.info('[update] 当前已是最新版本')
  })

  // 下载出错
  autoUpdater.on('error', (error) => {
    log.error('[update] 更新出错:', error)
  })

  // 下载完成
  autoUpdater.on('update-downloaded', () => {
    log.info('[update] 新版本下载完成')
    dialog
      .showMessageBox({
        type: 'info',
        buttons: ['立即更新', '稍后'],
        title: '更新完成',
        message: '新版本已下载，是否立即安装？',
      })
      .then((result) => {
        if (result.response === 0) {
          autoUpdater.quitAndInstall()
        }
      })
  })
}
