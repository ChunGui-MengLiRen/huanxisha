const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const xlsx = require("node-xlsx");
const fs = require("fs");
const fsPromises = require("fs").promises;
const os = require("os");

// 导出代办
function exportTodoList(event, data) {
  return new Promise((resolve, reject) => {
    // 导出路径
    const filePath = `${os.homedir()}/Desktop/任务列表.xlsx`;
    // 判断文件是否存在
    fsPromises
      .access(filePath, fs.constants.F_OK)
      .then(() => {
        resolve("exist");
      })
      .catch(() => {
        // 设置 xlsx 数据
        const buffer = setTodoData(data);
        // 写入文件
        fsPromises
          .writeFile(filePath, buffer)
          .then(() => {
            resolve("success");
          })
          .catch((err) => {
            reject(err);
          });
      });
  });
}

// 代办列表文件存在 再次导入
function againExportTodoList(event, data) {
  return new Promise((resolve, reject) => {
    // 导出路径
    const filePath = `${os.homedir()}/Desktop/任务列表.xlsx`;
    // 设置 xlsx 数据
    const buffer = setTodoData(data);
    // 写入文件
    fsPromises
      .writeFile(filePath, buffer)
      .then(() => {
        resolve("success");
      })
      .catch((err) => {
        reject(err);
      });
  });
}

// 导出已办
function exportDoneList(event, data) {
  return new Promise((resolve, reject) => {
    // 导出路径
    const filePath = `${os.homedir()}/Desktop/完成列表.xlsx`;
    // 判断文件是否存在
    fsPromises
      .access(filePath, fs.constants.F_OK)
      .then(() => {
        resolve("exist");
      })
      .catch(() => {
        // 设置 xlsx 数据
        const buffer = setDoneData(data);
        // 写入文件
        fsPromises
          .writeFile(filePath, buffer)
          .then(() => {
            resolve("success");
          })
          .catch((err) => {
            reject(err);
          });
      });
  });
}

// 完成列表文件存在 再次导入
function againExportDoneList(event, data) {
  return new Promise((resolve, reject) => {
    // 导出路径
    const filePath = `${os.homedir()}/Desktop/完成列表.xlsx`;
    // 设置 xlsx 数据
    const buffer = setDoneData(data);
    // 写入文件
    fsPromises
      .writeFile(filePath, buffer)
      .then(() => {
        resolve("success");
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function setTodoData(data) {
  let todoList = JSON.parse(data);
  const list = [
    ["任务名称", "创建时间"],
    ...todoList.map((item) => {
      return [item.name, item.createTime];
    }),
  ];
  // xlxs 列宽
  const sheetOptions = {
    "!cols": [{ wch: 20 }, { wch: 20 }],
  };
  const buffer = xlsx.build([{ name: "任务列表", data: list }], {
    sheetOptions,
  });
  return buffer;
}

function setDoneData(data) {
  let doneList = JSON.parse(data);
  const list = [
    ["任务名称", "创建时间", "完成时间"],
    ...doneList.map((item) => {
      return [item.name, item.createTime, item.finishTime];
    }),
  ];
  // xlxs 列宽
  const sheetOptions = {
    "!cols": [{ wch: 20 }, { wch: 20 }, { wch: 20 }],
  };
  const buffer = xlsx.build([{ name: "完成列表", data: list }], {
    sheetOptions,
  });
  return buffer;
}

module.exports = {
  exportTodoList,
  exportDoneList,
  againExportTodoList,
  againExportDoneList,
};
