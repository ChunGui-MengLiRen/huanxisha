import { defineStore } from "pinia";
import dayjs from "dayjs";

export const useTodoStore = defineStore("todo", {
  state: () => {
    return {
      todoList: localStorage.getItem("todoList")
        ? JSON.parse(localStorage.getItem("todoList"))
        : [],
      doneList: localStorage.getItem("doneList")
        ? JSON.parse(localStorage.getItem("doneList"))
        : [],
    };
  },
  actions: {
    // 添加新任务
    addNewTodo(data) {
      this.todoList.push(data);
      localStorage.setItem("todoList", JSON.stringify(this.todoList));
    },
    // 完成任务
    endTodo(index) {
      const data = this.todoList.splice(index, 1);
      this.doneList.push({
        name: data[0].name,
        createTime: data[0].createTime,
        finishTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        remark: data[0].remark,
        end: true,
      });
      localStorage.setItem("todoList", JSON.stringify(this.todoList));
      localStorage.setItem("doneList", JSON.stringify(this.doneList));
    },
    // 取消已完成
    cancelDone(index) {
      const data = this.doneList.splice(index, 1);
      this.todoList.push({
        name: data[0].name,
        createTime: data[0].createTime,
        finishTime: "",
        remark: data[0].remark,
        end: false,
      });
      localStorage.setItem("todoList", JSON.stringify(this.todoList));
      localStorage.setItem("doneList", JSON.stringify(this.doneList));
    },
    // 删除代办
    delTodo(index) {
      this.todoList.splice(index, 1);
      localStorage.setItem("todoList", JSON.stringify(this.todoList));
    },
    // 删除代办
    delDone(index) {
      this.doneList.splice(index, 1);
      localStorage.setItem("doneList", JSON.stringify(this.doneList));
    },
    // 编辑代办
    editTodo(index, data) {
      this.todoList[index] = {
        ...this.todoList[index],
        name: data.name,
        remark: data.remark,
      };
      localStorage.setItem("todoList", JSON.stringify(this.todoList));
    },
  },
});

export const useRecord = defineStore("Record", {
  state: () => {
    return {
      recordList: localStorage.getItem("recordList")
        ? JSON.parse(localStorage.getItem("recordList"))
        : [],
    };
  },
  getters: {
    searchReset: (state) => {
      return ({ date = "", type = "", name = "" }) => {
        let res = state.recordList;
        if (date) {
          res = state.recordList.filter((record) => {
            return record.datetime.slice(0, 7) == date;
          });
        }
        if (type) {
          res = res.map((item) => {
            return {
              ...item,
              data: item.data.filter((val) => val.type == type),
            };
          });
        }
        if (name) {
          res = res.map((item) => {
            return {
              ...item,
              data: item.data.filter((val) => val.name == name),
            };
          });
        }
        return res;
      };
    },
  },
  actions: {
    add(newRecord) {
      console.log(newRecord);
      let record = this.recordList.find(
        (item) => item.datetime == newRecord.datetime
      );
      console.log(record);
      if (record) {
        record.data = [
          {
            ...newRecord.data,
          },
          ...record.data,
        ];
      } else {
        this.recordList = [
          {
            datetime: newRecord.datetime,
            data: [
              {
                ...newRecord.data,
              },
            ],
          },
          ...this.recordList,
        ];
      }
      localStorage.setItem("recordList", JSON.stringify(this.recordList));
    },
    update(newRecord, { dateIndex, itemIndex }) {
      console.log(newRecord);
      this.recordList[dateIndex].data[itemIndex] = {
        ...newRecord.data,
      };
      localStorage.setItem("recordList", JSON.stringify(this.recordList));
    },
    del({ dateIndex, itemIndex }) {
      this.recordList[dateIndex].data.splice(itemIndex, 1);
      if (this.recordList[dateIndex].data.length == 0) {
        this.recordList.splice(dateIndex, 1);
      }
      localStorage.setItem("recordList", JSON.stringify(this.recordList));
    },
  },
});
