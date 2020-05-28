<template>
<div class="detail">
<HomeNavbar></HomeNavbar>
<div class="container mt-5">
<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item">
      <router-link to="/" class="text-decoration-none">首頁</router-link>
    </li>
    <li class="breadcrumb-item">
      <router-link to="/productlist" class="text-decoration-none">商品頁</router-link>
    </li>
    <li class="breadcrumb-item"><a class="text-decoration-none" href="#">{{product.title}}</a></li>
  </ol>
</nav>
 <div class="row mt-2">
 <div class="col-md-12 col-lg-8">
 <img :src='imgSrc' class="bg-item"/>
 <h5 class="mt-5 font-weight-bold">商品介紹</h5>
 <hr>
 <p>
 {{product.content}}
 </p>
 </div>
<div class="col-md-12 col-lg-4">
<h3 class="font-weight-bold">{{product.title}}</h3>
<div class="d-flex mt-4 mb-4 align-items-end">
<span class="font-weight-bold price-text">{{ product.price | currency }}</span>
<span class="ml-3 text-secondary origin-price-text">{{ product.origin_price | currency }}</span>
</div>
<div>數量</div>
<select class="rounded-0 text-center form-control num-select" v-model="itemNum">
  <option value="0" disabled selected>數量</option>
  <option :value="num" v-for="num in 9" :key="num" >
    {{ num }} {{ product.unit }}
  </option>
</select>
<button type="button" class="btn btn-primary bg-pink btn-lg btn-block"
@click.prevent="addtoCart(product.id, itemNum)">
<i class="fas fa-shopping-bag fa-lg text-white"
style="font-size:20px"></i>
放入購物車</button>
<button type="button" class="btn btn-outline-secondary btn-lg btn-block"
@click="addFavorite(product.title, product.id)">
<i class="far fa-heart"
v-if="!checkFavStatus(product.id)"
style="font-size:20px"></i>
<i class="fas fa-heart"
v-if="checkFavStatus(product.id)"
style="font-size:20px"></i>
收藏商品</button>
</div>
 </div>
  <div>
 <h5 class="mt-5 font-weight-bold">你可能也會喜歡</h5>
 <hr>
 <div class="row">
 <div class="col-md-2 card-margin"  v-for="item in filterProduct" :key="item.id">
   <div class="card rounded-0 border-0">
     <img class="card-img-top rounded-0" :src="item.imageUrl" alt="Card image cap">
    <i class="far fa-heart fa-2x heart"
    @click="addFavorite(item.title, item.id)"
    v-if="!checkFavStatus(item.id)"
    ></i>
    <i class="fas fa-heart fa-2x heart"
    @click="addFavorite(item.title, item.id)"
    v-if="checkFavStatus(item.id)"
    ></i>
     <div class="card-body">
      <h5 class="card-title like-font font-weight-bold"
      @click="goProduct(item.id)"
      >{{item.title}}</h5>
      <p class="card-text text-secondary">{{item.content}}</p>
      <div class="d-flex price-margin"></div>
      <span class="font-weight-bold">{{item.price | currency}}</span>
      <del class="ml-2 text-secondary" style="font-size:12px">{{item.origin_price | currency}}</del>
     </div>
   </div>
 </div>
 </div>
 </div>
</div>
<Footer class="mt-5"></Footer>
</div>
</template>

<script>
import HomeNavbar from './HomeNavbar'
import Footer from './Footer'

export default {
  components: {
    HomeNavbar,
    Footer
  },
  data () {
    return {
      detailId: '',
      product: {},
      imgSrc: '',
      itemNum: 1,
      filterProduct: {},
      products: {},
      categoryData: '',
      status: {
        loadingItem: ''
      },
      productId: '',
      favoriteItem: JSON.parse(localStorage.getItem('favoriteItemId')) || []
    }
  },
  methods: {
    goProduct (id) {
      this.$router.push(`/productdetail/${id}`)
      window.location.reload()
    },
    getProduct (id) {
      const vm = this
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOM_PATH}/product/${id}`
      vm.isLoading = true
      vm.$http.get(api).then((response) => {
        vm.product = response.data.product
        vm.imgSrc = response.data.product.imageUrl
        vm.isLoading = false
        vm.categoryData = response.data.product.category
        this.getProducts(this.categoryData)
      })
    },
    getProducts (items) {
      const vm = this
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOM_PATH}/products/all`
      vm.$http.get(api).then((response) => {
        vm.products = response.data.products
        // eslint-disable-next-line no-unused-vars
        vm.filterProduct = vm.products.filter((item, index, array) => item.category === items)
      })
    },
    addtoCart (id, qty = 1) {
      const vm = this
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOM_PATH}/cart`
      vm.status.loadingItem = id
      const cart = {
        product_id: id,
        qty
      }
      this.$http.post(api, { data: cart }).then(() => {
        vm.$bus.$emit('message:push', '已加入購物車', 'success')
        vm.status.loadingItem = ''
        vm.$bus.$emit('updateCart')
      })
    },
    addFavorite (item, id) {
      const vm = this
      vm.productId = id
      if (vm.favoriteItem.indexOf(vm.productId) === -1) {
        vm.favoriteItem.push(vm.productId)
      } else {
        vm.favoriteItem.splice(vm.favoriteItem.indexOf(vm.productId), 1)
      }
      // 將更新過的favoriteItem存到localStorage內，並傳給navbar
      localStorage.setItem('favoriteItemId', JSON.stringify(vm.favoriteItem))
      vm.$bus.$emit('updateFavItem', vm.favoriteItem)
    },
    checkFavStatus (id) {
      const vm = this
      if (vm.favoriteItem.some((ele) => ele === id)) {
        return true
      }
      return false
    }
  },
  created () {
    const vm = this
    vm.detailId = vm.$route.params.id
    vm.getProduct(vm.detailId)
    vm.getProducts()
  },
  mounted () {
    const vm = this
    vm.$bus.$on('returnFavItem', (id) => {
      vm.getProducts()
      vm.checkFavStatus(id)
    })
  }
}
</script>

<style lang="scss" scoped>
.detail {
  font-family: "微軟正黑體"
}
.bg-item {
  max-width: 100%;
  width: 95%;
  height: auto;
}

.breadcrumb {
 padding-left: 0;
 padding-bottom: 0;
 margin: 0;
 background: none
}
.price-text {
    color: #48D1CC;
    font-size: 24px
}
.origin-price-text {
    font-size: 18px;
    text-decoration: line-through
}
.num-select {
    margin-top:10px;
    margin-bottom:25px;
    width:30%
}
.card {
  position: relative
}
.card-title {
    font-size: 14px;
    padding: 0;
    margin: 0;
    margin-top: 5px
}
.card-text {
    margin-top: 10px;
    margin-bottom: 0;
}
.card-body {
    padding: 0;
}
.card-img-top {
  max-width: 100%;
  max-height: 120px;
  object-fit: cover
}
.card-margin {
    padding: 0;
    padding-left:10px
}
.price-margin {
    margin-top: 5px
}
.bg-pink {
  background: #DDA0DD !important;
  border: #DDA0DD
}
.heart {
 position: absolute;
 right: 5px;
 bottom: -1000px;
 font-size:20px;
 color: white;
 overflow: hidden;
}
.card:hover {
  .heart {
    top: 95px;
    cursor: pointer
  }
  .card-img-top {
    opacity:0.7
  }
  .like-font {
    cursor: pointer
  }
}
</style>
