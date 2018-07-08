<!-- Корневой элемент приложения -->

<template>
  <div id="app">
    <Tabs
      v-model="activeTab"
      :items="tabs"/>
    <AboutScript/>
  </div>
</template>

<script>
import Vue from 'vue';
import Window from 'Base/Window';
import AboutScript from '@/AboutScript';
import {vModel} from 'JavaScript/VuexHelpers';

export default {
  extends: Window,
  components: {
    AboutScript
  },
  computed: {
    ...vModel([
      'activeTab'
    ]),
    tabs: () => [
      {
        key: 1,
        caption: lc('Все скрипты'),
        component: require('@/AllScripts').default
      },
      {
        key: 2,
        caption: lc('Этот сайт'),
        component: require('@/CurrentSiteScripts').default
      },
      {
        key: 3,
        caption: lc('Настройки'),
        component: require('@/Settings').default
      }
    ]
  },
  created() {
    Vue.prototype.$mainWindow = this;
  }
};
</script>

<style lang="scss">
$bg: #fefefe;
$text: #000;

/* Подключаем основной шрифт */
@font-face {
  font-family: Roboto;
  src: local('Roboto'), 
    local('Roboto-Regular'), 
    url(Assets/fonts/Roboto/Roboto.woff2) format('woff2'), 
    url(Assets/fonts/Roboto/Roboto.woff) format('woff'), 
    url(Assets/fonts/Roboto/Roboto.ttf) format('truetype');
  font-weight: 400;
  font-style: normal;
}

/* Подключаем иконочный шрифт*/
@font-face {
  font-family: 'web_corrector_font';
  src: url(Assets/fonts/web_icon/web_icon.eot);
  src: url(Assets/fonts/web_icon/web_icon.eot#iefix) format('embedded-opentype'),
       url(Assets/fonts/web_icon/web_icon.woff2) format('woff2'),
       url(Assets/fonts/web_icon/web_icon.woff) format('woff'),
       url(Assets/fonts/web_icon/web_icon.ttf) format('truetype'),
       url(Assets/fonts/web_icon/web_icon.svg#web_icon) format('svg');
  font-weight: normal;
  font-style: normal;
}

[class^="icon-"]:before, [class*=" icon-"]:before {
  font-family: "web_corrector_font";
  font-style: normal;
  font-weight: normal;
  speak: none;
 
  display: inline-block;
  text-decoration: inherit;
  width: 1em;
  text-align: center;
 
  font-variant: normal;
  text-transform: none;
 
  line-height: 1em;
 
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
 }
 
// icon-font
.icon-pencil:before { content: '\e800'; }
.icon-forward:before { content: '\e801'; }
.icon-floppy:before { content: '\e802'; }
.icon-trash-empty:before { content: '\e803'; }
.icon-play:before { content: '\e804'; }
.icon-filter:before { content: '\e805'; }
.icon-help:before { content: '\f128'; }

body {
  transition: width .3s, height .3s;
  width: 350px;
  height: 400px;

  margin: 0;
  background: $bg;

  font: 14px Roboto;
  color: $text;
}

#app {
  height: 100%;
}
</style>