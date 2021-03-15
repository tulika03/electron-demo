let selectPort = document.getElementById("selPort1")
let selectedPort = null;
window.api.receive("portslist", (data) => {
    console.log("received or not", data); 
    let portList = data;    
    let selectionPort = document.getElementById("selPort1")
    portList.forEach(element => {
       selectionPort.appendChild(createOption(element, element.path))
       document.getElementById("connectBtn").disabled = true;
       document.getElementById("disconnectBtn").hidden = true;
       document.getElementById("demo").hidden = true;
       document.getElementById("inputDevice").hidden = true;
    });
    console.log(selectionPort)
});

function createOption(option, label) {
    let optiontag = document.createElement("option");
    optiontag.setAttribute("value", option.path);
    optiontag.innerHTML  = label;

    return optiontag;
}

selectPort.onchange = (e) => {
    console.log("event triggered", e.target.value);
    if(e.target.value !== '' && e.target.value !== null) {
        document.getElementById("connectBtn").disabled = false;
        selectedPort = event.target.value;
    }

}

document.getElementById("connectBtn").onclick = (event) => {
    window.api.send("portPath", selectedPort);
}

window.api.receive("serial-opened", (data) => {
    document.getElementById("demo").innerHTML = "Port: " + data + ".";
    document.getElementById("connectBtn").hidden = true;
    document.getElementById("disconnectBtn").hidden = false;
    document.getElementById("demo").hidden = false;
    document.getElementById("inputDevice").hidden = false;
    document.getElementById("message1").disabled = true;
})

window.api.receive("serial-data", (data) => {
    let ulTag = document.getElementById("serialData")
    let li_tag = document.createElement("li");
    li_tag.className = "list-group-item";
    li_tag.appendChild(document.createTextNode(data));
    ulTag.appendChild(li_tag);
})

document.getElementById("message1").onclick = (event) => {
    console.log(document.getElementById("inputMessage").value)
    let portMessage = document.getElementById("inputMessage").value
    if(portMessage != "") {
        window.api.send("serial-data-write", portMessage);
        document.getElementById("inputMessage").value = "";
        document.getElementById("message1").disabled = true;
    }
}

document.getElementById("inputMessage").onblur = (e) => {
    let portMessage = document.getElementById("inputMessage").value
    portMessage = portMessage.trim();
    document.getElementById("inputMessage").value = portMessage;
    if(portMessage != "") {
        document.getElementById("message1").disabled = false;
    }
    else {
        document.getElementById("message1").disabled = true;
    }
}


document.getElementById("disconnectBtn").onclick = (event) => {
    window.api.send("serial-disconnect", "Disconnect the port");
}

window.api.receive("serial-closed", (data) => {
    document.getElementById("demo").innerHTML = "Port: " + data + ".";
    document.getElementById("connectBtn").hidden = false;
    document.getElementById("disconnectBtn").hidden = true;
    document.getElementById("demo").hidden = false;
    document.getElementById("inputDevice").hidden = true;
    document.getElementById("message1").disabled = true;
    document.getElementById("serialData").innerHTML = '';
})
