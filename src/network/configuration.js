export default {
    server: {
        webSocketServer: {
            host: "localhost",
            port: 8081,
            path: "/peerServerEndpoint"
        },
        peerServer: {
            host: "localhost",
            port: 9000,
            path: "/"
        }
    }
};