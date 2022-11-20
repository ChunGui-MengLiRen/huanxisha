<template>
    <div class="todo">

        <div class="add">
            <n-input v-model:value="value" type="text" round placeholder="添加任务" />
            <n-button type="primary" round style="margin-left:12px">
                添 加
            </n-button>
        </div>
    </div>
</template>



<script setup>
import { h, ref } from "vue";

const value = ref('')

</script>


<style lang="less" scoped>
.todo {
    position: relative;
    height: 100vh;
    background-color: #f0f0f0;

    .add {
        display: flex;
        position: absolute;
        bottom: 40px;
        width: 100%;
        padding: 0 5%;
    }
}
</style>