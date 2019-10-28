import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/index'
import PerfilEmpleado from '../components/PerfilEmpleado.vue'
import SolicitudesEmpleado from '../components/SolicitudesEmpleado.vue'
import Empleados from '../components/Empleados.vue'
import Solicitudes from '../components/Solicitudes.vue'
import Login from '../components/Login.vue'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/empleados',
      name: 'empleados',
      component: Empleados,
      meta: { 
        requiresAuth: true,
        isAdmin:true,
        // user:true
      }
    },
    {
      path: '/solicitudes',
      name: 'solicitudes',
      component: Solicitudes,
      meta: { 
        requiresAuth: true,
        isAdmin:true,
        // user:true
      }
    },
    {
      path: '/perfilEmpleado',
      name: 'perfilEmpleado',
      component: PerfilEmpleado,
      meta: { 
        requiresAuth: true,
       // isAdmin:true,
        user:true
      }
    },
    {
      path: '/solicitudesEmpleado',
      name: 'solicitudesEmpleado',
      component: SolicitudesEmpleado,
      meta: { 
        requiresAuth: true,
       // isAdmin:true,
        user:true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isLoggedIn) {
      if (to.meta.isAdmin) {
        if (localStorage.user=='admin') {
          next()
        } else {
          next('/solicitudes')
        }
      }else if(to.meta.user){
        if (localStorage.user=='empleado') {
          next()
        } else {
          next('/empleados')
        }
      }
     // next()
    }else{
      next('/')
    }
  } else {
    next() 
  }
})

export default router
