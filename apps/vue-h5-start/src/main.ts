import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { sayHello } from 'shared';

createApp(App).use(router).mount('#app');

sayHello();
