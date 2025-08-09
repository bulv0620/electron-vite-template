import { app } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { createCustomWindow } from './utils/window'
import { createEventHandler } from './events/index'
import { createTray } from './utils/tray'
// import { checkUpdate } from './utils/update'

const gotTheLock = app.requestSingleInstanceLock({ myKey: 'key' })
if (!gotTheLock) {
  app.quit()
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  const mainWindow = createCustomWindow({
    resizable: true,
  })
  mainWindow.on('close', (event) => {
    // 在关闭窗口时取消默认行为，隐藏窗口到托盘
    if (!global.flagQuit) {
      event.preventDefault()
      mainWindow.hide()
    }
  })

  const tray = createTray(mainWindow)
  // checkUpdate(mainWindow)
  createEventHandler({ mainWindow, tray })

  app.on('before-quit', async (event) => {
    if (!global.flagQuit) {
      event.preventDefault() // 阻止默认退出
      // 退出前操作
      global.flagQuit = true
      tray.destroy()
      app.quit() // 继续退出流程
    }
  })
})
