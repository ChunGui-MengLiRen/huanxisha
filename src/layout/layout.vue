<template>
  <div class="content" style="padding:24px">
    <n-data-table :columns="columns" :data="data" :pagination="pagination" :bordered="false" />
  </div>
</template>

<script>
import { h, defineComponent } from "vue";
import { NButton, useMessage } from "naive-ui";


const createColumns = ({
  play
}) => {
  return [
    {
      title: "序号",
      key: "no"
    },
    {
      title: "标题",
      key: "title"
    },
    {
      title: "长度",
      key: "length"
    },
    {
      title: "操作",
      key: "actions",
      render(row) {
        return h(
          NButton,
          {
            strong: true,
            tertiary: true,
            size: "small",
            onClick: () => play(row)
          },
          { default: () => "Play" }
        );
      }
    }
  ];
};

const data = [
  { no: 1, title: "Wonderwall", length: "4:18" },
  { no: 2, title: "Don't Look Back in Anger", length: "4:48" },
  { no: 3, title: "Champagne Supernova", length: "7:27" }
];

export default defineComponent({
  setup() {
    const message = useMessage();
    return {
      data,
      columns: createColumns({
        play(row) {
          message.info(`Play ${row.title}`);
        }
      }),
      pagination: false
    };
  }
});
</script>