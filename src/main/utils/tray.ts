import { BrowserWindow, Tray, app, Menu } from 'electron'
import icon from '../../../resources/icon.png?asset'
import { messages } from '../locales'

export function createTray(mainWindow: BrowserWindow): Tray {
  const tray = new Tray(icon)

  const contextMenu = Menu.buildFromTemplate([])

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

export function updateTray(tray: Tray, lang: string, options: { mainWindow: BrowserWindow }) {
  const contextMenu = Menu.buildFromTemplate([
    {
      label: messages[lang].tray.show,
      click: () => {
        options.mainWindow.show()
      },
    },
    // { type: 'separator' },
    {
      label: messages[lang].tray.quit,
      click: () => {
        global.isQuiting = true
        app.quit()
      },
    },
  ])

  tray.setContextMenu(contextMenu)
}
