<template>
  <n-layout has-sider content-style="height:100vh">
    <n-layout-sider collapse-mode="width" :collapsed-width="100" :width="240" show-trigger="arrow-circle"
      content-style="padding: 24px;" bordered>
      <n-menu :options="menuOptions" @update:value="handleUpdateValue" />
    </n-layout-sider>
    <n-layout>
      <!-- <n-layout-header>header</n-layout-header> -->
      <n-layout-content>
        <RouterView />
      </n-layout-content>
      <!-- <n-layout-footer>footer</n-layout-footer> -->
    </n-layout>
  </n-layout>
</template>

<script setup>
import { h, ref } from "vue";
import { NButton, NAvatar, NIcon, useMessage } from "naive-ui";
import { RouterLink } from "vue-router";
import {
  BookOutline as BookIcon,
  GridOutline as ListIcon,
  PersonOutline as PersonIcon,
  WineOutline as WineIcon,
  HomeOutline as HomeIcon
} from "@vicons/ionicons5";

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const message = useMessage()


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
    key: "todo",
    icon: renderIcon(ListIcon),
  },
  // {
  //   key: "divider-1",
  //   type: "divider",
  //   props: {
  //     style: {
  //       marginLeft: "32px"
  //     }
  //   }
  // },
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
    key: "dance-dance-dance",
    icon: renderIcon(BookIcon),
  }
])

const handleUpdateValue = (key, item) => {
  message.info("[onUpdate:value]: " + JSON.stringify(key));
  message.info("[onUpdate:value]: " + JSON.stringify(item));
}
</script>

<style lang="less" scoped>
.n-layout-header,
.n-layout-footer {
  background: rgba(128, 128, 128, 0.2);
  padding: 24px;
}

// .n-layout-sider {
//   background: rgba(128, 128, 128, 0.3);
// }

// .n-layout-content {
//   background: rgba(128, 128, 128, 0.4);
// }
</style>
