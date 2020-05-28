<template>
<div>
<nav aria-label="Page navigation example">
  <ul class="pagination">
    <li class="page-item" :class="{'disabled': !allPages.has_pre }">
      <a class="page-link" href="#" aria-label="Previous"
      @click.prevent="changePage(allPages.current_page-1)">
        <span aria-hidden="true">&laquo;</span>
      </a>
    </li>
    <li class="page-item" v-for="page in allPages.total_pages" :key="page"
    :class="{'active': allPages.current_page === page}">
    <a class="page-link" href="#"  @click.prevent="changePage(page)">{{page}}</a></li>
    <li class="page-item" :class="{'disabled': !allPages.has_next }">
      <a class="page-link" href="#" aria-label="Next"
      @click.prevent="changePage(allPages.current_page+1)">
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>
  </ul>
</nav>
</div>
</template>

<script>
export default {
  props: ['allPages'],
  methods: {
    changePage: function (page) {
      this.$emit('update', page)
    }
  }
}
</script>
