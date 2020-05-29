<template>
  <div class="homeNav">
    <loading :active.sync="isLoading"></loading>
    <nav class="fixed-top navbar navbar-expand-lg navbar-light py-0 px-sm-5 navbar-fixed-top" id="navBar">
      <div class="d-flex">
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
      </div>

      <router-link class="navbar-brand" to="/">
      </router-link>

      <ul class="navbar-nav-row navbar-nav order-lg-1">
        <li class="nav-item d-lg-inline">
          <router-link to="/login" class="nav-link navbar-icon-size mb-0 text-secondary">
            <i class="fas fa-user-circle fa-lg"></i>
          </router-link>
        </li>

        <li class="nav-item dropdown">
          <a href="#" class="nav-link navbar-icon-badge navbar-icon-size mb-0 text-secondary" data-toggle="dropdown">
            <i class="fas fa-heart fa-lg" v-if="isFavShow"></i>
            <i class="far fa-heart fa-lg" v-else></i>
            <span class="badge badge-danger rounded-circle h-number" v-if="isFavShow">{{ favTotal }}</span>
          </a>
          <div class="dropdown-menu favorite-dropdown-menu-right dropdown-menu-right p-3 position-absolute" style="min-width: 280px" data-offset="400">
            <h6>最愛商品列表</h6>
            <p class="empty" v-if="!isFavShow">清單內已無商品</p>
            <table class="table table-sm">
              <tbody>
                <tr v-for="item in favList" :key="item">
                  <td class="align-middle text-center" v-if="isFavShow">
                    <a href="#" class="text-muted" @click="removeFav(item.id)">
                      <i class="far fa-trash-alt trash"></i>
                    </a>
                  </td>
                  <td width="200px" class="align-middle">{{ item }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </li>

        <li class="nav-item dropdown">
          <a href="#" class="nav-link btn-cart navbar-icon-badge navbar-icon-size mb-0 text-secondary" data-toggle="dropdown" data-flip="false">
            <i class="fas fa-shopping-bag fa-lg"></i>
            <span class="badge badge-danger rounded-circle cart-number" v-if="isCartShow">{{countTotal}}</span>
          </a>
          <div class="dropdown-menu dropdown-menu-right position-absolute p-3" style="min-width: 300px" data-offset="400">
            <h6>已選擇商品</h6>
            <p class="empty"  v-if="!isCartShow">清單內已無商品</p>
            <table class="table table-sm">
              <tbody>
                <tr  v-for="(item, index) in cart.carts" :key="index">
                  <td class="align-middle text-center"  v-if="isCartShow">
                    <a href="#" class="text-muted" @click="removCartProduct(item.id)">
                      <i class="far fa-trash-alt trash"></i>
                    </a>
                  </td>
                  <td class="align-middle">{{ item.product.title }}</td>
                  <td width="40" class="align-middle"></td>
                  <td class="align-middle text-right"></td>
                </tr>
              </tbody>
            </table>
            <router-link class="btn btn-primary btn-block" to="/checkout">
              <i class="fa fa-cart-plus" aria-hidden="true"></i> 結帳去
            </router-link>
          </div>
        </li>
      </ul>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link class="nav-link" to="/">首頁</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/productlist" class="nav-link text-dark">
              產品
            </router-link>
          </li>
        </ul>
      </div>
    </nav>
    <Alert></Alert>
  </div>
</template>

<script>
import Alert from './Alert'
import $ from 'jquery'

export default {
  name: 'HomeNavbar',
  props: ['favoriteprop'],
  components: {
    Alert
  },
  data () {
    return {
      favTotal: 0,
      isFavShow: false,
      favList: [],
      favoriteItem: JSON.parse(localStorage.getItem('favoriteItemId')) || [],
      isCartShow: false,
      countTotal: 0,
      cart: {},
      isLoading: false
    }
  },
  created () {
    this.CheckFavorite()
    this.getFavProduct()
    this.getCart()
  },
  methods: {
    CheckFavorite () {
      const vm = this
      vm.favTotal = vm.favoriteItem.length
      if (vm.favoriteItem.length !== 0) {
        vm.isFavShow = true
      } else {
        vm.isFavShow = false
      }
    },
    getFavProduct () {
      const vm = this
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOM_PATH}/products/all`
      this.$http.get(api).then((response) => {
        const productItem = response.data.products
        productItem.filter((item) => {
          if (vm.favoriteItem.indexOf(item.id) !== -1) {
            vm.favList.push(item.title)
          }
          return item
        })
      })
    },
    removeFav (id) {
      const vm = this
      vm.isLoading = true
      vm.favData = vm.favoriteItem.indexOf(id)
      vm.favoriteItem.splice(vm.favData, 1)
      localStorage.setItem('favoriteItemId', JSON.stringify(vm.favoriteItem))
      vm.CheckFavorite()
      setTimeout(() => {
        vm.$bus.$emit('returnFavItem', id)
      }, 100)
      vm.isLoading = false
    },
    getCart () {
      const vm = this
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOM_PATH}/cart`
      vm.isLoading = true
      vm.$http.get(api).then((response) => {
        vm.cart = response.data.data
        console.log('購物車內容', vm.cart)
        vm.countTotal = vm.cart.carts.length
        if (vm.cart.carts.length === 0) {
          vm.isCartShow = false
        } else {
          vm.isCartShow = true
        }
        vm.isLoading = false
      })
    },
    removCartProduct (id) {
      const vm = this
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOM_PATH}/cart/${id}`
      vm.isLoading = true
      vm.$http.delete(api).then(() => {
        vm.getCart()
        vm.isLoading = false
        vm.$bus.$emit('updateOrderCart')
      })
    }
  },
  watch: {
    favoriteItem () {
      const vm = this
      if (vm.favList.length !== vm.favoriteItem.length) {
        vm.favList = []
        vm.getFavProduct()
      }
    }
  },
  mounted () {
    const vm = this
    vm.$bus.$on('updateCart', () => {
      vm.getCart()
    })
    vm.$bus.$on('updateFavItem', (newFavItem) => {
      vm.favoriteItem = newFavItem
      vm.CheckFavorite()
    })
    // 導覽列變色
    $(document).ready(function () {
      $(document).scroll(function () { // check if scroll event happened
        if ($(document).scrollTop() > 50) { // check if user scrolled more than 50 from top of the browser window
          $('.navbar-fixed-top').css('background-color', 'rgba(255,255,255,1)') // if yes, then change the color of class "navbar-fixed-top" to white (#f8f8f8)
        } else {
          $('.navbar-fixed-top').css('background-color', 'rgba(255,255,255,0.9)') // if not, change it back to transparent
        }
      })
    })
  }
}
</script>

<style lang="scss" scoped>
.homeNav {
  font-family: 微軟正黑體
}
.navbar-nav-row{
  flex-direction: row;
  .nav-link{
    padding-right:.5rem;
    padding-left:.5rem;
  }
}
.navbar-fixed-top {
  background: rgba(255,255,255,0.9)
}
.navbar-nav li a {
 line-height: 50px;
}

.text-dark {
  color: black
}

.trash:hover{
  color: red
}
.h-number{
  position:absolute;
  left:20px;
  top:30px
}
.cart-number{
  position:absolute;
  left:20px;
  top:30px
}
</style>
