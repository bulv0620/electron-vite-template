import { app } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { createCustomWindow } from './utils/window'
import { createEventHandler } from './events/index'
import { createTray } from './utils/tray'
import { checkUpdate } from './utils/update'

const gotTheLock = app.requestSingleInstanceLock({ myKey: 'key' })
if (!gotTheLock) {
  app.quit()
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  checkUpdate()

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  const mainWindow = createCustomWindow({
    resizable: true,
  })
  mainWindow.on('close', (event) => {
    // 在关闭窗口时取消默认行为，隐藏窗口到托盘
    if (!global.isQuiting) {
      event.preventDefault()
      mainWindow.hide()
    }
  })

  const tray = createTray(mainWindow)
  createEventHandler({ mainWindow, tray })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
