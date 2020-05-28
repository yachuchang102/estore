<template>
  <div>
    <div class="footer-box mt-3">
      <div class="row text-center">
        <ul class="col-md-4 pt-4">
        </ul>
        <ul class="col-md-4 pt-4">
            <li class="dot-none">客服電話 | 0800 800 720</li>
            <li class="dot-none">客服信箱 | mail@grasshill.net</li>
            <li class="dot-none">客服時間 | 週一~週五 09:00-17:00</li>
        </ul>
        <ul class="col-md-4 pt-4 footer-icon">
        </ul>
      </div>
    <div class="copy text-center pt-4 pb-5">
      ⓒ Copyright 2020<span> YC </span>All Rights Reserved.
    </div>
    <div v-scroll-to="'#top'" id="gotop" style="display:none">
      <i class="fas fa-chevron-circle-up scroll-icon"></i>
    </div>
    </div>
  </div>
</template>

<script scoped>
import $ from 'jquery'

export default {
  data () {
    return {
      CartTotal: ''
    }
  },
  methods: {
    goCheckout () {
      this.$router.push('/checkout')
    }
  },
  mounted () {
    const vm = this
    vm.$bus.$on('updateCountTotal', (newCountTotal) => {
      vm.CartTotal = newCountTotal
    })
    // 偵測按鈕
    function showBtnCondition () {
      if ($(this).scrollTop() > 1200) {
        $('#gotop').fadeIn()
      } else {
        $('#gotop').fadeOut()
      }
    }
    $(window).scroll(showBtnCondition)
  }
}

</script>

<style scoped lang="scss">
.footer-box{
  line-height: 1.5;
}
.dot-none {
  list-style-type: none;
}
.left-link{
  opacity: .9;
  color: red;
  &:hover{
  opacity: 1;
  }
}
.copy{
  span{
    color: grey;
  }
}
.fa-color{
  color: grey
}
.top{
  position: fixed;
  bottom: 0;
  right: 0;
}
.scroll-icon{
  position: fixed;
  color: black !important;
  font-size: 65px;
  bottom: 20px;
  right: 18px;
  opacity: 0.5;
  z-index: 999;
  &:hover{
    opacity: 1;
    cursor: pointer;
  }
}
.cart-item:hover {
  opacity: 1;
  cursor: pointer;
}
.cart-icon-img {
  position: fixed;
  width: 60px;
  right: 32px;
  bottom: 125px;
  z-index: 99;
  opacity: .7;
  &:hover{
    cursor: pointer;
    opacity: 1;
  }
}
</style>
