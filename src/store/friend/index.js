import {defineStore} from "pinia";

export default defineStore("friendStore", {
    state() {
        return {
            onlineList: []
        };
    }
});