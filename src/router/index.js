// import type {RouteRecordRaw} from 'vue-router'
import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    redirect: "/todo",
    component: () => import("../layout/index.vue"),
    children: [
      {
        path: "todo",
        component: () => import("../views/todo/index.vue"),
        name: "todo",
      },
      {
        path: "accountBook",
        component: () => import("../views/accountBook/index.vue"),
        name: "accountBook",
      },
    ],
  },
  {
    path: "/404",
    component: () => import("../views/notPage/index.vue"),
    name: "notPage404",
  },
  {
    path: "/:catchAll(.*)", // 不识别的path自动匹配404
    redirect: "/404",
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
