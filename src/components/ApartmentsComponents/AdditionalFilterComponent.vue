<script>
  import {api, store, tomtom} from '../../store';
  export default {
    
    data() {
        return {
            api, 
            store,
            tomtom,
            active: false
        };
    },
}
</script>


<template>
    <div class="row px-3">
        <a class="btn text-white fw-bold custom-bg-color" @click="active = !active" data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">
        Altri filtri <i  :class="active ? 'active' : ''" class="fa-solid fa-chevron-down"></i>
        </a>
        <div class="collapse" id="collapseExample">
            <div class="row my-2 d-flex align-items-center justify-content-center">
                <div class="col-12 col-md-6">
                    <label for="customRange2" class="form-label fw-bold px-3">Inserisci il range di km</label>
                    <input type="range" v-model="tomtom.rangeFilter" class="form-range px-3" min="1" max="50" id="customRange2">
                    <span class="px-3">
                       Distanza selezionata: <span class="fw-bold"> {{ tomtom.rangeFilter }} KM</span>
                    </span>
                </div>
                <div class="col-12 col-md-6 d-flex flex-wrap p-3">
                    <div class="col-12 col-md-6 px-3 mb-3">
                        <label for="rooms" class="form-label">Stanze:</label>
                        <input type="number" class="form-control" id="rooms" value="1">
                    </div>
                    <div class="col-12 col-md-6 px-3">
                        <label for="beds" class="form-label">Letti:</label>
                        <input type="number" class="form-control" id="beds" value="1">
                    </div>
                </div>
                <div class="col-12 col-sm-4 text-center p-3">
                    <div class="px-3">
                        <button class="w-100 btn custom-bg-color text-white fw-bold ">Filtra</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<style scoped lang="scss">
    .custom-bg-color{
        background-color:#E352FA;
    }
    i{
        transition: transform .2s linear;
    }
    .active{
        transform: rotate(180deg);
    }
</style>