<script setup lang="ts">
/**
 * The animated field that runs behind the laptop screen.
 *
 * It draws a small layered network and sends pulses along a subset of its
 * edges - the visual shorthand for tokens moving through a model, which is
 * what the surrounding copy is about.
 *
 * Two deliberate choices keep it cheap:
 *
 * 1. The graph is generated once at module scope from a seeded generator,
 *    so the server and the client produce byte-identical markup and
 *    hydration never has to patch it.
 * 2. Only about a third of the edges animate. The rest are static strokes,
 *    which cost nothing, and the movement still reads as a flow.
 */

/** Deterministic PRNG (mulberry32) so the layout is stable across renders. */
function seededRandom(seed: number): () => number {
  let state = seed
  return () => {
    state = (state + 0x6D2B79F5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const VIEW_W = 1600
const VIEW_H = 900

interface Node { x: number, y: number, layer: number }
interface Edge { d: string, live: boolean, dur: string, delay: string }

/** Build the layered graph and the bezier edges that connect it. */
function buildField(): { nodes: Node[], edges: Edge[] } {
  const random = seededRandom(20260904)
  const columns = [60, 420, 800, 1180, 1540]
  const counts = [3, 5, 6, 5, 3]

  const layers: Node[][] = columns.map((x, layer) => {
    const count = counts[layer]!
    const gap = VIEW_H / (count + 1)
    return Array.from({ length: count }, (_, i) => ({
      x,
      // A little jitter stops the columns reading as a rigid grid.
      y: gap * (i + 1) + (random() - 0.5) * gap * 0.45,
      layer,
    }))
  })

  const edges: Edge[] = []
  for (let i = 0; i < layers.length - 1; i++) {
    const from = layers[i]!
    const to = layers[i + 1]!
    for (const source of from) {
      // Two outgoing edges per node: dense enough to look like a network,
      // sparse enough to stay legible behind text.
      const picked = new Set<number>()
      while (picked.size < Math.min(2, to.length)) {
        picked.add(Math.floor(random() * to.length))
      }
      for (const index of picked) {
        const target = to[index]!
        const bend = (target.x - source.x) * 0.5
        edges.push({
          d: `M${source.x} ${source.y.toFixed(1)}`
            + `C${source.x + bend} ${source.y.toFixed(1)},`
            + `${target.x - bend} ${target.y.toFixed(1)},`
            + `${target.x} ${target.y.toFixed(1)}`,
          live: random() < 0.34,
          dur: `${(2.6 + random() * 2.8).toFixed(2)}s`,
          delay: `${(random() * -5).toFixed(2)}s`,
        })
      }
    }
  }

  return { nodes: layers.flat(), edges }
}

const { nodes, edges } = buildField()
</script>

<template>
  <svg
    class="flow"
    :viewBox="`0 0 ${VIEW_W} ${VIEW_H}`"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <linearGradient
        id="flow-edge"
        x1="0"
        y1="0"
        x2="1"
        y2="0"
      >
        <stop offset="0%" stop-color="var(--c-accent)" />
        <stop offset="100%" stop-color="var(--c-accent-2)" />
      </linearGradient>
      <radialGradient id="flow-node">
        <stop offset="0%" stop-color="var(--c-accent-soft)" />
        <stop offset="100%" stop-color="var(--c-accent)" />
      </radialGradient>
    </defs>

    <g class="flow__edges">
      <path
        v-for="(edge, index) in edges"
        :key="`e${index}`"
        :class="['flow__edge', { 'flow__edge--live': edge.live }]"
        :d="edge.d"
        pathLength="1"
        :style="edge.live ? { '--dur': edge.dur, '--delay': edge.delay } : undefined"
      />
    </g>

    <g class="flow__nodes">
      <circle
        v-for="(node, index) in nodes"
        :key="`n${index}`"
        class="flow__node"
        :cx="node.x"
        :cy="node.y"
        r="5"
        :style="{ '--delay': `${(index % 7) * -0.6}s` }"
      />
    </g>
  </svg>
</template>

<style scoped>
.flow {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.flow__edge {
  fill: none;
  stroke: var(--c-line-strong);
  stroke-width: 1.25;
}

/**
 * `pathLength="1"` normalises every edge, so one dash pattern and one set of
 * keyframes produce a correctly-proportioned comet on paths of any length.
 */
.flow__edge--live {
  animation: flow-comet var(--dur, 4s) linear var(--delay, 0s) infinite;
  stroke: url("#flow-edge");
  stroke-dasharray: 0.06 0.94;
  stroke-linecap: round;
  stroke-width: 2.5;
}

.flow__node {
  animation: node-breathe 4.5s ease-in-out var(--delay, 0s) infinite;
  fill: url("#flow-node");
}

@keyframes flow-comet {
  from {
    stroke-dashoffset: 1;
  }

  to {
    stroke-dashoffset: 0;
  }
}

@keyframes node-breathe {
  0%,
  100% {
    opacity: 0.3;
  }

  50% {
    opacity: 0.9;
  }
}
</style>
