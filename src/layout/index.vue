<template>
  <n-layout content-style="height:100vh">
    <!-- <n-layout-header class="container">
      <div class="header">
        <span>工具</span>
        <span>
          <n-space>
            <WindowMinimizeRegular style="width:32px;height:32px" />
            <WindowMaximizeRegular style="width:32px;height:32px" />
            <WindowCloseRegular style="width:32px;height:32px" />
          </n-space>
        </span>
      </div>
    </n-layout-header> -->
    <n-layout has-sider content-style="height:100vh">
      <n-layout-sider collapse-mode="width" :collapsed-width="100" :width="240" show-trigger="arrow-circle"
        content-style="padding: 24px;" bordered>
        <n-menu :options="menuOptions" :value="currentMenu" @update:value="handleUpdateValue" />
      </n-layout-sider>
      <n-layout-content content-style="height:100%">
        <RouterView />
      </n-layout-content>
    </n-layout>
  </n-layout>

</template>

<script setup>
import { h, ref } from "vue";
import { NIcon, useMessage } from "naive-ui";
import { RouterLink, useRoute } from "vue-router";
import {
  BookOutline as BookIcon,
  GridOutline as ListIcon,
  CloseOutline,
} from "@vicons/ionicons5";

import {
  WindowMinimizeRegular,
  WindowMaximizeRegular,
  WindowCloseRegular
} from "@vicons/fa";

const $route = useRoute()


// 当前菜单
let currentMenu = ref('todo')

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}


// 菜单配置
const menuOptions = ref([
  {
    label: () => h(
      RouterLink,
      {
        to: {
          path: "/todo",
        }
      },
      { default: () => "代办" }
    ),
    key: "/todo",
    icon: renderIcon(ListIcon),
  },
  {
    label: () => h(
      RouterLink,
      {
        to: {
          path: "/accountBook",
        }
      },
      { default: () => "账本" }
    ),
    key: "/accountBook",
    icon: renderIcon(BookIcon),
  }
])


const handleUpdateValue = (key, item) => {
  currentMenu.value = key
}

// 页面刷新设置默认菜单选中
const setDefaultMenu = () => {
  currentMenu.value = $route.path
}

setDefaultMenu()

</script>

<style lang="less" scoped>
.container {
  -webkit-app-region: drag;

  .header {
    padding-left: 12px;
    height: 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

// .n-layout-header,
// .n-layout-footer {
//   background: rgba(128, 128, 128, 0.2);
//   padding: 24px;
// }

// .n-layout-sider {
//   background: rgba(128, 128, 128, 0.3);
// }

// .n-layout-content {
//   background: rgba(128, 128, 128, 0.4);
// }
</style>
