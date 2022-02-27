import Layout from "@/layout/index.vue";
import router from "../../router";
import store from "../../store";
import axios from "axios";
import Vue from "vue";

export function generaMenu() {
  // const a = [
  //   {
  //     name: null,
  //     path: "/",
  //     component: "Layout",
  //     icon: null,
  //     hidden: false,
  //     children: [
  //       {
  //         name: "首页",
  //         path: "",
  //         component: "/home/Home.vue",
  //         icon: "el-icon-myshouye",
  //         hidden: null,
  //         children: null
  //       }
  //     ]
  //   },
  //   {
  //     name: "文章管理",
  //     path: "/article-submenu",
  //     component: "Layout",
  //     icon: "el-icon-mywenzhang-copy",
  //     hidden: false,
  //     children: [
  //       {
  //         name: "发布文章",
  //         path: "/articles",
  //         component: "/article/Article.vue",
  //         icon: "el-icon-myfabiaowenzhang",
  //         hidden: false,
  //         children: null
  //       },
  //       {
  //         name: "修改文章",
  //         path: "/articles/*",
  //         component: "/article/Article.vue",
  //         icon: "el-icon-myfabiaowenzhang",
  //         hidden: true,
  //         children: null
  //       },
  //       {
  //         name: "文章列表",
  //         path: "/article-list",
  //         component: "/article/ArticleList.vue",
  //         icon: "el-icon-mywenzhangliebiao",
  //         hidden: false,
  //         children: null
  //       },
  //       {
  //         name: "分类管理",
  //         path: "/categories",
  //         component: "/category/Category.vue",
  //         icon: "el-icon-myfenlei",
  //         hidden: false,
  //         children: null
  //       },
  //       {
  //         name: "标签管理",
  //         path: "/tags",
  //         component: "/tag/Tag.vue",
  //         icon: "el-icon-myicontag",
  //         hidden: false,
  //         children: null
  //       }
  //     ]
  //   },
  //   {
  //     name: "消息管理",
  //     path: "/message-submenu",
  //     component: "Layout",
  //     icon: "el-icon-myxiaoxi",
  //     hidden: false,
  //     children: [
  //       {
  //         name: "评论管理",
  //         path: "/comments",
  //         component: "/comment/Comment.vue",
  //         icon: "el-icon-mypinglunzu",
  //         hidden: false,
  //         children: null
  //       },
  //       {
  //         name: "留言管理",
  //         path: "/messages",
  //         component: "/message/Message.vue",
  //         icon: "el-icon-myliuyan",
  //         hidden: false,
  //         children: null
  //       }
  //     ]
  //   },
  //   {
  //     name: "权限管理",
  //     path: "/permission-submenu",
  //     component: "Layout",
  //     icon: "el-icon-mydaohanglantubiao_quanxianguanli",
  //     hidden: false,
  //     children: [
  //       {
  //         name: "菜单管理",
  //         path: "/menus",
  //         component: "/menu/Menu.vue",
  //         icon: "el-icon-mycaidan",
  //         hidden: false,
  //         children: null
  //       },
  //       {
  //         name: "接口管理",
  //         path: "/resources",
  //         component: "/resource/Resource.vue",
  //         icon: "el-icon-myjiekouguanli",
  //         hidden: false,
  //         children: null
  //       },
  //       {
  //         name: "角色管理",
  //         path: "/roles",
  //         component: "/role/Role.vue",
  //         icon: "el-icon-myjiaoseliebiao",
  //         hidden: false,
  //         children: null
  //       }
  //     ]
  //   },
  //   {
  //     name: "用户管理",
  //     path: "/users-submenu",
  //     component: "Layout",
  //     icon: "el-icon-myyonghuliebiao",
  //     hidden: false,
  //     children: [
  //       {
  //         name: "用户列表",
  //         path: "/users",
  //         component: "/user/User.vue",
  //         icon: "el-icon-myyonghuliebiao",
  //         hidden: false,
  //         children: null
  //       },
  //       {
  //         name: "在线用户",
  //         path: "/online/users",
  //         component: "/user/Online.vue",
  //         icon: "el-icon-myyonghuliebiao",
  //         hidden: false,
  //         children: null
  //       }
  //     ]
  //   },
  //   {
  //     name: "相册管理",
  //     path: "/album-submenu",
  //     component: "Layout",
  //     icon: "el-icon-myimage-fill",
  //     hidden: false,
  //     children: [
  //       {
  //         name: "照片管理",
  //         path: "/albums/:albumId",
  //         component: "/album/Photo.vue",
  //         icon: "el-icon-myzhaopian",
  //         hidden: true,
  //         children: null
  //       },
  //       {
  //         name: "相册列表",
  //         path: "/albums",
  //         component: "/album/Album.vue",
  //         icon: "el-icon-myzhaopian",
  //         hidden: false,
  //         children: null
  //       },
  //       {
  //         name: "照片回收站",
  //         path: "/photos/delete",
  //         component: "/album/Delete.vue",
  //         icon: "el-icon-myhuishouzhan",
  //         hidden: true,
  //         children: null
  //       }
  //     ]
  //   },
  //   {
  //     name: "系统管理",
  //     path: "/system-submenu",
  //     component: "Layout",
  //     icon: "el-icon-myshezhi",
  //     hidden: false,
  //     children: [
  //       {
  //         name: "网站管理",
  //         path: "/website",
  //         component: "/website/Website.vue",
  //         icon: "el-icon-myxitong",
  //         hidden: false,
  //         children: null
  //       },
  //       {
  //         name: "页面管理",
  //         path: "/pages",
  //         component: "/page/Page.vue",
  //         icon: "el-icon-myyemianpeizhi",
  //         hidden: false,
  //         children: null
  //       },
  //       {
  //         name: "友链管理",
  //         path: "/links",
  //         component: "/friendLink/FriendLink.vue",
  //         icon: "el-icon-mydashujukeshihuaico-",
  //         hidden: false,
  //         children: null
  //       },
  //       {
  //         name: "关于我",
  //         path: "/about",
  //         component: "/about/About.vue",
  //         icon: "el-icon-myguanyuwo",
  //         hidden: false,
  //         children: null
  //       }
  //     ]
  //   },
  //   {
  //     name: "日志管理",
  //     path: "/log-submenu",
  //     component: "Layout",
  //     icon: "el-icon-myguanyuwo",
  //     hidden: false,
  //     children: [
  //       {
  //         name: "操作日志",
  //         path: "/operation/log",
  //         component: "/log/Operation.vue",
  //         icon: "el-icon-myguanyuwo",
  //         hidden: false,
  //         children: null
  //       }
  //     ]
  //   },
  //   {
  //     name: null,
  //     path: "/setting",
  //     component: "Layout",
  //     icon: null,
  //     hidden: false,
  //     children: [
  //       {
  //         name: "个人中心",
  //         path: "",
  //         component: "/setting/Setting.vue",
  //         icon: "el-icon-myuser",
  //         hidden: null,
  //         children: null
  //       }
  //     ]
  //   }
  // ];
  // a.forEach(item => {
  //   if (item.icon != null) {
  //     item.icon = "iconfont " + item.icon;
  //   }
  //   if (item.component == "Layout") {
  //     item.component = Layout;
  //   }
  //   if (item.children && item.children.length > 0) {
  //     item.children.forEach(route => {
  //       route.icon = "iconfont " + route.icon;
  //       route.component = loadView(route.component);
  //     });
  //   }
  // });
  // // 添加侧边栏菜单
  // store.commit("saveUserMenuList", a);
  // // 添加菜单到路由
  // router.addRoutes(a);
  // 查询用户菜单
  axios.get("/api/server/menu/listUserMenus").then(({ data }) => {
    if (data.flag) {
      var userMenuList = data.data;
      userMenuList.forEach(item => {
        if (item.icon != null) {
          item.icon = "iconfont " + item.icon;
        }
        if (item.component == "Layout") {
          item.component = Layout;
        }
        if (item.children && item.children.length > 0) {
          item.children.forEach(route => {
            route.icon = "iconfont " + route.icon;
            route.component = loadView(route.component);
          });
        }
      });
      // 添加侧边栏菜单
      store.commit("saveUserMenuList", userMenuList);
      // 添加菜单到路由
      router.addRoutes(userMenuList);
    } else {
      Vue.prototype.$message.error(data.message);
      router.push({ path: "/login" });
    }
  });
}

export const loadView = view => {
  // 路由懒加载
  return resolve => require([`@/views${view}`], resolve);
};
