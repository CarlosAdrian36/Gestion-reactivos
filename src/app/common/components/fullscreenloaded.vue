<!-- <template>
  <div class="h-screen w-screen flex items-center justify-center">
    <svg width="50" height="50" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <rect class="spinner_9y7u" x="1" y="1" rx="1" width="10" height="10" fill="#007bff" />
      <rect class="spinner_9y7u spinner_DF2s" x="1" y="1" rx="1" width="10" height="10" />
      <rect class="spinner_9y7u spinner_q27e" x="1" y="1" rx="1" width="10" height="10" />
    </svg>
  </div>
</template>
<style scoped>
.spinner_9y7u {
  animation: spinner_fUkk 2.4s linear infinite;
  animation-delay: -2.4s;
}
.spinner_DF2s {
  animation-delay: -1.6s;
}
.spinner_q27e {
  animation-delay: -0.8s;
}
@keyframes spinner_fUkk {
  8.33% {
    x: 13px;
    y: 1px;
  }
  25% {
    x: 13px;
    y: 1px;
  }
  33.3% {
    x: 13px;
    y: 13px;
  }
  50% {
    x: 13px;
    y: 13px;
  }
  58.33% {
    x: 1px;
    y: 13px;
  }
  75% {
    x: 1px;
    y: 13px;
  }
  83.33% {
    x: 1px;
    y: 1px;
  }
}
</style> -->
<style scoped>
circle {
  fill: var(--off);
}
circle.on {
  fill: var(--on);
}
@media (prefers-reduced-motion: reduce) {
  circle {
    animation: none !important;
  }
}
@keyframes f0000111111111 {
  0% {
    opacity: 0;
  }
  30.76% {
    opacity: 0;
  }
  30.77% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
@keyframes f0000000000001 {
  0% {
    opacity: 0;
  }
  92.30% {
    opacity: 0;
  }
  92.31% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
@keyframes f0001111111111 {
  0% {
    opacity: 0;
  }
  23.07% {
    opacity: 0;
  }
  23.08% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
@keyframes f0000011111111 {
  0% {
    opacity: 0;
  }
  38.45% {
    opacity: 0;
  }
  38.46% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
@keyframes f0000000000011 {
  0% {
    opacity: 0;
  }
  84.61% {
    opacity: 0;
  }
  84.62% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
@keyframes f0011111111111 {
  0% {
    opacity: 0;
  }
  15.37% {
    opacity: 0;
  }
  15.38% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
@keyframes f0000001111111 {
  0% {
    opacity: 0;
  }
  46.14% {
    opacity: 0;
  }
  46.15% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
@keyframes f0000000000111 {
  0% {
    opacity: 0;
  }
  76.91% {
    opacity: 0;
  }
  76.92% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
@keyframes f0111111111111 {
  0% {
    opacity: 0;
  }
  7.68% {
    opacity: 0;
  }
  7.69% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
@keyframes f0000000111111 {
  0% {
    opacity: 0;
  }
  53.84% {
    opacity: 0;
  }
  53.85% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
@keyframes f0000000001111 {
  0% {
    opacity: 0;
  }
  69.22% {
    opacity: 0;
  }
  69.23% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
@keyframes f0000000011111 {
  0% {
    opacity: 0;
  }
  61.53% {
    opacity: 0;
  }
  61.54% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
</style>
<template>
  <div class="h-screen w-screen flex items-center justify-center">
    <!-- //El clas modifica el tamaño  -->
    <svg
      class="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20"" 
      viewBox="0 0 42 42"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      style="--on: #f5f5f5; --off: #404040; --dur: 1.95s"
    >
      <title>Loading</title>
      <circle cx="3" cy="3" r="2" />
      <circle cx="9" cy="3" r="2" />
      <circle cx="15" cy="3" r="2" />
      <circle cx="21" cy="3" r="2" />
      <circle cx="27" cy="3" r="2" />
      <circle cx="33" cy="3" r="2" />
      <circle cx="39" cy="3" r="2" />
      <circle cx="3" cy="9" r="2" />
      <circle cx="9" cy="9" r="2" />
      <circle
        class="on"
        cx="9"
        cy="9"
        r="2"
        opacity="0"
        style="animation: f0000111111111 var(--dur) linear infinite"
      />
      <circle cx="15" cy="9" r="2" />
      <circle cx="21" cy="9" r="2" />
      <circle cx="27" cy="9" r="2" />
      <circle cx="33" cy="9" r="2" />
      <circle
        class="on"
        cx="33"
        cy="9"
        r="2"
        opacity="0"
        style="animation: f0000000000001 var(--dur) linear infinite"
      />
      <circle cx="39" cy="9" r="2" />
      <circle cx="3" cy="15" r="2" />
      <circle cx="9" cy="15" r="2" />
      <circle
        class="on"
        cx="9"
        cy="15"
        r="2"
        opacity="0"
        style="animation: f0001111111111 var(--dur) linear infinite"
      />
      <circle cx="15" cy="15" r="2" />
      <circle
        class="on"
        cx="15"
        cy="15"
        r="2"
        opacity="0"
        style="animation: f0000011111111 var(--dur) linear infinite"
      />
      <circle cx="21" cy="15" r="2" />
      <circle cx="27" cy="15" r="2" />
      <circle cx="33" cy="15" r="2" />
      <circle
        class="on"
        cx="33"
        cy="15"
        r="2"
        opacity="0"
        style="animation: f0000000000011 var(--dur) linear infinite"
      />
      <circle cx="39" cy="15" r="2" />
      <circle cx="3" cy="21" r="2" />
      <circle cx="9" cy="21" r="2" />
      <circle
        class="on"
        cx="9"
        cy="21"
        r="2"
        opacity="0"
        style="animation: f0011111111111 var(--dur) linear infinite"
      />
      <circle cx="15" cy="21" r="2" />
      <circle cx="21" cy="21" r="2" />
      <circle
        class="on"
        cx="21"
        cy="21"
        r="2"
        opacity="0"
        style="animation: f0000001111111 var(--dur) linear infinite"
      />
      <circle cx="27" cy="21" r="2" />
      <circle cx="33" cy="21" r="2" />
      <circle
        class="on"
        cx="33"
        cy="21"
        r="2"
        opacity="0"
        style="animation: f0000000000111 var(--dur) linear infinite"
      />
      <circle cx="39" cy="21" r="2" />
      <circle cx="3" cy="27" r="2" />
      <circle cx="9" cy="27" r="2" />
      <circle
        class="on"
        cx="9"
        cy="27"
        r="2"
        opacity="0"
        style="animation: f0111111111111 var(--dur) linear infinite"
      />
      <circle cx="15" cy="27" r="2" />
      <circle cx="21" cy="27" r="2" />
      <circle cx="27" cy="27" r="2" />
      <circle
        class="on"
        cx="27"
        cy="27"
        r="2"
        opacity="0"
        style="animation: f0000000111111 var(--dur) linear infinite"
      />
      <circle cx="33" cy="27" r="2" />
      <circle
        class="on"
        cx="33"
        cy="27"
        r="2"
        opacity="0"
        style="animation: f0000000001111 var(--dur) linear infinite"
      />
      <circle cx="39" cy="27" r="2" />
      <circle cx="3" cy="33" r="2" />
      <circle cx="9" cy="33" r="2" />
      <circle class="on" cx="9" cy="33" r="2" />
      <circle cx="15" cy="33" r="2" />
      <circle cx="21" cy="33" r="2" />
      <circle cx="27" cy="33" r="2" />
      <circle cx="33" cy="33" r="2" />
      <circle
        class="on"
        cx="33"
        cy="33"
        r="2"
        opacity="0"
        style="animation: f0000000011111 var(--dur) linear infinite"
      />
      <circle cx="39" cy="33" r="2" />
      <circle cx="3" cy="39" r="2" />
      <circle cx="9" cy="39" r="2" />
      <circle cx="15" cy="39" r="2" />
      <circle cx="21" cy="39" r="2" />
      <circle cx="27" cy="39" r="2" />
      <circle cx="33" cy="39" r="2" />
      <circle cx="39" cy="39" r="2" />
    </svg>
  </div>
</template>
