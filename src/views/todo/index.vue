<template>
    <div class="todo">
        <n-scrollbar>
            <div class="data">
                <div v-if="(todoStore.todoList.length == 0 && todoStore.doneList.length == 0)" class="empty">
                    <n-empty description="你什么也找不到">
                    </n-empty>
                </div>
                <n-card v-if="todoStore.todoList.length" title="任务">
                    <template #header-extra>
                        <n-button size="small" @click="exportTodoFile">导出</n-button>
                    </template>
                    <n-list>
                        <n-list-item v-for="(item, index) in todoStore.todoList" :key="index"
                            @contextmenu="onContextmenu($event, index)">
                            <div class="todo-item">
                                <span>
                                    <n-checkbox size="large" :checked="item.end"
                                        @update:checked="todoCheckedChange($event, index)" />
                                    <span class="todo-text">{{ item.name }}</span>
                                </span>
                                <span class="todo-remark">{{ item.remark }}</span>
                            </div>
                        </n-list-item>
                    </n-list>
                </n-card>
                <n-card v-if="todoStore.doneList.length" title="已完成" style="margin-top:24px">
                    <template #header-extra>
                        <n-button size="small" @click="exportDoneFile">导出</n-button>
                    </template>
                    <n-list>
                        <n-list-item v-for="(item, index) in todoStore.doneList" :key="index"
                            @contextmenu="onDoneContextmenu($event, index)">
                            <div class="todo-item">
                                <span>
                                    <n-checkbox size="large" :checked="item.end"
                                        @update:checked="doneCheckedChange($event, index)" />
                                    <span class="todo-text">{{ item.name }}</span>
                                </span>
                                <span class="todo-remark">{{ item.remark }}</span>
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
        <n-dropdown placement="bottom-start" trigger="manual" :x="xRef" :y="yRef" :options="options"
            :show="showDropdown" :on-clickoutside="() => showDropdown = false" @select="handleSelect" />
        <n-dropdown placement="bottom-start" trigger="manual" :x="xRef" :y="yRef" :options="doneOptions"
            :show="showDoneDropdown" :on-clickoutside="() => showDoneDropdown = false" @select="handleDoneSelect" />
        <n-drawer v-model:show="active" :width="460" placement="right">
            <n-drawer-content title="编辑" closable>
                <n-form ref="formRef" :label-width="80" :model="editForm" :rules="rules">
                    <n-form-item label="名称" path="editForm.name">
                        <n-input v-model:value="editForm.name" type="text" placeholder="请输入名称" />
                    </n-form-item>
                    <n-form-item label="备注" path="editForm.remark">
                        <n-input v-model:value="editForm.remark" type="textarea" placeholder="请输入备注" />
                    </n-form-item>
                </n-form>
                <template #footer>
                    <n-button type="primary" @click="submitEditForm">确定</n-button>
                </template>
            </n-drawer-content>
        </n-drawer>
    </div>
</template>

<script setup>
import { h, reactive, ref, nextTick } from "vue";
import { NButton, NSpace, useMessage, useDialog } from "naive-ui";
import dayjs from 'dayjs'
import { useTodoStore } from "@/store/index.js"

const message = useMessage();
const dialog = useDialog()
const todoStore = useTodoStore()

// 添加的新任务
const todoItem = ref("");

// 右键菜单配置
const options = ref([
    {
        label: "编辑",
        key: "edit"
    },
    {
        label: () => h("span", { style: { color: "red" } }, "删除"),
        key: "delete"
    }
])

const doneOptions = ref([
    {
        label: () => h("span", { style: { color: "red" } }, "删除"),
        key: "delete"
    }
])

// 打开抽屉
const active = ref(false)


// 编辑表单
const editForm = reactive({
    name: '',
    remark: ''
})

const formRef = ref(null)

// 表单验证规则
const rules = {
    name: {
        required: true,
        message: "请输入名称",
        trigger: "blur"
    },
}
// 显示右键菜单
const showDropdown = ref(false);
// 显示右键菜单
const showDoneDropdown = ref(false);
// 右击 x 坐标
const xRef = ref(0);
// 右击 y 坐标
const yRef = ref(0);

const selectTodoIndex = ref(-1)

const submitEditForm = () => {
    formRef.value?.validate((errors) => {
        if (!errors) {
            todoStore.editTodo(selectTodoIndex.value, editForm)
            active.value = false
        } else {
            console.log(errors);
            message.error("请输入名称");
        }
    });
}

// 右击显示菜单
const onContextmenu = (e, index) => {
    e.preventDefault();
    nextTick().then(() => {
        selectTodoIndex.value = index
        showDropdown.value = true;
        xRef.value = e.clientX;
        yRef.value = e.clientY;
    });
}

// 右击显示菜单
const onDoneContextmenu = (e, index) => {
    e.preventDefault();
    nextTick().then(() => {
        selectTodoIndex.value = index
        showDoneDropdown.value = true;
        xRef.value = e.clientX;
        yRef.value = e.clientY;
    });
}


const handleSelect = (key) => {
    if (selectTodoIndex.value == -1) {
        return showDropdown.value = false;
    }
    if (key == 'delete') {
        todoStore.delTodo(selectTodoIndex.value)
    }
    if (key == 'edit') {
        editForm.name = todoStore.todoList[selectTodoIndex.value].name
        editForm.remark = todoStore.todoList[selectTodoIndex.value].remark
        active.value = true
    }
    showDropdown.value = false;
}

const handleDoneSelect = (key) => {
    if (selectTodoIndex.value == -1) {
        return showDropdown.value = false;
    }
    if (key == 'delete') {
        todoStore.delDone(selectTodoIndex.value)
    }
    showDoneDropdown.value = false;
}

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
            remark: '',
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
        display: flex;
        justify-content: space-between;

        .todo-text {
            padding-left: 16px;
            font-size: 16px;
        }

        .todo-remark {
            text-align: right;
            color: rgba(0, 0, 0, 0.45);
        }
    }

    .data {
        height: 100%;
        padding: 24px 24px 0;
        padding-bottom: 66px;
        overflow-y: auto;

        .empty {
            height: calc(100vh - 90px);
            display: flex;
            justify-content: center;
            align-items: center;
        }
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
