<template>
  <section>
    <router-view v-slot="{ Component }">
      <keep-alive include="MainEntrancePage">
        <component :is="Component"/>
      </keep-alive>
    </router-view>
  </section>
</template>