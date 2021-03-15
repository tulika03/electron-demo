const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;
let port;
module.exports = {
    loadPorts: function (outchannel) {
        SerialPort.list().then((ports) => {
            console.log(ports);
            outchannel.on('did-finish-load', () => {
                outchannel.send('portslist', ports);
            });
        })
    },

    openPort: function (portPath, outchannel) {
        port = new SerialPort(portPath, {
            baudRate: 9600,
            parity: 'none',
            autoOpen: false
        },
            (err) => {
                console.log("serialPort connect error", err)
            });

        port.open(function (err) {
            if (err) {
                return console.log('Error opening port: ', err.message)
            }
        })

        port.on('open', () => {
            try {
                // Because there's no callback to write, write errors will be emitted on the port:           
                setTimeout(() => {
                    console.log("PORT OPENED"); 
                    port.write("Port open")
                }, 2000);
                outchannel.send("serial-opened", 'Opened')
            } catch (err) {
                console.log('IpcMainEvent: failed to respond "serial port opened"');
            }
        });
        this.recieveDeviceData(outchannel);
        // Switches the port into "flowing mode"

        port.on('close', () => {

            try {
                outchannel.send("serial-closed", "Disconnected");
            }
            catch(e) {
                console.log('IpcMainEvent: failed to respond "serial port closed"');
            }

        })
    },

    recieveDeviceData: function (outchannel) {
        // let parser = port.on(new Readline());
        // console.log("ghusa ya nahi")
        // parser.on('data', console.log)
        port.on('data', function (data) {
            console.log('Data', data);            
            let device_data = data.toString('ascii')
             console.log('Data coming is ascii:', device_data);
            outchannel.send("serial-data", device_data)
        })
    },

    writeDatatoDevice: function(message) {
        port.write(message);
    },

    closeConnection : function() {
        console.log("connection close test", port.isOpen)
        if(port && port.isOpen) {
            return new Promise((resolve, reject) => {
                port.close((err) => {
                    if(err) {
                        console.log("connection close test error")
                        reject(err);
                    }
                    else {
                        console.log("connection close test passed..")
                        resolve();
                    }
                })
            })
        }
    }

}