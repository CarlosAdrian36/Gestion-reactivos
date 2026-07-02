<style>
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
@keyframes f000011111111111111111000 {
  0% {
    opacity: 0;
  }
  16.66% {
    opacity: 0;
  }
  16.67% {
    opacity: 1;
  }
  87.49% {
    opacity: 1;
  }
  87.50% {
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}
@keyframes f000000000000100000000000 {
  0% {
    opacity: 0;
  }
  49.99% {
    opacity: 0;
  }
  50.00% {
    opacity: 1;
  }
  54.16% {
    opacity: 1;
  }
  54.17% {
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}
@keyframes f000111111111111111111100 {
  0% {
    opacity: 0;
  }
  12.49% {
    opacity: 0;
  }
  12.50% {
    opacity: 1;
  }
  91.66% {
    opacity: 1;
  }
  91.67% {
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}
@keyframes f000001111111111111110000 {
  0% {
    opacity: 0;
  }
  20.82% {
    opacity: 0;
  }
  20.83% {
    opacity: 1;
  }
  83.32% {
    opacity: 1;
  }
  83.33% {
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}
@keyframes f000000000001110000000000 {
  0% {
    opacity: 0;
  }
  45.82% {
    opacity: 0;
  }
  45.83% {
    opacity: 1;
  }
  58.32% {
    opacity: 1;
  }
  58.33% {
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}
@keyframes f001111111111111111111110 {
  0% {
    opacity: 0;
  }
  8.32% {
    opacity: 0;
  }
  8.33% {
    opacity: 1;
  }
  95.82% {
    opacity: 1;
  }
  95.83% {
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}
@keyframes f000000111111111111100000 {
  0% {
    opacity: 0;
  }
  24.99% {
    opacity: 0;
  }
  25.00% {
    opacity: 1;
  }
  79.16% {
    opacity: 1;
  }
  79.17% {
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}
@keyframes f000000000011111000000000 {
  0% {
    opacity: 0;
  }
  41.66% {
    opacity: 0;
  }
  41.67% {
    opacity: 1;
  }
  62.49% {
    opacity: 1;
  }
  62.50% {
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}
@keyframes f011111111111111111111111 {
  0% {
    opacity: 0;
  }
  4.16% {
    opacity: 0;
  }
  4.17% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
@keyframes f000000011111111111000000 {
  0% {
    opacity: 0;
  }
  29.16% {
    opacity: 0;
  }
  29.17% {
    opacity: 1;
  }
  74.99% {
    opacity: 1;
  }
  75.00% {
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}
@keyframes f000000000111111100000000 {
  0% {
    opacity: 0;
  }
  37.49% {
    opacity: 0;
  }
  37.50% {
    opacity: 1;
  }
  66.66% {
    opacity: 1;
  }
  66.67% {
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}
@keyframes f000000001111111110000000 {
  0% {
    opacity: 0;
  }
  33.32% {
    opacity: 0;
  }
  33.33% {
    opacity: 1;
  }
  70.82% {
    opacity: 1;
  }
  70.83% {
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}
</style>
<template>
  <div class="h-screen w-screen flex items-center justify-center bg-base-300">
    <svg
      class="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20"
      viewBox="0 0 42 42"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      style="--on: #262626; --off: #e5e5e5; --dur: 3.6s"
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
        style="animation: f000011111111111111111000 var(--dur) linear infinite"
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
        style="animation: f000000000000100000000000 var(--dur) linear infinite"
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
        style="animation: f000111111111111111111100 var(--dur) linear infinite"
      />
      <circle cx="15" cy="15" r="2" />
      <circle
        class="on"
        cx="15"
        cy="15"
        r="2"
        opacity="0"
        style="animation: f000001111111111111110000 var(--dur) linear infinite"
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
        style="animation: f000000000001110000000000 var(--dur) linear infinite"
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
        style="animation: f001111111111111111111110 var(--dur) linear infinite"
      />
      <circle cx="15" cy="21" r="2" />
      <circle cx="21" cy="21" r="2" />
      <circle
        class="on"
        cx="21"
        cy="21"
        r="2"
        opacity="0"
        style="animation: f000000111111111111100000 var(--dur) linear infinite"
      />
      <circle cx="27" cy="21" r="2" />
      <circle cx="33" cy="21" r="2" />
      <circle
        class="on"
        cx="33"
        cy="21"
        r="2"
        opacity="0"
        style="animation: f000000000011111000000000 var(--dur) linear infinite"
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
        style="animation: f011111111111111111111111 var(--dur) linear infinite"
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
        style="animation: f000000011111111111000000 var(--dur) linear infinite"
      />
      <circle cx="33" cy="27" r="2" />
      <circle
        class="on"
        cx="33"
        cy="27"
        r="2"
        opacity="0"
        style="animation: f000000000111111100000000 var(--dur) linear infinite"
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
        style="animation: f000000001111111110000000 var(--dur) linear infinite"
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
