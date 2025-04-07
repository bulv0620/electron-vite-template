import { BrowserWindow, Tray, app, Menu } from 'electron'
import icon from '../../../resources/icon.png?asset'

export function createTray(mainWindow: BrowserWindow): Tray {
  const tray = new Tray(icon)

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示',
      click: () => {
        showMainWindow()
      },
    },
    // { type: 'separator' },
    {
      label: '退出',
      click: () => {
        global.isQuiting = true
        app.quit()
      },
    },
  ])

  tray.setToolTip('My Electron App')
  tray.setContextMenu(contextMenu)

  tray.on('click', () => {
    showMainWindow()
  })

  const showMainWindow = () => {
    mainWindow.show()
  }

  return tray
}
