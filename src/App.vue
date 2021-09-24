<template>
  <main>
    <router-view></router-view>
  </main>
</template>

<style lang="scss">
  html, body {
    padding: 0;
    margin: 0;
  }

  main {
    box-sizing: border-box;
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>