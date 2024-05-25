<template>
  <div class="ad-container">
    <h1>{{ ad.title }}</h1>
    <img :src="ad.image" :alt="ad.title" />
    <p>{{ ad.description }}</p>
    <a :href="ad.link" target="_blank">了解更多</a>
  </div>
</template>

<script>
export default {
  name: 'Advertisement',
  data() {
    return {
      ad: {
        title: 'Amazing Product',
        image: 'path-to-your-image.jpg',
        description: 'This is an incredible product that you should know about!',
        link: '../../static/ad.png'
      }
    };
  }
}
</script>

<style scoped>
.ad-container {
  text-align: center;
  border: 1px solid #ddd;
  padding: 20px;
  margin: 10px;
}

.ad-container h1 {
  font-size: 1.5em;
}

.ad-container img {
  max-width: 100%;
  height: auto;
}

.ad-container p {
  color: #666;
}

.ad-container a {
  display: inline-block;
  margin: 10px 0;
  padding: 10px 20px;
  background-color: #0056b3;
  color: white;
  text-decoration: none;
  border-radius: 5px;
}

.ad-container a:hover {
  background-color: #003d82;
}
</style>
