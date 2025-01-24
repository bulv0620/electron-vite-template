import { app } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { createCustomWindow } from './utils/window'
import { createEventHandler } from './events'
import { createTray } from './utils/tray'

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  const mainWindow = createCustomWindow()
  mainWindow.on('close', (event) => {
    // 在关闭窗口时取消默认行为，隐藏窗口到托盘
    if (!global.isQuiting) {
      event.preventDefault()
      mainWindow.hide()
    }
  })

  createEventHandler(mainWindow)
  createTray(mainWindow)
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
