<template>
<div>
<div class="container">
<home-navbar class="mb-5"/>
      <ul class="step-list">
        <li class="col-md-12 col-lg-3 pt-2 mt-3 dot-none"
          :class="{'bg-success , text-white active': step === 1}">
          <span>Step:1</span>
          <p>確認訂單內容</p>
        </li>
        <li class="col-md-12 col-lg-3 pt-2 mt-3 dot-none"
        :class="{'bg-success , text-white active': step === 2}">
          <span>Step:2</span>
          <p>填寫購買資料</p>
        </li>
        <li class="col-md-12 col-lg-3 pt-2 mt-3 dot-none"
        :class="{'bg-success , text-white active': step === 3}">
          <span>Step:3</span>
          <p>付款/完成訂單</p>
        </li>
      </ul>

      <!-- step1 -->
      <div class="col-md-12 col-lg-9 order-left-box mx-auto"  v-if="step === 1">
        <div class="p-3 order-box-item">
          <span>訂單摘要</span>
        </div>
        <span v-if="orderTotal == 0">購物車內無商品</span>
        <table class="table text-center" v-if="orderTotal !== 0">
          <thead>
            <th class="phone-d-none">縮圖</th>
            <th colspan="2">品名</th>
            <th>數量</th>
            <th>價格</th>
            <th>刪除</th>
          </thead>
          <tbody>
            <tr v-for="item in cart.carts" :key="item.id">
              <td class="phone-d-none">
                <div style="height: 80px; background-size:cover;
                  background-position:center center"
                  :style="{ backgroundImage:`url(${item.product.imageUrl}`}"></div>
              </td>
              <td class="align-middle checkout-text" colspan="2">
              {{ item.product.title }}
                <div class="text-success"  v-if="item.coupon">已套用優惠券</div>
              </td>
              <td class="align-middle">
               {{ item.qty }}/{{ item.product.unit }}
              </td>
              <td class="align-middle">
              {{ item.final_total | currency }}
              </td>
              <td class="align-middle">
                <button type="button" class="btn btn-outline-danger btn-sm" @click="removCartItem(item.id)">
                  <i class="far fa-trash-alt"></i>
                </button>
              </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td class="phone-d-none border-0"></td>
                <td colspan="5" class="align-middle text-right border-0">共{{ orderTotal }}筆</td>
              </tr>
              <tr>
                <td class="phone-d-none border-0"></td>
                <td colspan="4" class="align-middle text-right border-0">商品總共</td>
                <td class="align-middle text-right border-0">{{ cart.total | currency }}</td>
              </tr>
              <tr v-if="cart.final_total !== cart.total">
                <td class="phone-d-none"></td>
                <td colspan="4" class="text-right text-success">折扣價</td>
                <td class="text-success text-right">{{ cart.final_total | currency }}</td>
              </tr>
            </tfoot>
          </table>
           <div class="input-group input-group-md my-2 ml-auto input-item"
           v-if="
           orderTotal !== 0">
              <input type="text" class="form-control ml-auto"
                placeholder="請輸入優惠碼" v-model="coupon_code" />
              <div class="input-group-append">
              <button class="btn btn-success" type="button" @click="addCouponCode ()">套用優惠碼</button>
              </div>
          </div>
          <hr>
           <div class="row justify-content-between" v-if="step === 1">
             <div class="col-md-3">
               <router-link to="/productlist" class="btn btn-danger btn-block step-btn">
                 <i class="fas fa-arrow-left"></i>繼續選購</router-link>
             </div>
             <div class="col-md-3" v-if="orderTotal !== 0">
                 <button  class="btn btn-primary btn-block step-btn" @click="step = 2">下一步
                 <i class="fas fa-arrow-right"></i></button>
             </div>
          </div>
      </div>
      <!-- step2 -->
      <!--訂單-->
<div class="my-2 row justify-content-center" v-if="step === 2">
<ValidationObserver class="col-md-7" ref="form">
  <form>
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
    <div class="row justify-content-between" v-if="step === 2">
      <div class="col-md-3">
        <button  class="btn btn-outline-secondary btn-block step-btn" @click="step = 1">
        <i class="fas fa-arrow-left"></i>上一步</button>
      </div>
      <div class="col-md-3">
        <button  type="button" class="btn btn-primary btn-block step-btn"  @click.prevent="createOrder">下一步
        <i class="fas fa-arrow-right"></i></button>
        </div>
      </div>
  </form>
  </ValidationObserver>
</div>
      <!-- step3 -->
        <div v-if="step === 3">
        <div class="my-5 row ">
        <form class="col-lg-9 col-md-12 mx-auto">
          <table class="table">
            <thead>
              <th style="border-top:0">商品名稱</th>
              <th style="border-top:0">商品數量</th>
              <th style="border-top:0">單價</th>
            </thead>
            <tbody>
              <tr v-for="item in order.products" :key="item.id">
                <td class="align-middle">{{ item.product.title }}</td>
                <td class="align-middle">{{ item.qty }}/{{ item.product.unit }}</td>
                <td class="align-middle text-right">{{ item.final_total | currency }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" class="text-right">總計</td>
                <td class="text-right text-danger">{{ order.total | currency }}</td>
              </tr>
            </tfoot>
          </table>
        <table class="table">
          <tbody>
            <tr>
              <th scope="row">信箱</th>
              <td class="w-75">{{ order.user.email }}</td>
            </tr>
            <tr>
              <th scope="row">姓名</th>
              <td>{{ order.user.name }}</td>
            </tr>
            <tr>
              <th scope="row">電話</th>
              <td>{{ order.user.tel }}</td>
            </tr>
            <tr>
              <th scope="row">住址</th>
              <td>{{ order.user.address }}</td>
            </tr>
            <tr>
              <th scope="row" class="checkout-status">付款狀態</th>
              <td>
                <span v-if="!order.is_paid">尚未付款</span>
                <span v-else class="text-success">付款完成</span>
              </td>
            </tr>
          </tbody>
        </table>
           <div class="text-right" v-if="order.is_paid === false">
            <button  type="button" class="btn btn-danger step-btn" @click.prevent="payOrder">確認付款去</button>
          </div>
        </form>
      </div>
  </div>
  </div>
</div>
</template>

<script>
import HomeNavbar from './HomeNavbar'

export default {
  components: {
    HomeNavbar
  },
  data () {
    return {
      step: 1,
      cart: {},
      orderTotal: '',
      isLoading: false,
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
      order: {
        user: {}
      },
      orderId: ''
    }
  },
  methods: {
    getCart () {
      const vm = this
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOM_PATH}/cart`
      vm.isLoading = true
      vm.$http.get(api).then((response) => {
        vm.cart = response.data.data
        vm.orderTotal = response.data.data.carts.length
        vm.isLoading = false
      })
    },
    removCartItem (id) {
      const vm = this
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOM_PATH}/cart/${id}`
      vm.isLoading = true
      vm.$http.delete(api).then(() => {
        vm.$bus.$emit('updateCart')
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
              console.log('建立訂單成功')
              vm.orderId = response.data.orderId
              vm.getOrder()
              vm.step = 3
            } else {
              console.log('建立失敗')
            }
          })
        } else {
          // 驗證失敗產生的行為
          console.log('欄位不完整')
        }
      })
    },
    payOrder () {
      const vm = this
      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOM_PATH}/pay/${vm.orderId}`
      vm.isLoading = true
      this.$http.post(url).then((response) => {
        if (response.data.success) {
          vm.$bus.$emit('message:push', response.data.message, 'success')
          console.log('付款完成', response)
          vm.getOrder()
          vm.$bus.$emit('updateCart')
          vm.isLoading = false
        }
      })
    },
    getOrder () {
      const vm = this
      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOM_PATH}/order/${vm.orderId}`
      vm.isLoading = true
      this.$http.get(url).then((response) => {
        console.log('取得訂單資料', response)
        vm.order = response.data.order
        vm.isLoading = false
      })
    }
  },
  created () {
    this.getCart()
  },
  mounted () {
    const vm = this
    vm.$bus.$on('updateOrderCart', () => {
      vm.getCart()
    })
  }
}
</script>
<style lang="scss">
.step-list {
  display: flex;
  justify-content: center;
  padding: 0;
  text-align: center;
}
.step-list.active {
  display: flex;
  flex-direction: column;
}

.dot-none {
  list-style-type: none;
}

.order-left-box {
  border: 1px solid rgb(228, 228, 228);
  border-radius: 10px 10px 0 0;
}
.step-btn {
 margin-bottom: 15px
}
</style>
