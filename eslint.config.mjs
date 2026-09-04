// Flat ESLint config generated from the Nuxt module, plus project rules.
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    // Page and component names are scoped by directory, so single-word names
    // like `TheStage` are unambiguous here.
    'vue/multi-word-component-names': 'off',

    // One attribute per line is unreadable for the many tiny SVG elements
    // this site draws. Short tags stay inline; anything already wrapped keeps
    // the strict one-per-line treatment.
    'vue/max-attributes-per-line': ['warn', {
      singleline: { max: 4 },
      multiline: { max: 1 },
    }],
  },
})
