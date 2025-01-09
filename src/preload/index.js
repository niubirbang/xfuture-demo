import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  start: (...args) => invoke('start', ...args),
  close: (...args) => invoke('close', ...args),
  changeMode: (...args) => invoke('changeMode', ...args),
  data: (...args) => invoke('data', ...args),
  listenData: (cb) => on('listen_data', cb),
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}

const invoke = (chan, ...args) => {
  return new Promise((resolve, reject) => {
    ipcRenderer.invoke(chan, ...args).then((data) => {
      console.info('[ipc invoke] chan:', chan, 'args:', args, 'data:', data)
      resolve(data)
    }).catch(err => {
      console.error('[ipc invoke] chan:', chan, 'args:', args, 'err:', err)
      err = err + ''
      err = err.replace('Error: Error invoking remote method \'' + chan + '\': ', '')
      reject(err)
    })
  })
}

const on = (chan, cb) => {
  ipcRenderer.on(chan, (e, ...v) => {
    console.info('[ipc on] chan:', chan, 'data:', v)
    cb(v[0])
  })
}
