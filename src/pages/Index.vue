<script setup lang="ts">
  import { ref } from 'vue'
  import initRTC from '@/rtc'
  initRTC()

  import { ScreenHandler, MediaHandler, isMobile, isSafari, mediaConstraints } from '@/rtc/utils';

  import { 
    bindDomEvent,
    bindSocketEvent,
    bindPeerEvent,
    onDetectUser,
    onJoin,
    onLeave,
    onMessage,
    onLocalStream,
    onRemoteStream,
    handleJoinRoom,
    send,
    initialize
  } from '@/rtc/connection';

  let connected = ref(false)
</script>

<template>
  <div class="container-video">
    <video autoplay id="remote"></video>
  </div>
  <div class="interface">
    <div>{{ connected }}</div>
    <button @click="initialize()">초기화</button>
    <button @click="handleJoinRoom">연결하기</button>
  </div>
</template>

<style scoped lang="scss">
  .container-video {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    
    & video {
      max-width: 100vw;
      max-height: 100vh;
    }
  }
  .interface {
    position: fixed;
    bottom: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.75);
    color: #fff;
    border-radius: 4px;
    padding: 10px;
    text-align: right;
    & > * {
      margin: 4px 0;
      width: 100%;
    }
  }
</style>


