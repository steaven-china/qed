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

/**
 * renderer:
 *  index.js
 */
const { ipcRenderer} = require('electron');
const { ErrorEvent } = require('./ErrorEvent');
document.addEventListener('DOMContentLoaded', () => {
    const input_area = document.querySelector(".input_area");
    const ElementRight_bar = document.getElementById('right_bar');
    ipcRenderer.on('window-resize', (event, height,eq_height,fs_height,isFullScreen) => {
        if (input_area) {
            console.debug(input_area);

            /**if (!isFullScreen) {
                input_area["style"].height = `${eq_height}px`;
            }else if (isFullScreen) {
                input_area["style"].height = `${fs_height}px`;
            }*/
            input_area.style.height = isFullScreen ? `${fs_height}px` : `${eq_height}px`;
            ElementRight_bar.style.height = height + 'px';
        }else if (!input_area) {
            console.error('Input area not found!!!!!!!');
        }else{
            console.error('Input area not found!!!!!!!!!' +
                          '\nand and and' +
                          '\nyou are so naughty.'+
                          'It\'s a bug.Absolutely.'
            );
            return ErrorEvent(0,true,'InputArea Not Found');
        }
    });
    window.addEventListener('keydown', (e) => {
        // 在 macOS 上 Command 对应 metaKey，在 Windows 上 Ctrl 是 ctrlKey
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault()
            console.log('Ctrl/Cmd+S pressed')
            // 调用保存逻辑
        }
    })
});