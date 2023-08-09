import "vant/es/toast/style";
import {allowMultipleToast} from "vant";

export default {
    install() {
        allowMultipleToast();
        console.log("loaded vant/es/toast/style and invoked allowMultipleToast()");
    }
};