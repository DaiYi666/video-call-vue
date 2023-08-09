import App from "@/App.vue";
import store from "@/store";
import router from "@/router";
import configureVantToast from "@/plugins/configure-vant-toast";
import loadVantDialogCss from "@/plugins/load-vant-dialog-css";
import loadVantNotifyCss from "@/plugins/load-vant-notify-css";
import initializationPeer from "@/plugins/initialization-peer";
import initializationWebSocket from "@/plugins/initialization-web-socket";
import {Lazyload} from "vant";
import {createApp} from "vue";

createApp(App)
    .use(store)
    .use(router)
    .use(configureVantToast)
    .use(loadVantDialogCss)
    .use(loadVantNotifyCss)
    .use(initializationPeer)
    .use(initializationWebSocket)
    .use(Lazyload, {
        lazyComponent: true,
    })
    .mount("#app");