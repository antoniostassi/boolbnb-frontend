  
  <script>
  export default {
    name: "FilterSlider",
    props: {
      filters: {
        type: Array,
        required: true,
      },
    },
    data() {
        return {
            selectedFilters: [],
        };
    },
    methods: {
        scrollLeft() {
            const slider = this.$refs.slider;
            slider.scrollBy({ left: -300, behavior: "smooth" });
        },
        scrollRight() {
            const slider = this.$refs.slider;
            slider.scrollBy({ left: 300, behavior: "smooth" });
        },
    },
  };
  </script>

    <template>
        <div class="filter-slider-container">
        <!-- Freccia sinistra -->
        <button class="arrow left ms-2" @click="scrollLeft">&#9664;</button>
        
        <!-- Contenitore dei filtri -->
        <div class="filter-slider rounded-5" ref="slider">
            <div class="filters-wrapper">
                <label
                v-for="(filter, index) in filters"
                :key="index"
                class="filter-badge"
                :class="{ active: selectedFilters.includes(filter) }"
                >
                <input
                    type="checkbox"
                    :value="filter"
                    v-model="selectedFilters"
                    class="hidden-checkbox"
                />
                {{ filter.title }}
                </label>
            </div>
        </div>
        
        <!-- Freccia destra -->
        <button class="arrow right me-2" @click="scrollRight">&#9654;</button>
    </div>
  </template>

  
<style scoped>
/* Contenitore principale */
.filter-slider-container {
  display: flex;
  align-items: center;
  position: relative;
  padding: 10px 0;
  background-color: transparent;
  overflow: hidden;
}

/* Contenitore dei filtri (nascosta scrollbar) */
.filter-slider {
  flex: 1;
  overflow-x: scroll;
  scroll-behavior: smooth;
  white-space: nowrap;
  padding: 10px 0;
}

.filter-slider::-webkit-scrollbar {
  display: none; /* Nasconde la scrollbar in WebKit */
}

.filters-wrapper {
  display: flex;
  gap: 12px;
  align-items: center;
}

/* Badge per il filtro */
.filter-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  border-radius: 20px;
  background-color: #f3d6fb;
  color: #6a008a;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.filter-badge.active {
  background-color: #e352fa;
  color: #fff;
  box-shadow: 0 4px 8px rgba(227, 82, 250, 0.5);
  transform: scale(1.05);
}

.filter-badge:hover {
  background-color: #e352fa;
  color: #fff;
}

/* Nascondere le checkbox */
.hidden-checkbox {
  display: none;
}

/* Stile delle frecce */
.arrow {
  background-color: #e352fa;
  border: none;
  color: #fff;
  font-size: 18px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.arrow:hover {
  background-color: #c129d7;
  transform: scale(1.1);
}

.arrow:active {
  transform: scale(0.95);
}

.arrow.left {
  margin-right: 10px;
}

.arrow.right {
  margin-left: 10px;
}
</style>