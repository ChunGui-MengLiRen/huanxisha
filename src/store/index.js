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
        end: false,
      });
      localStorage.setItem("todoList", JSON.stringify(this.todoList));
      localStorage.setItem("doneList", JSON.stringify(this.doneList));
    },
  },
});
