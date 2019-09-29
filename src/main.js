/* eslint-disable */
try {
  window.Popper = require('popper.js').default;
  window.$ = window.jQuery = require('jquery');
  require('bootstrap');
} catch (e) { }

window.axios = require('axios');
import 'bootstrap/dist/css/bootstrap.min.css'

import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false


router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    if (localStorage.getItem('token') == null) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
  }
  else {
    if (localStorage.getItem('token') != null && (to.matched.some(record => record.name == 'login') || to.matched.some(record => record.name == 'signup'))) {
      next({
        path: '/'
      });
    } else {
      next();
    }
  }
});
router.afterEach((to, from) => {
  document.title = to.meta.title || 'Welcome';
  //$('#navbar-collapse').collapse('hide');
});

new Vue({
  router,
  render: function (h) { return h(App) }
}).$mount('#app')
