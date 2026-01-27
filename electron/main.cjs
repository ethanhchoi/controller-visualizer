const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const path = require('path');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
    },
  });

  win.loadURL('http://localhost:5173');
}

app.whenReady().then(() => {
  createWindow();

  const pyPath = path.join(__dirname, 'python', 'input_listen.py');
  const py = spawn('python3', [pyPath]);
  py.stdout.on('data', (data) => {
    console.log("PYTHON SAYS:", data.toString());
  });

  
});
