<script setup lang="ts">
/**
 * The character the player assembles, one slot per round.
 *
 * Each slot is its own `<g>`, keyed by the value it is currently showing, so
 * swapping a value remounts that group and replays the pop animation. The
 * figure is deliberately abstract - a stand-in for a person, not a portrait
 * of one.
 */
defineProps<{
  slots: Record<AvatarSlot, string>
  /** Dimmed and desaturated while the closing screen shows the true figure. */
  muted?: boolean
}>()
</script>

<template>
  <svg
    class="avatar"
    :class="{ 'avatar--muted': muted }"
    viewBox="-14 0 228 290"
    role="img"
    aria-hidden="true"
    focusable="false"
  >
    <!-- Ground shadow, so the figure sits rather than floats. -->
    <ellipse cx="100" cy="272" rx="62" ry="9" fill="rgb(0 0 0 / 45%)" />

    <!-- Torso. The outfit only changes its colour and its trim. -->
    <g :key="slots.outfit" class="pop">
      <rect
        x="36" y="150" width="128" height="112" rx="28"
        :fill="`var(--av-outfit-${slots.outfit})`"
      />
      <!-- Hoodie pocket and drawstrings -->
      <template v-if="slots.outfit === 'dev'">
        <path d="M74 206h52v22a10 10 0 0 1-10 10H84a10 10 0 0 1-10-10z" fill="rgb(0 0 0 / 22%)" />
        <path d="M88 152v26M112 152v26" stroke="#8d97ab" stroke-width="4" stroke-linecap="round" />
      </template>
      <!-- Chef's double button row -->
      <template v-if="slots.outfit === 'chef'">
        <circle cx="86" cy="182" r="4" fill="#b9b4a8" />
        <circle cx="86" cy="204" r="4" fill="#b9b4a8" />
        <circle cx="114" cy="182" r="4" fill="#b9b4a8" />
        <circle cx="114" cy="204" r="4" fill="#b9b4a8" />
      </template>
      <!-- Diver's harness -->
      <template v-if="slots.outfit === 'diver'">
        <path d="M36 186h128" stroke="#5c3a15" stroke-width="9" />
        <rect x="90" y="178" width="20" height="16" rx="4" fill="#3b2610" />
      </template>
    </g>

    <!-- Arms -->
    <rect x="24" y="164" width="22" height="72" rx="11" fill="var(--av-skin)" />
    <rect x="154" y="164" width="22" height="72" rx="11" fill="var(--av-skin)" />

    <!-- Head -->
    <circle cx="100" cy="94" r="48" fill="var(--av-skin)" />
    <rect x="88" y="132" width="24" height="26" rx="10" fill="var(--av-skin)" />

    <!-- Face -->
    <g :key="slots.face" class="pop face">
      <template v-if="slots.face === 'serene'">
        <path d="M74 92q10-9 20 0M106 92q10-9 20 0" />
        <path d="M86 116q14 12 28 0" />
      </template>
      <template v-else-if="slots.face === 'wide'">
        <circle cx="84" cy="92" r="8" class="face__eye" />
        <circle cx="116" cy="92" r="8" class="face__eye" />
        <circle cx="100" cy="116" r="7" class="face__eye" />
        <!-- Bubbles, for the deep-sea theory -->
        <circle cx="136" cy="70" r="5" class="face__bubble" />
        <circle cx="150" cy="48" r="3.5" class="face__bubble" />
      </template>
      <template v-else-if="slots.face === 'focus'">
        <path d="M74 76q10-6 20-2M106 74q10-4 20 2" />
        <circle cx="84" cy="94" r="5" class="face__eye" />
        <circle cx="116" cy="94" r="5" class="face__eye" />
        <ellipse cx="100" cy="118" rx="7" ry="9" class="face__eye" />
      </template>
      <template v-else>
        <circle cx="84" cy="94" r="5" class="face__eye" />
        <circle cx="116" cy="94" r="5" class="face__eye" />
        <path d="M88 118h24" />
      </template>
    </g>

    <!-- Headwear -->
    <g :key="slots.hat" class="pop">
      <template v-if="slots.hat === 'headphones'">
        <path
          d="M52 96a48 48 0 0 1 96 0"
          class="hat__band"
          fill="none"
          stroke-width="9"
          stroke-linecap="round"
        />
        <rect x="38" y="84" width="24" height="38" rx="11" fill="#20262f" />
        <rect x="138" y="84" width="24" height="38" rx="11" fill="#20262f" />
      </template>
      <template v-else-if="slots.hat === 'toque'">
        <rect x="66" y="52" width="68" height="20" rx="6" fill="#f2f0eb" />
        <circle cx="76" cy="38" r="20" fill="#f7f6f2" />
        <circle cx="100" cy="30" r="23" fill="#f7f6f2" />
        <circle cx="124" cy="38" r="20" fill="#f7f6f2" />
      </template>
      <template v-else-if="slots.hat === 'helmet'">
        <path d="M52 96a48 48 0 0 1 96 0v6H52z" fill="#8e99ab" />
        <circle cx="100" cy="86" r="26" fill="#0d1420" stroke="#b7c0cf" stroke-width="5" />
        <circle cx="92" cy="78" r="7" fill="rgb(255 255 255 / 35%)" />
      </template>
    </g>

    <!-- Held object, in the right hand -->
    <g :key="slots.hold" class="pop">
      <template v-if="slots.hold === 'keyboard'">
        <g transform="rotate(-12 168 232)">
          <rect x="132" y="220" width="66" height="26" rx="6" fill="#171d27" stroke="#3b4453" stroke-width="2" />
          <path
            d="M140 228h6M152 228h6M164 228h6M176 228h6M144 238h30"
            stroke="#6d7a90" stroke-width="3" stroke-linecap="round"
          />
        </g>
      </template>
      <template v-else-if="slots.hold === 'pin'">
        <rect x="130" y="224" width="62" height="18" rx="9" fill="#c89a63" />
        <rect x="120" y="229" width="14" height="8" rx="4" fill="#8d6a3c" />
        <rect x="188" y="229" width="14" height="8" rx="4" fill="#8d6a3c" />
      </template>
      <template v-else-if="slots.hold === 'torch'">
        <rect x="150" y="216" width="20" height="42" rx="6" fill="#4a5464" />
        <rect x="156" y="200" width="8" height="20" rx="4" fill="#8e99ab" />
        <path d="M160 200q-12-16 0-30 12 14 0 30z" fill="#4c8dff" class="torch__flame" />
      </template>
    </g>

    <!-- Chest badge -->
    <g :key="slots.badge" class="pop">
      <template v-if="slots.badge !== 'none'">
        <circle cx="68" cy="176" r="15" fill="rgb(0 0 0 / 35%)" stroke="var(--c-accent)" stroke-width="2" />
        <path
          v-if="slots.badge === 'ship'"
          d="M61 176l5 5 11-11"
          fill="none" stroke="var(--c-accent-soft)" stroke-width="3"
          stroke-linecap="round" stroke-linejoin="round"
        />
        <path
          v-else-if="slots.badge === 'pasta'"
          d="M60 180q5-10 10 0t10 0"
          fill="none" stroke="#e8c26a" stroke-width="3" stroke-linecap="round"
        />
        <path
          v-else-if="slots.badge === 'depth'"
          d="M68 168q8 10 0 15-8-5 0-15z"
          fill="#5ec8e8"
        />
      </template>
    </g>
  </svg>
</template>

<style scoped>
.avatar {
  --av-skin: #cfd6e4;
  --av-outfit-plain: #2a3040;
  --av-outfit-dev: #1e2532;
  --av-outfit-chef: #ece9e2;
  --av-outfit-diver: #d9822b;

  width: 100%;
  max-width: 15rem;
  height: auto;
  transition: opacity var(--t-base) var(--ease-out);
}

.avatar--muted {
  opacity: 0.35;
}

/* Face strokes share one treatment; individual shapes only set geometry. */
.face path {
  fill: none;
  stroke: var(--c-bg-inset);
  stroke-width: 5;
  stroke-linecap: round;
}

.face__eye {
  fill: var(--c-bg-inset);
}

.face__bubble {
  fill: none;
  stroke: #5ec8e8;
  stroke-width: 2.5;
}

.hat__band {
  stroke: #20262f;
}

.torch__flame {
  transform-origin: 160px 200px;
  animation: flame 0.9s var(--ease-in-out) infinite;
}

/* Replayed whenever a slot's key changes, which is exactly when the player
   has just picked the token that fills it. */
.pop {
  animation: pop var(--t-base) var(--ease-spring);
  transform-origin: 100px 160px;
}

@keyframes pop {
  from {
    opacity: 0;
    scale: 0.78;
  }

  to {
    opacity: 1;
    scale: 1;
  }
}

@keyframes flame {
  0%,
  100% {
    scale: 1 1;
  }

  50% {
    scale: 0.88 1.12;
  }
}
</style>
