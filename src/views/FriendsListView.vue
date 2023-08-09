<template>
  <section>
    <van-nav-bar title="朋友"
                 fixed
                 placeholder
                 safe-area-inset-top/>
  </section>

  <section>
    <van-search placeholder="请输入搜索关键词"/>
  </section>

  <section v-if="friendStore.onlineList.length">
    <van-divider>在线的朋友 轻触可开始视频聊天</van-divider>

    <section v-for="peerId of friendStore.onlineList"
             :key="peerId">
      <friend-card v-if="peerId === peerStore.localPeer.id">
        {{ peerId }}(我)
      </friend-card>
      <friend-card v-else
                   @click="jumpToVideoCallCallingView(peerId)">
        {{ peerId }}
      </friend-card>
    </section>
  </section>
</template>

<script setup>
import useFriendStore from "@/store/friend";
import usePeerStore from "@/store/peer";
import FriendCard from "@/components/FriendCard.vue";
import {useRouter} from "vue-router";
import {showToast} from "vant";

let friendStore = useFriendStore();
let peerStore = usePeerStore();

let router = useRouter();

function jumpToVideoCallCallingView(calleePeerId) {
  if (peerStore.localPeer && peerStore.localPeer.open) {
    if (peerStore.dataConnection) {
      showToast("currently busy");
    } else {
      router.push({
        path: "/video-call-calling-view",
        query: {
          calleePeerId
        }
      });
    }
  } else {
    showToast("local peer not opened");
  }
}
</script>