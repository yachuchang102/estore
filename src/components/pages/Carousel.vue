<template>
<div>
    <div id="productsCarouse" class="carousel slide mb-5">
      <ol class="carousel-indicators">
        <li data-target="#productsCarouse" data-slide-to="0" class="active"></li>
        <li data-target="#productsCarouse" data-slide-to="1"></li>
        <li data-target="#productsCarouse" data-slide-to="2"></li>
      </ol>
      <div class="carousel-inner">
        <div class="carousel-item carousel-bg-1 carousel-item-height bg-cover active ">
          <div class="carousel-caption d-none d-md-block">
            <h5></h5>
            <p>A memory to remember</p>
          </div>
        </div>
        <div class="carousel-item carousel-bg-2 carousel-item-height bg-cover">
            <div class="carousel-caption d-none d-md-block">
            <h5></h5>
            <p>A memory to remember</p>
          </div>
        </div>
        <div class="carousel-item carousel-bg-3 carousel-item-height bg-cover">
            <div class="carousel-caption d-none d-md-block">
            <h5></h5>
            <p>A memory to remember</p>
          </div>
        </div>
      </div>
      <a class="carousel-control-prev" href="#productsCarouse" role="button" data-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="sr-only">Previous</span>
      </a>
      <a class="carousel-control-next" href="#productsCarouse" role="button" data-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="sr-only">Next</span>
      </a>
    </div>
</div>
</template>

<style>
.carousel-bg-1{
  background-image: url(~@/assets/image/photo1.jpg);
}
.carousel-bg-2{
  background-image: url(~@/assets/image/photo2.jpg);
}
.carousel-bg-3{
  background-image: url(~@/assets/image/photo3.jpg);
}
.carousel-item-height{
  background-position:50% 50%;
  height: 450px;
  transition: .5s;
    @media (max-width: 991px){
      height: 300px;
    }
    @media (max-width: 767px){
      height: 250px;
    }
    @media (max-width:575px){
      height: 200px;
    }
  }
  .bg-cover{
    background-size: cover;
    background-position: center center
  }
</style>
