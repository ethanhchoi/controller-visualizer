const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const path = require('path');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname,'preload.cjs'),
      contextIsolation: true,
      nodeIntegration:false
    },
  });

  win.loadURL('http://localhost:5173');
}

app.whenReady().then(() => {
  createWindow();

  const pyPath = path.join(__dirname, 'python', 'input_listen.py');
  const py = spawn('python3', [pyPath]);
  py.stdout.on('data', (data) => {
    //console.log(data.toString())
    const lines = data.toString().trim().split("\n");

    lines.forEach(line => {
    try {
      const event = JSON.parse(line);
      sendEvent(event);   // send OBJECT not string
    } catch (err) {
        console.error("Bad JSON:", line);
      }
    });
  });
  
});

function sendEvent(event)
{
  win.webContents.send("input-event", event);
}