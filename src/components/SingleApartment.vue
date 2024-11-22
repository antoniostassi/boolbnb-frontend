<script>

export default {
  props: {
    apartment: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },
};

</script>

<template>
    <div
        class="card animate-card"
        :style="{ animationDelay: `${index * 0.2}s` }"
        >
        <img
            :src="apartment.image"
            :alt="apartment.title"
            class="card-img-top"
            />
        <div class="card-body">
            <h5 class="card-title">
                {{ apartment.title }}
            </h5>
            <p class="card-text">
                {{ apartment.address }}
            </p>
            <router-link
                :to="`/apartments/${apartment.id}`"
                class="btn btn-primary"
                >
                Scopri di più
            </router-link>
        </div>
    </div>
</template>
  

  <style lang="scss" scoped>
    .card {
        width: 18rem;
        border: none;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        transition: transform 0.3s ease, box-shadow 0.3s ease;

        img {
            width: 100%;
            height: 200px;
            object-fit: cover;
            transition: transform 0.3s ease;
        }

        .card-body {
            background: #fff;
            padding: 1rem;

            .card-title {
                font-size: 1.25rem;
                font-weight: bold;
            }

            .card-text {
                font-size: 1rem;
                color: #666;
                margin-bottom: 1rem;
            }

            .btn {
                background-color: #e352fa;
                border: none;
                color: #fff;
                font-weight: bold;

            &:hover {
                background-color: #ff69b4;
            }
            }
        }

        &:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);

            img {
                transform: scale(1.05);
            }
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
</style>