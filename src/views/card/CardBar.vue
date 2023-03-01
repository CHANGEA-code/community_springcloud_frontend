<template>
  <section>
    <!--是否登录-->
    <login-welcome />

    <!--今日赠言-->
    <tip-card />

  </section>
</template>

<script>
import TipCard from '@/views/card/Tip'
import LoginWelcome from '@/views/card/LoginWelcome'

export default {
  name: 'CardBar',
  components: { LoginWelcome, TipCard }
}
</script>

<style scoped>
</style>
