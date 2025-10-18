/*
 * Copyright 2025 Steaven Jiang (aka steaven-china)
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS “AS IS” AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

const fs = require('fs');
const {app, BrowserWindow,ipcMain} = require('electron');
const path = require('path');
const {fileTypeFromFile} = require('file-type');

/**
 *
 * */

async function CheckBgImg() {
    const files = fs.readdirSync(__dirname);
    const bgFile = files.find(f => f.startsWith('bg_pic.'));
    if (!bgFile) {
        console.info("No bg_pic.* file found");
        return false;
    }
    const filePath = path.join(__dirname, bgFile);
    const imgTypes = await fileTypeFromFile(filePath);
    if (!imgTypes) {
        console.warn("Unknown file type");
        return ;
    }
    if (imgTypes.mime.startsWith('image/')) {
        console.log("✅ Valid image:", imgTypes);
        return true;
    } else {
        console.warn("🤡 Not an image:", imgTypes);
    }
}

/**
 * 主窗口进程函数
 */
const createMainWindow = () => {
    const win = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    })
    win.loadURL('file://' + path.join(__dirname, 'index.html')).then();
    win.on('resize', () => {
        const { height } = win.getBounds();
        let eq_height = height - 45;
        let fs_height = height - 25;
        const isFullScreen = win.isFullScreen();
        console.debug(eq_height);
        console.info(isFullScreen);
        win.webContents.send('window-resize', height, eq_height,fs_height,isFullScreen);
    });

    win.webContents.openDevTools();
}
//run process.

async function main() {
    console.log("🤔Processing...");
    let BgCheck = await CheckBgImg();

    app.whenReady().then(() => {
        createMainWindow();
    })
    console.log("🎉Running...")
    console.log(BgCheck);
    if (BgCheck !== null) {
        console.debug("is", BgCheck);
    }if (BgCheck == null) {
        console.debug("is", BgCheck);
    }
}

main().then();
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
ipcMain.on('fatal-error', (event,msg) => {
    console.error(msg);
    app.exit();
})
//FILE API
