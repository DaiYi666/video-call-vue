import {createRouter, createWebHashHistory} from "vue-router";
import {showLoadingToast} from "vant";

let router = createRouter({
    history: createWebHashHistory(process.env.BASE_URL),
    routes: [
        {
            path: "/",
            component: () => import("@/views/MainEntranceView.vue"),
            children: [
                {
                    path: "/",
                    redirect: "/friends-list-view"
                },
                {
                    path: "friends-list-view",
                    component: () => import("@/views/FriendsListView.vue")
                },
                {
                    path: "setting-view",
                    component: () => import("@/views/SettingsView.vue")
                }
            ]
        },
        {
            path: "/video-call-calling-view",
            component: () => import("@/views/VideoCallCallingView.vue")
        },
        {
            path: "/video-call-answer-view",
            component: () => import("@/views/VideoCallAnswerView.vue")
        }
    ]
});

router.beforeEach((to, from, next) => {
    from.meta.loadingToast = showLoadingToast({
        duration: 0,
        forbidClick: true,
        loadingType: "spinner",
        message: "loading..."
    });
    next();
});

router.afterEach((to, from) => {
    //当页面被缓存时，有可能from.meta.loadingToast为空，所以用可选链操作符
    from.meta.loadingToast?.close();
});

export default router;