const electron = require('electron');
const { app, BrowserWindow, ipcMain, globalShortcut  } = electron;
const path = require('path');
let mainWindow;

const serialCommunication = require('./serialCommunications');

let username ="tulika";
let password = "myLifeGoals"

app.whenReady().then((data) => {
    createWindow();
}).catch((error) => {
    console.log("app ready error ", error)
});


function createWindow() {
    console.log("window created", __dirname)
    const mainScreen = electron.screen.getPrimaryDisplay();
    const dimensions = mainScreen.size;
    mainWindow = new BrowserWindow({
        minWidth: 600,
        width: Math.max(800, Math.round(dimensions.width * 0.90 / 10) * 10), // 75% of width
        minHeight: 300,
        height: Math.max(600, Math.round(dimensions.height * 0.90 / 10) * 10), // 75% of height
        webPreferences: {
            title: 'Serial Monitor',
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.join(__dirname, "/preload.js")
        }
    });
    mainWindow.loadFile('./src/index.html');
    globalShortcut.register('f5', function() {
		console.log('f5 is pressed')
		mainWindow.reload()
	})
	globalShortcut.register('CommandOrControl+R', function() {
		console.log('CommandOrControl+R is pressed')
		mainWindow.reload()
	})
    mainWindow.once('focus', () => mainWindow.flashFrame(true));
    mainWindow.flashFrame(true); 
    mainWindow.setMenuBarVisibility(false);
    serialCommunication.loadPorts(mainWindow.webContents);
    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit();     
        }
      })

      ipcMain.on("portPath", (event,args) => {
        console.log("path is: ", args);
            portName = args;
   
        serialCommunication.openPort(portName, mainWindow.webContents);
      })

      ipcMain.on("serial-data-write", (event, args) => {
          console.log("write args", args)
          serialCommunication.writeDatatoDevice(args)
      })

      ipcMain.on("serial-disconnect", (event, args) => {
          serialCommunication.closeConnection();
      })

      ipcMain.on('login-check', (event, args) => {
        console.log("args for login are", args);
        let login_allowed = false;
        if(args.username.toLowerCase() == username && args.password == password) {
           login_allowed = true;
        }
        else {
            login_allowed = false;
        }

        mainWindow.webContents.send("login-status", login_allowed);

      })
}

