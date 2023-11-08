import App from "@/App.vue";
import store from "@/store";
import router from "@/router";
import configureVantToast from "@/plugins/configure-vant-toast";
import loadVantDialogCss from "@/plugins/load-vant-dialog-css";
import loadVantNotifyCss from "@/plugins/load-vant-notify-css";
import initializePeer from "@/plugins/initialize-peer";
import initializeWebsocket from "@/plugins/initialize-websocket";
import {Lazyload} from "vant";
import {createApp} from "vue";

createApp(App)
    .use(store)
    .use(router)
    .use(configureVantToast)
    .use(loadVantDialogCss)
    .use(loadVantNotifyCss)
    .use(initializePeer)
    .use(initializeWebsocket)
    .use(Lazyload, {
        lazyComponent: true,
    })
    .mount("#app");