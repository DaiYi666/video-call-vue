<template>
  <section class="card van-haptics-feedback">
    <section class="avatar-box">
      <van-icon size="45" name="friends-o"/>
    </section>

    <section class="peer-id">
      <slot></slot>
    </section>
  </section>
</template>

<script setup>

</script>

<style scoped lang="scss">
.card {
  margin: 0.3125rem 0.3125rem;
  background-color: white;
  border-radius: 0.625rem;

  display: flex;
  align-items: center;

  .peer-id {
    font-size: 0.875rem;
    font-style: italic;
  }

  .avatar-box {
    padding: 0.3125rem;
  }
}
</style>