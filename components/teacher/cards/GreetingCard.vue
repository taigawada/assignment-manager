<script setup lang="ts">
import { SimpleButton, SimpleCard } from "@materials";
import { useNow, useDateFormat } from "@vueuse/core";

const nowDate = useNow();
</script>
<template>
  <SimpleCard class="notification-card">
    <div class="submittion-sammary-container">
      <div class="accent-circle"></div>
      <div class="greeting">
        ようこそ {{ $nuxt.$user.value?.displayName }}さん
      </div>
      <div class="now-date-clock">
        {{ useDateFormat(nowDate, "MM月DD日 HH:mm:ss").value }}
      </div>
      <!-- <div class="shortcut-button">
        <SimpleButton normal> 今日まで提出物を確認 </SimpleButton>
      </div> -->
    </div>
  </SimpleCard>
</template>
<style scoped lang="scss">
.notification-card {
  user-select: none;
  overflow: hidden;
  flex-shrink: 0;
  margin: var(--space-5) auto;
  width: 100%;
  height: 120px;
}
.submittion-sammary-container {
  height: 100%;
  position: relative;
}
.greeting {
  font-size: var(--font-size-4);
  font-weight: 500;
  position: absolute;
  top: 30%;
  left: var(--space-10);
  transform: translateY(-50%);
}
.now-date-clock {
  font-size: var(--font-size-10);
  font-weight: 700;
  position: absolute;
  top: 60%;
  left: var(--space-10);
  transform: translateY(-50%);
}
.shortcut-button {
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  position: absolute;
  top: 50%;
  right: 20%;
  z-index: 1;
  transform: translate(50%, -50%) translate3d(0, 0, 0);
}
.accent-circle {
  position: absolute;
  width: 50%;
  padding-top: 50%;
  top: 50%;
  right: 20%;
  transform: translate(50%, -50%);
  &::before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    border-radius: 50% 70% / 50% 50%;
    background-color: var(--theme-color);
    animation: wave linear 32s infinite;
  }
}
@keyframes wave {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
