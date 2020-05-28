import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/pages/Login.vue'
import Dashboard from '@/components/pages/Dashboard.vue'
import Products from '@/components/pages/Products.vue'
import OrderList from '@/components/pages/OrderList.vue'
import Coupon from '@/components/pages/Coupon.vue'
import CustomerOrder from '@/components/pages/CustomerOrder.vue'
import CustomerCheckout from '@/components/pages/CustomerCheckout.vue'
import Home from '@/components/pages/Home.vue'
import Checkout from '@/components/pages/Checkout.vue'
import ProductList from '@/components/pages/ProductList.vue'
import ProductDetail from '@/components/pages/ProductDetail.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '*',
    redirect: 'login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/admin',
    name: 'Dashboard',
    component: Dashboard,
    children: [
      {
        path: 'products',
        name: 'Products',
        component: Products,
        meta: { requiresAuth: true }
      },
      {
        path: 'orderlist',
        name: 'OrderList',
        component: OrderList,
        meta: { requiresAuth: true }
      },
      {
        path: 'coupon',
        name: 'Coupon',
        component: Coupon,
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    children: [
      {
        path: 'custom_order',
        name: 'CustomerOrder',
        component: CustomerOrder
      },
      {
        path: 'customer_checkout',
        name: 'CustomerCheckout',
        component: CustomerCheckout
      }
    ]
  },
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: Checkout
  },
  {
    path: '/productlist',
    name: 'ProductList',
    component: ProductList
  },
  {
    path: '/productdetail/:id',
    name: 'ProductDetail',
    component: ProductDetail
  }
]

const router = new VueRouter({
  routes,
  linkActiveClass: 'active'
})

export default router
