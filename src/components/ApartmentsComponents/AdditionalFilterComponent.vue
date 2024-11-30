<script>
  import {api, store, tomtom} from '../../store';
  export default {
    
    data() {
        return {
            api, 
            store,
            tomtom,
            selectedKM: 20,
            active: false,
            rooms: 1,
            beds: 1
        };
    },
    methods: {
        setAdditionalFilters(){
            this.store.additionalFilters.beds = this.beds;
            this.store.additionalFilters.rooms = this.rooms;
            this.tomtom.rangeFilter = this.selectedKM
            this.store.hiddenPaginate = true
            this.api.getAllApartments();
        }
    }
}
</script>


<template>

    <div class="row mb-2 d-flex align-items-center justify-content-center py-2">
        <div class="col-12 col-md-6">
            <label for="customRange2" class="form-label fw-bold px-3">Inserisci il range di km</label>
            <div class="form-text px-3 text-danger" :class ="tomtom.position.lat ? 'd-none': ''">
                Questo filtro funziona solo se hai selezionato una città
            </div>
            <input type="range" :disabled="!tomtom.position.lat" v-model="selectedKM" class="form-range px-3" min="1" max="50" id="customRange2">
            <span class="px-3">
                Distanza selezionata: <span class="fw-bold"> {{ selectedKM }} KM</span>
            </span>
        </div>
        <div class="col-12 col-md-6 d-flex flex-wrap p-3">
            <div class="col-12 col-md-6 px-3 mb-3">
                <label for="rooms" class="form-label fw-bold">Stanze:</label>
                <input v-model="rooms" type="number" class="form-control" id="rooms" value="1">
            </div>
            <div class="col-12 col-md-6 px-3">
                <label for="beds" class="form-label fw-bold">Letti:</label>
                <input v-model="beds" type="number" class="form-control" id="beds" value="1">
            </div>
        </div>

        <div class="col-12 col-md-10 text-center mb-2">
            <div class="px-3">
                <button @click="setAdditionalFilters(); tomtom.startResearch()" class="w-100 btn custom-bg-color text-white fw-bold ">Filtra</button>
            </div>
        </div>
        <div class="col-12 col-md-2 text-center mb-2">
            <div class="px-3">
                <button @click="tomtom.resetResearch()" class="w-100 btn bg-danger text-white fw-bold ">Reset filtri</button>
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