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
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
