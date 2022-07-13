import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { sayHello } from '@monorepo-start/shared';

createApp(App).use(router).mount('#app');

sayHello();
