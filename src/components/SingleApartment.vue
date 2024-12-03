<script>
export default {
  data() {
    return {
        lastPromotion: this.apartment.promotions.length - 1,
    };
  },
  props: { // Passaggio di props
    apartment: { // Serve per prendere l'id dell'apartment da mostrare dentro la card nel router-link
      type: Object,
      required: true,
    },
    index: { // Serve per il delay dell'animazione per farli uscire uno dopo l'altro
      type: Number,
      required: true,
    },
  },
  methods: {
    getTodayDate() {
      let today = new Date();
      let todaySplit = today.toLocaleDateString().split('/');
      const todayDate = todaySplit[2] + '-' + todaySplit[1] + '-' + todaySplit[0];
      return todayDate
    }
  }
};
</script>


<template>
  <router-link
    :to="{ name: 'apartments-details', params: { id: apartment.id } }"
    class="router-link-wrapper"
  >
    <div
      class="card animate-card m-auto"
      :style="{ animationDelay: `${1 * 0.1}s` }"
    >
      <div v-if="apartment.promotions && apartment.promotions.length > 0 && apartment.promotions[lastPromotion].pivot.end_date >= getTodayDate()" class="sponsored-badge">
        ⭐ Sponsorizzato
      </div>
      <img
        :src="apartment.image"
        :alt="apartment.title"
        class="card-img-top"
      />
      <div class="card-body d-flex flex-column justify-content-between">
        <h5 class="card-title">
          {{ apartment.title }}
        </h5>
        <p class="card-text fs-6">
          {{ apartment.address }}
        </p>
        <div class="row">
          <small class="col my-1 card-info d-flex align-items-center w-100">
            <img src="/icons/squareMeters.png" alt="SquareMeters" class="mx-2" style="height: 25px; width: 25px;"><strong>{{ apartment.apartment_size }}</strong>
          </small>
          <small class="col my-1 card-info d-flex align-items-center justify-content-end me-2">
            <img src="/icons/room.png" alt="Rooms" class="mx-2" style="height: 25px; width: 25px;"><strong>{{ apartment.rooms }}</strong>
          </small>
          <small class="col my-1 card-info d-flex align-items-center justify-content-end me-2">
            <i class="fa-solid fa-bed fa-xl mx-2"></i><strong>{{ apartment.beds }}</strong>
          </small>
        </div>
      </div>
    </div>
  </router-link>
</template>

<style lang="scss" scoped>
.router-link-wrapper {
  text-decoration: none;
  color: inherit;

  .card {
    height: 400px;
    margin: 15px 10px;
    width: 100%;
    max-width: 18rem;
    border: none;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    img {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }

    .card-body {
      background: #fff;
      padding: 1rem;

      .card-title {
        font-size: 1.25rem;
        font-weight: bold;
        margin-bottom: 0.5rem;
      }

      .card-text {
        font-size: 1rem;
        color: #666;
        margin-bottom: 1rem;
      }

      .card-info {
        color: #666;
        font-size: 0.8rem;
        height: 15px;
      }
    }

    &:hover {
      transform: translateY(-8px);
      box-shadow: 0 15px 25px rgba(0, 0, 0, 0.3);
    }

    &.animate-card {
      opacity: 0;
      transform: translateX(100%);
      animation: slideInLeft 1s ease forwards;
    }

    @keyframes slideInLeft {
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  }

  .sponsored-badge {
    position: absolute;
    top: 10px;
    left: 10px;
    background: #e352fa;
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 0.8rem;
    font-weight: bold;
    z-index: 10;
  }
}
</style>

