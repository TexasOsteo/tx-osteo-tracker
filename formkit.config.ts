import { generateClasses } from '@formkit/themes'
import { genesisIcons } from '@formkit/icons'
import { en } from '@formkit/i18n'
import { defineFormKitConfig } from '@formkit/vue'
import tailwindTheme from 'assets/formkit-tailwind-theme'

export default defineFormKitConfig({
  icons: {
    ...genesisIcons,
  },
  config: {
    classes: generateClasses(tailwindTheme),
  },
  locales: { en },
  locale: 'en',
})
