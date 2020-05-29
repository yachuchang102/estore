<template>
<div class="home">
<loading :active.sync="isLoading"></loading>
<home-navbar/>
<Carousel></Carousel>
<section>
<div class="container">
<h1 class="text-left text-italic">BEST SALE</h1>
<h4 class="text-center sub-title">精選商品</h4>
<!--精選商品-->
<div class="row justify-content-center">
<div class="col-md-10">
<div class="row">
  <div class="col-lg-4 col-md-6 mt-5" v-for="item in selectProduct" :key="item.id">
    <div class="card">
      <span class="badge badge-danger index-hot-badge">TOP</span>
      <img class="card-img-top" :src="item.imageUrl" alt="Card image cap">
       <div class="card-body">
        <p class="card-text text-center">{{ item.title }}</p>
        <h5 class="card-text text-center">{{item.price | currency}}</h5>
       </div>

    <div class="card card-content bg-primary-opacity text-white card-slideInUp"><!--父-->
    <div class="card-body align-self-center"><!--子-->
    <button type="button" class="d-block btn btn-outline-light bt1"
     @click="addtoCart(item.id)">加入購物車</button>
    <button type="button" class="d-block btn btn-outline-light mt-2 bt2"
    @click="goProduct(item.id)"
    >產品詳情</button>
    <i  @click="addFavorite(item.id)"
    v-if="!checkFavStatus(item)"
    class="far fa-heart fa-2x heart-icon"></i>
    <i  @click="addFavorite(item.id)"
    v-if="checkFavStatus(item)"
    class="fas fa-heart fa-2x heart-icon"></i>
    </div>
    </div>
    </div>
  </div>
  </div>
</div>
</div>
</div>
</section>
<!--公司介紹-->
<section>
<div class="container">
<h1 class="text-left text-italic my-5">ONE DAY SLIVERSMITH</h1>
<div class="row justify-content-center">
<div class="col-md-10">
<div class="row">
</div>
</div>
</div>
<Subscription></Subscription>
<div class="p-5 intro-word">從穿起工作服開始，於工坊體驗鎚紋、敲字、焊接、拋光等職人技術。
金工是一門傳統工藝，也是一份細細雕琢的體貼心意，在敲敲聲及歡愉氣氛的3小時課程中，親手打造銀光閃耀的專屬回憶！</div>
</div>
</section>
<Footer></Footer>
</div>
</template>

<script>
import HomeNavbar from './HomeNavbar'
import Footer from './Footer'
import Subscription from './Subscription'
import Carousel from './Carousel'
import selectProduct from '../../selectedItem.json'
import $ from 'jquery'

export default {
  components: {
    HomeNavbar,
    Carousel,
    Subscription,
    Footer
  },
  data () {
    return {
      selectProduct,
      favoriteItem: JSON.parse(localStorage.getItem('favoriteItemId')) || [],
      isLoading: false,
      status: {
        loadingItem: ''
      }
    }
  },
  methods: {
    goProduct (id) {
      this.$router.push(`/productdetail/${id}`)
    },
    addFavorite (id) {
      const vm = this
      if (vm.favoriteItem.indexOf(id) === -1) {
        vm.favoriteItem.push(id)
      } else {
        vm.favoriteItem.splice(vm.favoriteItem.indexOf(id), 1)
      }
      // 將更新過的favoriteItem存到localStorage內，並傳給navbar
      localStorage.setItem('favoriteItemId', JSON.stringify(vm.favoriteItem))
      vm.$bus.$emit('updateFavItem', vm.favoriteItem)
    },
    checkFavStatus (item) {
      const vm = this
      if (vm.favoriteItem.some((ele) => ele === item.id)) {
        return true
      }
      return false
    },
    checkCartStatus (item) {
      const vm = this
      if (vm.favoriteItem.some((ele) => ele === item.id)) {
        return true
      }
      return false
    },
    addtoCart (id, qty = 1) {
      const vm = this
      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOM_PATH}/cart`
      const cart = {
        product_id: id,
        qty
      }
      vm.status.loadingItem = id
      this.$http.post(url, { data: cart }).then((response) => {
        vm.status.loadingItem = ''
        console.log(response)
        vm.$bus.$emit('updateCart')
      })
    }
  },
  mounted () {
    $('.carousel').carousel({
      interval: 2000,
      ride: 'carousel',
      pause: false
    })
  }
}
</script>

<style scoped>
.home {
    position: relative;
    font-family: "微軟正黑體"
}
.text-italic{
  font-style:italic;
}
.sub-title{
  position: relative
}
.sub-title::after{
    content: '';
    position: absolute;
    left: 50%;
    bottom:-70%;
    width: 25px;
    margin-left: -12.5px;
    border-bottom-width: 3px;
    border-bottom-style: solid;
}
.index-hot-badge{
  position: absolute;
  top:10px;
  right:10px;
}
.card {
      overflow: hidden;
      position:relative
  }
.card-slideInUp{
    transform: translateY(105%);
  }
.card:hover .card-slideInUp{
    transform: translateY(0);
    transition-duration: 0.5s
  }
.bg-primary-opacity{
  background-color: #10161e81;
}
.card-content{
    position: absolute;
    top:0;
    bottom: 0;
    left: 0;
    right:0;
    transition:.5s;
  }
.heart-icon{
  position: absolute;
  bottom:20px;
  right:20px;
}
.bt1{
  position: absolute;
  left:30%;
  top: 38%;
  width:120px;
}
.bt2{
  position: absolute;
  left:30%;
  top: 50%;
  width:120px

}
</style>
