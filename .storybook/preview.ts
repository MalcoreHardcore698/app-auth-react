import type { Preview } from "@storybook/react-vite";

import "../src/shared/styles/index.scss";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      test: "todo",
    },

    options: {
      storySort: {
        method: "alphabetical",
        order: [],
        locales: "",
      },
    },
  },
};

export default preview;
