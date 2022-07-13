import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { useLog } from '@/hooks';
import { sayHello } from '@monorepo-start/shared';

useLog();

createApp(App).use(router).mount('#app');

sayHello();
