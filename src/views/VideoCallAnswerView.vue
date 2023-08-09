<template>
  <section class="container">
    <video class="main-video"
           ref="mainVideo"
           :poster="poster"
           autoplay>
    </video>

    <video class="secondary-video"
           ref="secondaryVideo"
           :poster="poster"
           autoplay>
    </video>

    <section class="bottom-bar">
      <van-button v-if="isConnected"
                  type="danger"
                  block
                  @click="ringOffVideoCall">
        挂断视频通话
      </van-button>
    </section>
  </section>
</template>

<script setup>
import poster from "@/assets/poster.gif";
import usePeerStore from "@/store/peer";

import {onMounted, ref, watch} from "vue";
import {useRouter} from "vue-router";

import {showToast} from "vant";

let mainVideo = ref();
let secondaryVideo = ref();

let localUserMedia = ref();

let peerStore = usePeerStore();

let router = useRouter();

//用于标记是否已经连接
let isConnected = ref(false);

onMounted(() => {
  getLocalUserMedia({audio: true, video: true}).then(userMedia => {
    mainVideo.value.srcObject = userMedia;
    localUserMedia.value = userMedia;

    //先回应
    peerStore.mediaConnection.answer(localUserMedia.value);
    peerStore.mediaConnection.on("stream", remoteUserMedia => {
      mainVideo.value.srcObject = remoteUserMedia;

      secondaryVideo.value.srcObject = localUserMedia.value;
      isConnected.value = true;
      showToast("connected");
    });

  }).catch(() => {
    showToast("failed to obtain local video media");
    router.back();
  });
});

//监听对方挂断
let cancel = watch(() => [peerStore.dataConnection, peerStore.mediaConnection], ([dataConnection, mediaConnection]) => {
  //两个连接都为空说明对方已经挂了
  if (dataConnection === undefined && mediaConnection === undefined) {
    cancel();

    if (localUserMedia.value) {
      for (let track of localUserMedia.value.getTracks()) {
        track.stop();
      }
    }

    showToast("the other party has hung up");

    router.back();
  }
}, {immediate: true});


function getLocalUserMedia(constrains) {
  if (window.navigator.mediaDevices.getUserMedia) {
    return window.navigator.mediaDevices.getUserMedia(constrains);
  } else if (window.navigator.webkitGetUserMedia) {
    return window.navigator.webkitGetUserMedia(constrains);
  } else if (window.navigator.mozGetUserMedia) {
    return window.navigator.mozGetUserMedia(constrains);
  } else if (window.navigator.getUserMedia) {
    return window.navigator.getUserMedia(constrains);
  }
  throw new Error("unable to get user media");
}


function ringOffVideoCall() {
  //先取消上面的监听
  cancel();

  for (let track of localUserMedia.value?.getTracks()) {
    track.stop();
  }

  peerStore.dataConnection.send({
    instruction: peerStore.instruction.ringOff
  });

  peerStore.dataConnection = undefined;

  peerStore.mediaConnection = undefined;

  router.back();
}
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  //background-color: black;
  position: relative;

  .secondary-video {
    position: absolute;
    z-index: 2;
    border-radius: 0.625rem;
    width: 30%;
    top: 0.3125rem;
    right: 0.3125rem;
  }

  .main-video {
    position: absolute;
    border-radius: 0.625rem;
    width: 100%;
    height: 100%;
  }

  .bottom-bar {
    width: 100%;
    position: absolute;
    bottom: 0.625rem;
  }
}
</style>