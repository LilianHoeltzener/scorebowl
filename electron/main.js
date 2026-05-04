const { app, BrowserWindow, shell } = require('electron');
const path = require('node:path');

function createBrowserWindow(options = {}) {
    return new BrowserWindow({
        width: 1280,
        height: 840,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            backgroundThrottling: false
        },
        ...options
    });
}

function createWindow() {
    const window = createBrowserWindow();

    window.loadFile(path.join(__dirname, '..', 'index.html'));

    window.webContents.setWindowOpenHandler(({ url }) => {
        if (url.includes('?mode=display')) {
            return {
                action: 'allow',
                overrideBrowserWindowOptions: {
                    width: 1440,
                    height: 900,
                    backgroundColor: '#0f1f35',
                    autoHideMenuBar: true,
                    title: 'ScoreBowl - Classement en direct',
                    webPreferences: {
                        preload: path.join(__dirname, 'preload.js'),
                        contextIsolation: true,
                        nodeIntegration: false,
                        backgroundThrottling: false
                    }
                }
            };
        }

        shell.openExternal(url);
        return { action: 'deny' };
    });
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
