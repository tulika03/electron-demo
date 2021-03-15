const {contextBridge, ipcRenderer }  = require('electron');

contextBridge.exposeInMainWorld(
  "api", {
    send: (channel, data) => {
      let validChannels = ["test", "portPath", "serial-data-write", "serial-disconnect", "login-check"];
      if(validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    },
    
    receive: (channel, func) => {
      let validChannels = ["portslist", "serial-opened", "serial-data", "serial-closed", "login-status"];
      if(validChannels.includes(channel)) {
        ipcRenderer.on(channel, (event, ...args) => {
          func(...args);
        })
      }
    },

    invoke: async (channel, data) => {
      let validChannels = [""];
      if(validChannels.includes(channel)) {
        return await ipcRenderer.invoke(channel, data);
      }
    }
  }
)