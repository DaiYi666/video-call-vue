<template>
  <section>
    <van-notify v-model:show="peerStore.activateNotification"
                background="rgb(0,0,0,.7)">
      <section>
        <section>
          {{ peerStore.dataConnection?.peer }} 邀您视频通话
        </section>

        <van-divider/>

        <section>
          <van-button type="primary"
                      size="small"
                      @click="acceptVideoCall">
            接受
          </van-button>

          <van-divider vertical/>

          <van-button type="danger"
                      size="small"
                      @click="rejectVideoCall">
            拒绝
          </van-button>
        </section>
      </section>

    </van-notify>
  </section>

  <section>
    <router-view v-slot="{ Component }">
      <keep-alive include="CommunicationView,SettingsView">
        <component :is="Component"/>
      </keep-alive>
    </router-view>
  </section>

  <section>
    <van-tabbar v-model="activatedTabBarItemIndex"
                safe-area-inset-bottom
                placeholder>

      <van-tabbar-item icon="friends-o"
                       to="/friends-list-view">
        朋友
      </van-tabbar-item>

      <van-tabbar-item icon="setting-o"
                       to="/setting-view">
        设置
      </van-tabbar-item>
    </van-tabbar>
  </section>
</template>

<script>
export default {
  name: "MainEntranceView"
}
</script>

<script setup>
import {ref, watch} from "vue";
import usePeerStore from "@/store/peer";
import {showLoadingToast} from "vant";
import {useRouter} from "vue-router";

let activatedTabBarItemIndex = ref(0);

let peerStore = usePeerStore();

let router = useRouter();

function rejectVideoCall() {
  peerStore.dataConnection.send({
    instruction: peerStore.instruction.reject
  });
  peerStore.dataConnection = undefined;
  peerStore.activateNotification = false;
}

function acceptVideoCall() {
  peerStore.activateNotification = false;

  let loadingToast = showLoadingToast({
    duration: 0,
    forbidClick: true,
    loadingType: "spinner",
    message: "waiting for the other party to connect..."
  });

  //监听媒体连接是否存在，有可能速度比较快，所以立即执行以下
  let cancel = watch(() => peerStore.mediaConnection, newValue => {
    if (newValue) {
      //关闭加载框
      loadingToast.close();

      //取消监听；如果不取消会出现重复执行
      cancel();

      router.push({
        path: "/video-call-answer-view"
      });
    }
  }, {immediate: true});

  peerStore.dataConnection.send({
    instruction: peerStore.instruction.accept
  });

}
</script>