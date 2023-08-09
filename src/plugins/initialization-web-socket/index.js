import ReconnectingWebSocket from "reconnecting-websocket";
import networkConfiguration from "@/network/configuration";
import usePeerStore from "@/store/peer";
import useFriendStore from "@/store/friend";
import {showToast} from "vant";

export default {
    install(app) {
        console.log("invoked initialization web socket plugin");
        app.config.globalProperties.$initializationPeer?.then(() => {
            let peerStore = usePeerStore();
            let friendStore = useFriendStore();

            let {host, port, path} = {...networkConfiguration.server.webSocketServer};

            let connection = new ReconnectingWebSocket(`ws://${host}:${port}${path}/${peerStore.localPeer.id}`);

            connection.onmessage = event => {
                let message = JSON.parse(event.data);
                friendStore.onlineList = message;
                console.log("webSocketConnection.onmessage:", message);
            };

            connection.onclose = event => {
                console.log("webSocketConnection.onclose:", event);
                showToast("network connection closed");
            };

            connection.onerror = event => {
                console.log("webSocketConnection.onerror:", event);
                showToast("network connection error");
            };

            connection.onopen = event => {
                console.log("webSocketConnection.onopen:", event);
            };
        });
    }
};