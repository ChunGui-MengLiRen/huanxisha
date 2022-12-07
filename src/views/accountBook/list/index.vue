<template>
    <div class="accountBook">
        <div class="nav">
            <n-grid x-gap="24" :cols="4">
                <n-gi>
                    <n-date-picker v-model:formatted-value="formValue.date" type="month" format="yyyy-MM"
                        value-format="yyyy-MM" clearable />
                </n-gi>
                <n-gi>
                    <n-select v-model:value="formValue.type" placeholder="请选择类型" :options="[
                        {
                            label: '收入',
                            value: '1'
                        },
                        {
                            label: '支出',
                            value: '0'
                        }
                    ]" @update:value="onSearchChange" />
                </n-gi>
                <n-gi>
                    <n-select v-model:value="formValue.name" :options="searchOptions"
                        :disabled="(searchOptions.length == 0)" />
                </n-gi>
                <n-gi>
                    <n-grid x-gap="12" :cols="2">
                        <n-gi>
                            <n-space>
                                <n-button @click="reset"> 重 置 </n-button>
                                <!-- <n-button type="primary"> 搜 索 </n-button> -->
                            </n-space>
                        </n-gi>
                        <n-gi style="text-align: right">
                            <n-button type="info" @click="openAddModel"> 添 加 </n-button>
                        </n-gi>
                    </n-grid>
                </n-gi>
            </n-grid>
        </div>

        <div v-if="(recordStore.recordList.length == 0)" class="empty">
            <n-empty description="你什么也找不到">
            </n-empty>
        </div>
        <div v-else class="datalist">

            <n-scrollbar>
                <n-space vertical>
                    <template v-for="(item, index) in recordStore.searchReset(formValue)" :key="index">
                        <n-card v-if="item.data.length" :title="item.datetime">
                            <n-list>
                                <n-list-item v-for="(val, i) in item.data" :key="i" @contextmenu="onDoneContextmenu($event, {
                                    index,
                                    i,
                                })">
                                    <div class="book-item">
                                        <div class="title">
                                            <span class="name">{{ val.name }}</span>
                                            <span class="remark">
                                                <n-space>
                                                    <span>{{ val.time }}</span>
                                                    <span>{{ val.remark }}</span>
                                                </n-space>
                                            </span>
                                        </div>
                                        <div class="money" :style="{
                                            color: val.type == '0' ? 'green' : 'red',
                                        }">
                                            <span>{{ val.type == "0" ? "-" : "+" }}</span>
                                            <span>
                                                {{ val.money }}
                                            </span>
                                        </div>
                                    </div>
                                </n-list-item>
                            </n-list>
                        </n-card>
                    </template>
                </n-space>
            </n-scrollbar>
        </div>

        <n-dropdown placement="bottom-start" trigger="manual" :x="xRef" :y="yRef" :options="dropdownOptions"
            :show="showDropdown" :on-clickoutside="() => showDropdown = false" @select="handleSelect" />

        <n-modal v-model:show="showAddModal" class="custom-card" preset="card" :style="{
            width: '800px',
        }" title="新增" size="huge" :bordered="false" :segmented="{
    content: 'soft',
    footer: 'soft',
}">
            <n-form ref="formAddRef" :label-width="80" :model="addForm" :rules="rules">
                <n-form-item label="类型" path="datetime">
                    <n-date-picker v-model:formatted-value="addForm.datetime" value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd" type="date" clearable style="width:100%" />
                </n-form-item>
                <n-form-item label="类型" path="data.name">
                    <n-select v-model:value="addForm.data.name" placeholder="请选择类型" :options="options" />
                </n-form-item>
                <n-form-item label="类别" path="data.type">
                    <n-radio-group v-model:value="addForm.data.type" @update:value="onChange">
                        <n-space>
                            <n-radio value="1">
                                收入
                            </n-radio>
                            <n-radio value="0">
                                支出
                            </n-radio>
                        </n-space>
                    </n-radio-group>
                </n-form-item>
                <n-form-item label="金额">
                    <n-input-number v-model:value="addForm.data.money" clearable :precision="2" :step="0.01"
                        style="width:100%">
                        <template #prefix>
                            ￥
                        </template>
                    </n-input-number>
                </n-form-item>
                <n-form-item label="备注">
                    <n-input v-model:value="addForm.data.remark" type="textarea" placeholder="请输入备注" maxlength="30"
                        show-count :autosize="{
                            minRows: 5,
                        }" />
                </n-form-item>
            </n-form>
            <template #footer>
                <n-space style="justify-content: flex-end;">
                    <n-button @click="() => showAddModal = false"> 取 消 </n-button>
                    <n-button type="primary" @click="addRecord"> 确 定 </n-button>
                </n-space>
            </template>
        </n-modal>



        <n-modal v-model:show="showEditModal" class="custom-card" preset="card" :style="{
            width: '800px',
        }" title="编辑" size="huge" :bordered="false" :segmented="{
    content: 'soft',
    footer: 'soft',
}">
            <n-form ref="formEditRef" :label-width="80" :model="editForm" :rules="rules">
                <n-form-item label="类型" path="datetime">
                    <n-date-picker v-model:formatted-value="editForm.datetime" value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd" type="date" clearable style="width:100%" disabled />
                </n-form-item>
                <n-form-item label="类型" path="data.name">
                    <n-select v-model:value="editForm.data.name" placeholder="请选择类型" :options="options" />
                </n-form-item>
                <n-form-item label="类别" path="data.type">
                    <n-radio-group v-model:value="editForm.data.type" @update:value="onChange">
                        <n-space>
                            <n-radio value="1">
                                收入
                            </n-radio>
                            <n-radio l value="0">
                                支出
                            </n-radio>
                        </n-space>
                    </n-radio-group>
                </n-form-item>
                <n-form-item label="金额">
                    <n-input-number v-model:value="editForm.data.money" clearable :precision="2" :step="0.01"
                        style="width:100%">
                        <template #prefix>
                            ￥
                        </template>
                    </n-input-number>
                </n-form-item>
                <n-form-item label="备注">
                    <n-input v-model:value="editForm.data.remark" type="textarea" placeholder="请输入备注" maxlength="30"
                        show-count :autosize="{
                            minRows: 5,
                        }" />
                </n-form-item>
            </n-form>
            <template #footer>
                <n-space style="justify-content: flex-end;">
                    <n-button @click="() => showEditModal = false"> 取 消 </n-button>
                    <n-button type="primary" @click="updateRecord"> 确 定 </n-button>
                </n-space>
            </template>
        </n-modal>
    </div>
</template>

<script setup>
import { h, reactive, ref, nextTick } from "vue";
import dayjs from "dayjs";
import { useMessage } from 'naive-ui'
import { useRecord } from "@/store/index.js";

const message = useMessage()
const recordStore = useRecord();


const formValue = ref({
    date: null,
    type: null,
    name: null
});

console.log(recordStore.searchReset(formValue));


const treeOptions = ref([
    {
        label: '支出',
        key: '支出',
        value: '支出',
        children: [
            {
                label: "餐饮",
                key: "餐饮",
                value: "餐饮",
            },
            {
                label: "交通",
                key: "交通",
                value: "交通",
            },
            {
                label: "服饰",
                key: "服饰",
                value: "服饰",
            },
            {
                label: "购物",
                key: "购物",
                value: "购物",
            },
            {
                label: "服务",
                key: "服务",
                value: "服务",
            },
            {
                label: "教育",
                key: "教育",
                value: "教育",
            },
            {
                label: "娱乐",
                key: "娱乐",
                value: "娱乐",
            },
            {
                label: "运动",
                key: "运动",
                value: "运动",
            },
            {
                label: "缴费",
                key: "缴费",
                value: "缴费",
            },
            {
                label: "旅行",
                key: "旅行",
                value: "旅行",
            },
            {
                label: "宠物",
                key: "宠物",
                value: "宠物",
            },
            {
                label: "医疗",
                key: "医疗",
                value: "医疗",
            },
            {
                label: "保险",
                key: "保险",
                value: "保险",
            },
            {
                label: "公益",
                key: "公益",
                value: "公益",
            },
            {
                label: "其他",
                key: "其他支出",
                value: "其他支出",
            },
        ]
    },
    {
        label: '收入',
        key: '收入',
        children: [
            {
                label: "生意",
                key: "生意",
                value: "生意",
            },
            {
                label: "工资",
                key: "工资",
                value: "工资",
            },
            {
                label: "奖金",
                key: "奖金",
                value: "奖金",
            },
            {
                label: "红包",
                key: "红包",
                value: "红包",
            },
            {
                label: "转账",
                key: "转账",
                value: "转账",
            },
            {
                label: "其他",
                key: "其他收入",
                value: "其他收入",
            },
        ]
    }
])

const options = treeOptions.value[0].children

const searchOptions = ref([])

const dateIndex = ref(0)
const itemIndex = ref(0)
// 右击 x 坐标
const xRef = ref(0);
// 右击 y 坐标
const yRef = ref(0);
// 显示右键菜单
const showDropdown = ref(false);
// 右键菜单配置
const dropdownOptions = ref([
    {
        label: "编辑",
        key: "edit"
    },
    {
        label: () => h("span", { style: { color: "red" } }, "删除"),
        key: "delete"
    }
])

const showAddModal = ref(false);
const formAddRef = ref(null)
const addForm = ref({
    datetime: dayjs().format('YYYY-MM-DD'),
    data: {
        name: null,
        remark: "",
        money: 0,
        type: "1",
    }
});

const showEditModal = ref(false);
const formEditRef = ref(null)
const editForm = ref({
    datetime: dayjs().format('YYYY-MM-DD'),
    data: {
        name: null,
        remark: "",
        money: 0,
        type: "1",
    }
});

const rules = {
    datetime: {
        required: true,
        message: "请选择日期",
        trigger: 'change',
    },
    data: {
        name: {
            required: true,
            message: "请选择类型",
            trigger: "change",
        },
        type: {
            required: true,
            message: "请选择类别",
            trigger: 'change',
        },
    }
};

const onSearchChange = (val) => {
    searchOptions.value = val == '1' ? treeOptions.value[1].children : treeOptions.value[0].children
}

// 右击显示菜单
const onDoneContextmenu = (e, { index, i }) => {
    e.preventDefault();
    nextTick().then(() => {
        dateIndex.value = index
        itemIndex.value = i
        showDropdown.value = true;
        xRef.value = e.clientX;
        yRef.value = e.clientY;
    });
}

const handleSelect = (key) => {
    if (key == 'delete') {
        recordStore.del({
            dateIndex: dateIndex.value,
            itemIndex: itemIndex.value,
        })
    }
    if (key == 'edit') {
        options.value = recordStore.recordList[dateIndex.value].data.type == '1' ? treeOptions.value[1].children : treeOptions.value[0].children
        editForm.value = {
            datetime: recordStore.recordList[dateIndex.value].datetime,
            data: {
                ...recordStore.recordList[dateIndex.value].data[itemIndex.value],
                time: dayjs().format('HH:mm:ss')
            }
        }
        showEditModal.value = true
    }
    showDropdown.value = false;
}

// 重置
const reset = () => {
    searchOptions.value = []
    formValue.value = {
        date: null,
        type: null,
        name: null
    };
};

// 打开新增弹框
const openAddModel = () => {
    addForm.value = {
        datetime: dayjs().format('YYYY-MM-DD'),
        data: {
            name: null,
            remark: "",
            money: 0,
            type: "1",
        }
    }
    showAddModal.value = true;
};

const onChange = (val) => {
    addForm.value.data.name = null
    editForm.value.data.name = null
    options.value = val == '1' ? treeOptions.value[1].children : treeOptions.value[0].children
}

const addRecord = () => {
    formAddRef.value?.validate((errors) => {
        if (!errors) {
            recordStore.add({
                datetime: addForm.value.datetime,
                data: {
                    ...addForm.value.data,
                    time: dayjs().format('HH:mm:ss')
                }
            })
            message.success('新增成功！')
            showAddModal.value = false
        }
    })
}

const updateRecord = () => {
    formEditRef.value?.validate((errors) => {
        if (!errors) {
            recordStore.update({
                datetime: editForm.value.datetime,
                data: {
                    ...editForm.value.data,
                    time: dayjs().format('HH:mm:ss')
                }
            }, {
                dateIndex: dateIndex.value, itemIndex: itemIndex.value
            })
            message.success('更新成功！')
            showEditModal.value = false
        }
    })
}

</script>

<style lang="less" scoped>
.accountBook {
    padding-top: 24px;
    height: 100vh;
    // background-color: #f2f2f2;

    .nav {
        margin: 0 24px;
        height: 64px;
        background-color: #f8f8f8;
        padding: 0 16px;
        display: flex;
        align-items: center;
    }

    .empty {
        height: calc(100% - 88px);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .datalist {
        padding: 24px;
        height: calc(100% - 88px);
        overflow-y: auto;


    }

    .book-item {
        padding: 0 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .title {
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            .name {
                font-size: 18px;
                font-style: italic;
            }

            .remark {
                color: rgba(0, 0, 0, 0.46);
            }
        }

        .money {
            font-size: 24px;
            font-weight: 700;
        }
    }
}
</style>
