<script>
import axios from "axios";
import {store, api} from '../store'

export default {
  data() {
    return {
      paginationClick: false,
      store,
      api
    };
  },
};
</script>
<template>
        <!-- Paginazione -->
        <div class="d-flex justify-content-center my-5">

          <div class="pagination">
            <!-- 0) button prima pagina -->
            <button class="page-item" :disabled="api.pagination.currentPage == 1 || api.paginationClick" @click="api.getApartments(api.pagination.currentPage = 1)">
              <a href="#main-container" class="page-link" :class="api.pagination.currentPage == 1 ? 'disabled':''">
                <i class="fa-solid fa-angles-left"></i>
              </a> 
            </button>
            <!-- 0) -->
            <!-- 0.1) si vedono solo sull'ultima pagina -->
            <button class="page-item" v-show="api.pagination.currentPage == api.pagination.lastPage" :disabled="api.paginationClick"  @click="api.getApartments(api.pagination.currentPage = api.pagination.prevPage - 3)">
              <a href="#main-container" class="page-link">{{ api.pagination.currentPage - 4 }}</a>
            </button>
            <button  class="page-item" v-show="api.pagination.currentPage == api.pagination.lastPage" :disabled="api.paginationClick" @click="api.getApartments(api.pagination.currentPage = api.pagination.prevPage - 2)">
              <a href="#main-container" class="page-link">{{ api.pagination.currentPage - 3 }}</a>
            </button>
            <!-- 0.1) -->
          
            <button class="page-item" v-show="api.pagination.prevPage > 0 && api.pagination.prevPage - 1 != 0" :disabled="api.paginationClick" @click="api.getApartments(api.pagination.currentPage = api.pagination.prevPage - 1)">
              <a href="#main-container" class="page-link">{{ api.pagination.prevPage - 1 }}</a>
            </button>

            <!-- 2) se è 0 non viene mostrato in pagina -->
            <button class="page-item" :disabled="api.paginationClick" v-show="api.pagination.prevPage > 0" @click="api.getApartments(api.pagination.currentPage = api.pagination.prevPage)">
              <a href="#main-container" class="page-link">{{ api.pagination.prevPage }}</a>
            </button>
            <!-- 2) -->
            <!-- 3) current page -->
            <button disabled class="page-item">
              <a href="#main-container" class="page-link bg-primary text-white" >{{ api.pagination.currentPage }}</a>
            </button>
            <!-- 3) -->
            <!-- 4) non viene mostrato se siamo sull'ultima pagina -->
            <button class="page-item" v-show="api.pagination.currentPage != api.pagination.lastPage" :disabled="api.pagination.currentPage == api.pagination.lastPage || paginationClick"  @click="api.getApartments(api.pagination.currentPage = api.pagination.nextPage)">
              <a href="#main-container" class="page-link" :class="api.pagination.currentPage == api.pagination.lastPage ? 'disabled':''">{{ api.pagination.nextPage }}</a>
            </button>
            <button  class="page-item" v-show="api.pagination.currentPage != api.pagination.lastPage && api.pagination.currentPage != api.pagination.lastPage - 1" :disabled="api.pagination.currentPage == api.pagination.lastPage || paginationClick" @click="api.getApartments(api.pagination.currentPage = api.pagination.nextPage + 1)">
              <a href="#main-container" class="page-link" :class="api.pagination.currentPage == api.pagination.lastPage ? 'disabled':''">{{ api.pagination.currentPage + 2 }}</a>
            </button>
            <!-- 4) -->
            <!-- 5) si vedono solo sulla prima pagina -->
            <button class="page-item" v-show="api.pagination.currentPage == 1" :disabled="api.pagination.currentPage == api.pagination.lastPage || paginationClick"  @click="api.getApartments(api.pagination.currentPage = api.pagination.nextPage + 2)">
              <a href="#main-container" class="page-link" :class="api.pagination.currentPage == api.pagination.lastPage ? 'disabled':''">{{ api.pagination.currentPage + 3 }}</a>
            </button>
            <button  class="page-item" v-show="api.pagination.currentPage == 1" :disabled="api.pagination.currentPage == api.pagination.lastPage || paginationClick" @click="api.getApartments(api.pagination.currentPage = api.pagination.nextPage + 3)">
              <a href="#main-container" class="page-link" :class="api.pagination.currentPage == api.pagination.lastPage ? 'disabled':''">{{ api.pagination.currentPage + 4 }}</a>
            </button>
            <!-- 5) -->


            <!-- button ultima pagina -->
            <button class="page-item" :disabled="api.pagination.currentPage == api.pagination.lastPage || paginationClick" @click="api.getApartments(api.pagination.currentPage = api.pagination.lastPage); console.log(paginationClick)">
              <a href="#main-container" class="page-link" :class="api.pagination.currentPage == api.pagination.lastPage ? 'disabled':''">
                <i class="fa-solid fa-angles-right"></i>
              </a>
            </button>
            <!--  -->
          </div>

    </div>
</template>

<style lang="scss" scoped>
button {
  padding:0;
}
.page-item {
  border:none;
}
</style>