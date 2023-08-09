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

      <van-button v-else
                  type="danger"
                  block
                  @click="cancelVideoCall">
        取消视频通话
      </van-button>
    </section>
  </section>
</template>

<script setup>
import poster from "@/assets/poster.gif";
import usePeerStore from "@/store/peer";

import {onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";

import {showToast} from "vant";

let mainVideo = ref();
let secondaryVideo = ref();

let localUserMedia = ref();

let peerStore = usePeerStore();

let router = useRouter();
let route = useRoute();

//用于标记是否已经连接
let isConnected = ref(false);

onMounted(() => {
  getLocalUserMedia({audio: true, video: true}).then(userMedia => {
    mainVideo.value.srcObject = userMedia;
    localUserMedia.value = userMedia;

    peerStore.dataConnection = peerStore.localPeer.connect(route.query.calleePeerId);
    //对对方发过来的数据进行判断
    peerStore.dataConnection.on("data", data => {
      if (data.instruction === peerStore.instruction.accept) {//接受
        peerStore.mediaConnection = peerStore.localPeer.call(route.query.calleePeerId, localUserMedia.value);
        peerStore.mediaConnection.on("stream", userMedia => {
          mainVideo.value.srcObject = userMedia;
          //视图互换一下，把对方放在主视图上
          secondaryVideo.value.srcObject = localUserMedia.value;
          isConnected.value = true;
          showToast("connected");
        });

      } else if (data.instruction === peerStore.instruction.busy) {//忙线
        //由于是对方通知关闭连接，所以此处调用close
        peerStore.dataConnection.close();
        peerStore.dataConnection = undefined;

        for (let track of localUserMedia.value?.getTracks()) {
          track.stop();
        }

        showToast("the other party is busy on the line");

        router.back();
      } else if (data.instruction === peerStore.instruction.reject) {//拒绝
        //由于是对方通知关闭连接，所以此处调用close
        peerStore.dataConnection.close();
        peerStore.dataConnection = undefined;

        for (let track of localUserMedia.value?.getTracks()) {
          track.stop();
        }

        showToast("the other party refused");

        router.back();
      } else if (data.instruction === peerStore.instruction.ringOff) {//挂断
        //由于是对方通知关闭连接，所以此处调用close
        peerStore.dataConnection.close();
        peerStore.dataConnection = undefined;

        peerStore.mediaConnection.close();
        peerStore.mediaConnection = undefined;

        for (let track of localUserMedia.value?.getTracks()) {
          track.stop();
        }

        showToast("the other party has hung up");

        router.back();
      }
    });

    //当连接被打开的时候理解发送一个指令给对方
    peerStore.dataConnection.on("open", () => {
      peerStore.dataConnection.send({
        instruction: peerStore.instruction.request
      });
    });
  }).catch(() => {
    showToast("failed to obtain local video media");
    router.back();
  });
});


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


function cancelVideoCall() {
  for (let track of localUserMedia.value?.getTracks()) {
    track.stop();
  }

  //有可能连接还没建立，所以这里用可选链操作符
  peerStore.dataConnection?.send({
    instruction: peerStore.instruction.cancel
  });

  peerStore.dataConnection = undefined;

  router.back();
}

function ringOffVideoCall() {
  for (let track of localUserMedia.value?.getTracks()) {
    track.stop();
  }

  //挂断的时候这个连接肯定不为空，所以无需判断
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