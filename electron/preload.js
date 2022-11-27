const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  exportTodoList: (data) => ipcRenderer.invoke("export-todo-file-list", data),
  exportDoneList: (data) => ipcRenderer.invoke("export-done-file-list", data),

  againExportTodoList: (data) =>
    ipcRenderer.invoke("again-export-todo-file-list", data),
  againExportDoneList: (data) =>
    ipcRenderer.invoke("again-export-done-file-list", data),
});
