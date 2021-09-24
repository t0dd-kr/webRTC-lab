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
    send,
    initialize
  } from '@/rtc/connection';

  let connected = ref(false)

  async function init() {
    await initialize(true)
    onLocalStream()
  }
</script>

<template>
  <div class="container-video">
    <video autoplay></video>
  </div>
  <div class="interface">
    <div>{{ $route.params }}</div>
    <div>{{ connected }}</div>
    <button @click="init">방 생성</button>
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
