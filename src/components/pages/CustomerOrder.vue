<template>
<div>
<loading :active.sync="isLoading"></loading>
<div class="row mt-4">
<div class="col-md-4 mb-4"
v-for= "item in products" :key="item.id">
  <div class="card border-0 shadow-sm">
    <div
    v-if="item.imageUrl"
    style="height: 150px; background-size: contain; background-position: center;
    background-repeat: no-repeat"
    :style="{backgroundImage: `url(${item.imageUrl})`}">
    </div>
    <div v-else class="noImage">無圖片</div>
    <div class="card-body">
      <span class="badge badge-secondary float-right ml-2">{{ item.category }}</span>
      <h5 class="card-title">
        <a href="#" class="text-dark">{{ item.title }}</a>
      </h5>
      <p class="card-text">{{ item.content }}</p>
      <div class="d-flex justify-content-between align-items-baseline">
        <div class="h5" v-if="!item.price">{{ item.origin_price }}元</div>
        <del class="h6" v-if="item.price">原價 {{ item.origin_price }} 元</del>
        <div class="h5" v-if="item.price">現在只要 {{ item.price }} 元</div>
      </div>
    </div>
    <div class="card-footer d-flex">
      <button type="button" class="btn btn-outline-secondary btn-sm"
      @click="getProduct(item.id)">
        <i class="fas fa-spinner fa-spin"
        v-if="status.loadingItem === item.id"></i>
        查看更多
      </button>
      <button type="button" class="btn btn-outline-danger btn-sm ml-auto"
      @click="addtoCart(item.id)">
        <i class="fas fa-spinner fa-spin"
        v-if="status.loadingItem === item.id"></i>
        加到購物車
      </button>
    </div>
  </div>
</div>
</div>
<!-- Modal -->
<div class="modal fade" id="productModal" tabindex="-1" role="dialog"
  aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content border-0">
      <div class="modal-header bg-dark text-white">
        <h5 class="modal-title" id="exampleModalLabel">
          {{ product.title }}
        </h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
    <div
    v-if="product.imageUrl"
    style="height: 150px; background-size: contain; background-position: center;
    background-repeat: no-repeat"
    :style="{backgroundImage: `url(${product.imageUrl})`}">
    </div>
    <div v-else class="noImage">無圖片</div>
            <blockquote class="blockquote mt-3">
              <p class="mb-0">{{ product.content }}</p>
              <footer class="blockquote-footer text-right">{{ product.description }}</footer>
            </blockquote>
            <div class="d-flex justify-content-between align-items-baseline">
              <div class="h4" v-if="!product.price">{{ product.origin_price }} 元</div>
              <del class="h6" v-if="product.price">原價 {{ product.origin_price }} 元</del>
              <div class="h4" v-if="product.price">現在只要 {{ product.price }} 元</div>
            </div>
            <select name="" class="form-control mt-3" v-model="product.num">
              <option :value="num" v-for="num in 10" :key="num">
                選購 {{num}} {{product.unit}}
              </option>
            </select>
          </div>
          <div class="modal-footer">
            <div class="text-muted text-nowrap mr-3">
              小計 <strong>{{ product.num * product.price }}</strong> 元
            </div>
            <button type="button" class="btn btn-primary"
              @click="addtoCart(product.id, product.num)">
              <i class="fas fa-spinner fa-spin" v-if="product.id === status.loadingItem"></i>
              加到購物車
            </button>
          </div>
    </div>
  </div>
</div>
 <div class="row justify-content-center">
      <div class="my-5 row justify-content-center col-sm-6">
      <p class="text-center h2" v-if="cart.carts.length == 0">購物車內無商品</p>
        <table class="table" v-if="cart.carts.length > 0">
          <thead>
            <th></th>
            <th>品名</th>
            <th>數量</th>
            <th>單價</th>
          </thead>
          <tbody>
            <tr v-for="item in cart.carts" :key="item.id">
              <td class="align-middle">
                <button type="button" class="btn btn-outline-danger btn-sm"
                @click="removeCart(item.id)">
                  <i class="far fa-trash-alt"></i>
                </button>
              </td>
              <td class="align-middle">
                {{ item.product.title }}
                <div class="text-success" v-if="item.coupon">
                  已套用優惠券
                </div>
              </td>
              <td class="align-middle">{{ item.qty }}/{{ item.product.unit }}</td>
              <td class="align-middle text-right">{{ item.final_total }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" class="text-right">總計</td>
              <td class="text-right">{{ cart.total }}</td>
            </tr>
            <tr v-if="cart.final_total !== cart.total">
              <td colspan="3" class="text-right text-success">折扣價</td>
              <td class="text-right text-success">{{ cart.final_total }}</td>
            </tr>
          </tfoot>
        </table>
        <div class="input-group mb-3 input-group-sm" v-if="cart.carts.length > 0">
        <input type="text" class="form-control" placeholder="請輸入優惠碼" v-model="coupon_code">
        <div class="input-group-append">
        <button class="btn btn-outline-secondary" type="button"
        @click="addCouponCode">
        套用優惠碼
        </button>
        </div>
        </div>
      </div>
    </div>

<!--訂單-->
<div class="my-5 row justify-content-center">
<ValidationObserver class="col-md-6" ref="form">
  <form @submit.prevent="createOrder">
    <div class="form-group">
      <label for="useremail">Email</label>
      <validation-provider rules="required|email" v-slot="{ errors }">
        <input type="email" class="form-control" name="email" id="useremail"
        v-model="form.user.email" placeholder="請輸入 Email">
        <span class="text-danger">{{errors[0]}}</span>
      </validation-provider>
    </div>
    <div class="form-group">
      <label for="username">收件人姓名</label>
      <validation-provider rules="required" v-slot="{ errors }">
      <input type="text" class="form-control" name="姓名" id="username"
        v-model="form.user.name" placeholder="輸入姓名">
      <span class="text-danger">{{errors[0]}}</span>
      </validation-provider>
    </div>
    <div class="form-group">
      <label for="usertel">收件人電話</label>
      <validation-provider rules="required" v-slot="{ errors }">
      <input type="tel" class="form-control" name="電話" id="usertel" v-model="form.user.tel" placeholder="請輸入電話">
      <span class="text-danger">{{errors[0]}}</span>
      </validation-provider>
    </div>
    <div class="form-group">
      <label for="useraddress">收件人地址</label>
      <validation-provider rules="required" v-slot="{ errors }">
      <input type="text" class="form-control" name="地址" id="useraddress" v-model="form.user.address"
      placeholder="請輸入地址">
      <span class="text-danger">{{errors[0]}}</span>
      </validation-provider>
    </div>
    <div class="form-group">
      <label for="comment">留言</label>
      <textarea name="" id="comment" class="form-control" cols="30" rows="10" v-model="form.message"></textarea>
    </div>
    <div class="text-right">
      <button class="btn btn-danger">送出訂單</button>
    </div>
  </form>
  </ValidationObserver>
</div>
</div>
</template>

<script>
import $ from 'jquery'

export default {
  data () {
    return {
      products: [],
      isLoading: false,
      product: {},
      status: {
        loadingItem: ''
      },
      cart: {
        carts: {}
      },
      coupon_code: '',
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: ''
        },
        message: ''
      },
      value: ''
    }
  },
  methods: {
    getProducts () {
      const vm = this
      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOM_PATH}/products`
      vm.isLoading = true
      this.$http.get(url).then((response) => {
        vm.products = response.data.products
        console.log(response)
        vm.isLoading = false
      })
    },
    getProduct (id) {
      const vm = this
      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOM_PATH}/product/${id}`
      vm.status.loadingItem = id
      this.$http.get(url).then((response) => {
        vm.product = response.data.product
        $('#productModal').modal('show')
        console.log(response)
        vm.status.loadingItem = ''
      })
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
        vm.getCart()
        vm.status.loadingItem = ''
        $('#productModal').modal('hide')
        console.log(response)
      })
    },
    getCart () {
      const vm = this
      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOM_PATH}/cart`
      vm.isLoading = true
      this.$http.get(url).then((response) => {
        console.log(response)
        vm.cart = response.data.data
        vm.isLoading = false
      })
    },
    removeCart (id) {
      const vm = this
      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOM_PATH}/cart/${id}`
      vm.isLoading = true
      this.$http.delete(url).then((response) => {
        console.log(response)
        vm.getCart()
        vm.isLoading = false
      })
    },
    addCouponCode () {
      const vm = this
      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOM_PATH}/coupon`
      const coupon = {
        code: vm.coupon_code
      }
      vm.isLoading = true
      this.$http.post(url, { data: coupon }).then((response) => {
        console.log(response)
        if (response.data.success) {
          vm.getCart()
          vm.isLoading = false
        } else {
          vm.getCart()
          vm.isLoading = false
          this.$bus.$emit('message:push', response.data.message, 'danger')
        }
      })
    },
    createOrder () {
      const vm = this
      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOM_PATH}/order`
      const order = vm.form
      this.$refs.form.validate().then((success) => {
        if (success) {
          this.$http.post(url, { data: order }).then((response) => {
            if (response.data.success) {
              vm.$router.push(`/customer_checkout/${response.data.orderId}`)
              console.log('訂單已建立', response)
            } else {
              console.log('建立失敗')
            }
          })
        } else {
          // 驗證失敗產生的行為
          console.log('欄位不完整')
        }
      })
    }
  },
  created () {
    this.getProducts()
    this.getCart()
  }
}
</script>

<style scoped>
.noImage{
    height: 150px;
    text-align: center;
    line-height:150px;
    background-color:#d2d2d2
}
</style>
