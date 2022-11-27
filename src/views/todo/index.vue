<template>
    <div class="todo">
        <n-scrollbar>
            <div class="data">
                <n-card v-if="data.todoData.length" title="任务">
                    <template #header-extra>
                        <n-button size="small" @click="exportTodoFile">导出</n-button>
                    </template>
                    <n-list>
                        <n-list-item v-for="(item, index) in data.todoData" :key="index">
                            <div class="todo-item">
                                <n-checkbox size="large" :checked="item.end"
                                    @update:checked="todoCheckedChange($event, index)" />
                                <span class="todo-text">{{ item.name }}</span>
                            </div>
                        </n-list-item>
                    </n-list>
                </n-card>
                <n-card v-if="data.doneData.length" title="已完成" style="margin-top:24px">
                    <template #header-extra>
                        <n-button size="small" @click="exportDoneFile">导出</n-button>
                    </template>
                    <n-list>
                        <n-list-item v-for="(item, index) in data.doneData" :key="index">
                            <div class="todo-item">
                                <n-checkbox size="large" :checked="item.end"
                                    @update:checked="doneCheckedChange($event, index)" />
                                <span class="todo-text">{{ item.name }}</span>
                            </div>
                        </n-list-item>
                    </n-list>
                </n-card>
            </div>
        </n-scrollbar>
        <div class="add">
            <n-input v-model:value="todoItem" type="text" round placeholder="添加任务" @keyup="handleKeyUp" />
            <n-button type="primary" round style="margin-left: 12px" :disabled="!todoItem" @click="add">
                添 加
            </n-button>
        </div>
    </div>
</template>

<script setup>
import { h, reactive, ref } from "vue";
import { NButton, NSpace, useMessage, useDialog } from "naive-ui";
import dayjs from 'dayjs'
import { useTodoStore } from "@/store/index.js"


const todoStore = useTodoStore()
const message = useMessage();
const dialog = useDialog()

const todoItem = ref("");

const data = reactive({
    todoData: todoStore.todoList,
    doneData: todoStore.doneList,
})

// 按下回车
const handleKeyUp = (event) => {
    if (event.code == 'Enter') {
        add()
    }
}

// 添加代办任务
const add = () => {
    if (!todoItem.value.trim()) {
        return false
    } else {
        todoStore.addNewTodo({
            name: todoItem.value,
            createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            end: false
        })
        todoItem.value = ''
    }
}

// 任务完成
const todoCheckedChange = (checked, index) => {
    todoStore.endTodo(index)
}

// 取消已完成
const doneCheckedChange = (checked, index) => {
    todoStore.cancelDone(index)
}

// 导出代办
const exportTodoFile = async () => {
    try {
        const res = await window.electronAPI.exportTodoList(
            JSON.stringify(todoStore.todoList)
        )
        console.log(res);
        if (res == 'success') {
            message.success('导出成功！')
        }
        if (res == "exist") {
            dialog.warning({
                title: '警告',
                content: '文件已存在，确定覆盖？',
                positiveText: '确定',
                negativeText: '取消',
                onPositiveClick: async () => {
                    try {
                        const r = await window.electronAPI.againExportTodoList(
                            JSON.stringify(todoStore.todoList)
                        )
                        if (r == 'success') {
                            message.success('导出成功！')
                        }
                    } catch (err) {
                        message.error('导出失败！' + err)
                    }
                },
            })
        }
    } catch (error) {
        console.log(error);
        message.error('导出失败！' + error)
    }

}

// 导出已办
const exportDoneFile = async () => {
    try {
        const res = await window.electronAPI.exportDoneList(
            JSON.stringify(todoStore.doneList)
        )
        if (res == 'success') {
            message.success('导出成功！')
        } if (res == "exist") {
            dialog.warning({
                title: '警告',
                content: '文件已存在，确定覆盖？',
                positiveText: '确定',
                negativeText: '取消',
                onPositiveClick: async () => {
                    try {
                        const r = await window.electronAPI.againExportDoneList(
                            JSON.stringify(todoStore.doneList)
                        )
                        if (r == 'success') {
                            message.success('导出成功！')
                        }
                    } catch (err) {
                        message.error('导出失败！' + err)
                    }
                },
            })
        }
    } catch (error) {
        console.log(error);
        message.error('导出失败！' + error)
    }

}

</script>

<style lang="less" scoped>
.todo {
    position: relative;
    height: 100%;
    background-color: #f0f0f0;
    display: flex;
    flex-direction: column;

    .todo-item {
        padding-left: 12px;

        .todo-text {
            padding-left: 16px;
            font-size: 16px;
        }
    }

    .data {
        height: 100%;
        padding: 24px 24px 0;
        padding-bottom: 66px;
        overflow-y: auto;
    }

    .add {
        padding: 0 24px;
        flex-shrink: 0;
        width: 100%;
        height: 66px;
        background-color: #f0f0f0;
        display: flex;
        align-items: center;
        position: absolute;
        bottom: 0;
    }
}
</style>
