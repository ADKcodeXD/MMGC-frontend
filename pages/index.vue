<template>
  <div class="page-index">
    <div>
      <NuxtLink :to="'/welcome'">welcome</NuxtLink>
    </div>
    <div>
      <NuxtLink :to="'/activity/2022'">2022</NuxtLink>
    </div>
  </div>
</template>

<style>
.page-index {
  padding-top: 60px;
  text-align: center;
}
</style>
