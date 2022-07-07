import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { useLog } from '@/hooks';

useLog();

createApp(App).use(router).mount('#app');
