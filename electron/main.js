// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, screen, Menu, Tray } = require("electron");
const path = require("path");
const {
  exportTodoList,
  exportDoneList,
  againExportTodoList,
  againExportDoneList,
} = require("./utils");

// process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

// 禁用当前应用程序的硬件加速
app.disableHardwareAcceleration();

const createWindow = () => {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.size;
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: parseInt((width / 1920) * 1000),
    height: parseInt((height / 1080) * 800),
    icon: path.join(__dirname, "../public/favicon.ico"),
    // minWidth: 800,
    // minHeight: 600,
    // frame: false, // 无边框窗口
    autoHideMenuBar: true, // 自动隐藏菜单栏
    webPreferences: {
      contextIsolation: true,
      // nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (app.isPackaged) {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  } else {
    mainWindow.loadURL("http://localhost:5173/");
  }

  // 加载 index.html
  // mainWindow.loadFile("index.html");

  // 打开开发工具
  // mainWindow.webContents.openDevTools();

  return mainWindow;
};

let tray = null;
let trayClose = false;

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
  ipcMain.handle("export-todo-file-list", exportTodoList);
  ipcMain.handle("export-done-file-list", exportDoneList);
  ipcMain.handle("again-export-todo-file-list", againExportTodoList);
  ipcMain.handle("again-export-done-file-list", againExportDoneList);

  const win = createWindow();
  // 任务栏隐藏
  win.setSkipTaskbar(true);
  // 窗口关闭事件
  win.on("close", (event) => {
    if (!trayClose) {
      // 取消默认行为，阻止窗口关闭
      event.preventDefault();
      win.hide();
      // 没有托盘，则创建托盘
      if (!tray) {
        // 设置右键菜单列表
        const trayContextMenu = Menu.buildFromTemplate([
          {
            label: "打开",
            click() {
              win.show();
            },
          },
          {
            label: "退出",
            click() {
              trayClose = true;
              app.quit();
            },
          },
        ]);
        tray = new Tray(path.join(__dirname, "../public/favicon.ico"));
        tray.setToolTip("我的工具");
        tray.setContextMenu(trayContextMenu);
        tray.on("click", () => {
          win.isVisible() ? win.hide() : win.show();
        });
      }
    }
  });

  app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. 也可以拆分成几个文件，然后用 require 导入。
