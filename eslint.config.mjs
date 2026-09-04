// Flat ESLint config generated from the Nuxt module, plus project rules.
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    // Page and component names are scoped by directory, so single-word names
    // like `TheStage` are unambiguous here.
    'vue/multi-word-component-names': 'off',

    // This site draws its devices and its game character as inline SVG, and
    // SVG shapes carry a lot of short geometry attributes. Forcing them onto
    // separate lines turns a readable path into forty lines of noise, so
    // attribute grouping is left to judgement here.
    'vue/max-attributes-per-line': 'off',
  },
})
