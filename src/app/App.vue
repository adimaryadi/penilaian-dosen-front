<template>
  <div id="app">
    <notifications group="notif" animation-type="velocity" position="top left"/>
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'app'
}
</script>