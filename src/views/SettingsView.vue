<template>
  <section>
    <van-nav-bar title="设置"
                 fixed
                 placeholder
                 safe-area-inset-top/>
  </section>

  <section>
    <van-cell-group title="和作者一起研究" inset>
      <van-cell title="请叫我" value="代毅"/>
      <van-cell title="微信" value="18380924397" clickable/>
      <van-cell title="QQ" value="484201132" clickable/>
      <van-cell title="邮箱" value="daiyi.lucky@gmail.com" clickable/>
    </van-cell-group>
  </section>

  <van-divider/>

  <section>
    <van-cell-group inset>
      <van-cell title="去GitHub star一下" value="GO" clickable url=""/>
      <van-cell title="去Gitee star一下" value="GO" clickable url=""/>
    </van-cell-group>
  </section>

</template>

<script setup>

</script>

<style scoped lang="scss">

</style>