<template>
<div class="product">
<loading :active.sync="isLoading"></loading>
<home-navbar/>
<div class="container">
<!-- 左邊清單  -->
 <div class="row list">
   <div class="col-md-3 col-lg-2 col-sm-12 left-list">
    <ul class="list-group mt-3 sticky-top">
      <li class="list-group-item list-group-item-action views"
      v-for="(item, index) in local.list" :key="index"
      :class="{'active': select == item}" @click.prevent="getLocal(item)">{{ item }}</li>
    </ul>
   </div>
    <!-- Product -->
        <div class="col-md-9 col-lg-10 col-sm-12">
          <div class="row">
            <div class="mt-3 product-box col-md-6 col-lg-4 col-sm-12"
              v-for="item in products" :key="item.id">
              <div class="card card-item">
                <div class="product-img" :style="{ backgroundImage:`url(${item.imageUrl}`}">
                </div>
                  <i class="far fa-heart fa-item"
                  v-if="!checkFavStatus(item)"
                  @click="addFavorite(item, item.id)"
                  style="font-size:25px"></i>
                  <i class="fas fa-heart fa-item"
                  v-if="checkFavStatus(item)"
                  @click="addFavorite(item, item.id)"
                  style="font-size:25px"></i>
                <!-- 產品中間 -->
                <div class="card-body card-middle-item pb-1 bg-light">
                  <span class="badge badge-green float-right ml-2 text-white"
                    style="font-size:12px">{{ item.category }}
                  </span>
                  <h5 class="card-title">
                    <div>
                    <a @click="goProduct(item.id)">{{ item.title}}
                    </a>
                    </div>
                  </h5>
                  <p class="card-text">{{ item.content }}</p>
                  <div class="d-flex justify-content-between align-items-baseline product-Card">
                    <div class="product-text" v-if="item.price">{{ item.price | currency }} 元</div>
                    <div v-if="!item.price">{{ item.origin_price }} 元</div>
                    <del v-if="item.price">${{ item.origin_price }}</del>
                  </div>
                </div>
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
import $ from 'jquery'

console.log($)

export default {
  components: {
    HomeNavbar,
    Footer
  },
  data () {
    return {
      isLoading: false,
      select: '全部商品',
      products: [],
      productId: '',
      favItem: '',
      favoriteItem: JSON.parse(localStorage.getItem('favoriteItemId')) || [],
      local: {
        list: [
          '全部商品',
          '攝影',
          '配件飾品',
          '文具卡片',
          '包包提袋'
        ],
        select: '全部商品'
      }
    }
  },
  methods: {
    goProduct (id) {
      this.$router.push(`/productdetail/${id}`)
    },
    getProducts () {
      const vm = this
      vm.isLoading = true
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOM_PATH}/products/all`
      vm.$http.get(api).then((response) => {
        // 加入 NumItem (判斷選擇數量用)
        vm.isLoading = false
        const NumItem = response.data.products
        NumItem.forEach((num) => {
          vm.$set(num, 'numItem', 1)
        })
        // 插入 favItem (判斷最愛功能用)
        const tempItem = response.data.products
        tempItem.forEach((el) => {
          vm.$set(el, 'favItem', false)
          vm.favItem = el.favItem
        })
        if (vm.local.select !== '全部商品') {
          // eslint-disable-next-line max-len
          const localData = response.data.products.filter((item) => item.category === vm.local.select)
          vm.products = localData
        } else {
          vm.products = response.data.products
        }
      })
    },
    addFavorite (item, id) {
      const vm = this
      vm.productId = id
      if (vm.favoriteItem.indexOf(vm.productId) === -1) {
        item.favItem = true
        vm.favoriteItem.push(vm.productId)
      } else {
        vm.favoriteItem.splice(vm.favoriteItem.indexOf(vm.productId), 1)
        item.favItem = false
      }
      // 將更新過的favoriteItem存到localStorage內，並傳給navbar
      localStorage.setItem('favoriteItemId', JSON.stringify(vm.favoriteItem))
      vm.$bus.$emit('updateFavItem', vm.favoriteItem)
    },
    getLocal (loaclId) {
      const vm = this
      vm.local.select = loaclId
      vm.select = loaclId
      vm.getProducts()
    },
    checkFavStatus (item) {
      const vm = this
      if (vm.favoriteItem.some((ele) => ele === item.id)) {
        return true
      }
      return false
    }
  },
  created () {
    this.getProducts()
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
.product {
    font-family: "微軟正黑體"
}
.list {
    margin-top: 50px;
}
.product-select {
  height: 25px;
  width: 50px;
}
.list li:hover {
  background-color: #dcdcdc;
  color: black;
}
.list-group-item.active {
  background-color: #dcdcdc !important;
  border-color: #dcdcdc !important;
  color: black
}
.left-list {
  cursor: pointer
}
.product-box {
  padding: 0;
  transition: 0.3s;
}
.bg-grey {
  background-color: #dcdcdc;
  border-color: #dcdcdc
}
.product-box:hover {
  transform: translateY(-10px);
}
.product-img {
  position: relative;
  height: 180px;
  background-size:cover;
  background-position:center center
}
.fa-item{
  position: absolute;
  font-size: 28px !important;
  top: 140px;
  right: 10px;
  color: white;
}
.card-item {
  position: relative;
  max-width: 95%;
}
@media (max-width: 767px) {
.card-item {
  margin: auto;
}
}
.product-text {
  font-size: 16px;
  color: #48D1CC;
  font-weight: bolder;
  margin-bottom: 5px
}
.more-border {
 border-right: 1px solid gray;
}
.product-Card {
  color: #D3D3D3
}
.badge-green {
  background-color:#DDA0DD
}
.card-title {
  cursor: pointer

}
</style>
