/**
 * @type {import('vite').UserConfig}
 */
export default {
  build: {
    outDir: "./dist",
    rollupOptions: {
      output: {
        manualChunks: false,
        inlineDynamicImports: true,
        entryFileNames: "[name].js", // currently does not work for the legacy bundle
        assetFileNames: "[name].[ext]", // currently does not work for images
      },
    },
  },
};
