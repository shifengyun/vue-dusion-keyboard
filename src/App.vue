<template>
  <div id="app">
    <textarea type="text" data-mode="CN1"></textarea>
    拼音：
    <input type="text" data-mode="CN1" />
    英文：
    <input type="text" data-mode="en" />
    数字：
    <input type="text" data-mode="num" />
    空：
    <input type="text" />
    <input
      v-if="show"
      @focus="$refs.keyboard.show_keyboard"
      @blur="$refs.keyboard.hide_keyboard"
      type="text"
    />
    <vue-dusion-keyboard
      ref="keyboard"
      float
      :blurHide="false"
      size="mini"
      HandWriteApi="http://localhost/HandWriteApi/words"
    ></vue-dusion-keyboard>
    <button>测试</button>

    <!-- :blurHide="false" -->
  </div>
</template>

<script>
export default {
  name: "app",
  mounted() {
    this.show = true;
  },
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
      show: false
    };
  }
};
</script>

<style lang="scss">
#app {
  height: 100%;
  width: 100%;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
