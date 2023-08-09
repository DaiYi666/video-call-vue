import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { createPinia } from "pinia";

let store = createPinia();
store.use(piniaPluginPersistedstate);

export default store;