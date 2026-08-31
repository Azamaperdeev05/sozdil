import { fileURLToPath, URL } from 'url';
import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

function inlineCss(): Plugin {
  return {
    name: 'inline-css',
    apply: 'build',
    enforce: 'post',
    transformIndexHtml(html, { bundle }) {
      if (!bundle) return html;
      let outputHtml = html;
      for (const [fileName, file] of Object.entries(bundle)) {
        if (fileName.endsWith('.css') && file.type === 'asset') {
          const css = typeof file.source === 'string' ? file.source : file.source.toString();
          // Remove the <link rel="stylesheet" ...> and replace with inline <style>
          const linkRegex = new RegExp(`<link[^>]+href="[^"]*${fileName}"[^>]*>`, 'i');
          if (linkRegex.test(outputHtml)) {
            outputHtml = outputHtml.replace(linkRegex, `<style>${css}</style>`);
            delete bundle[fileName];
          }
        }
      }
      return outputHtml;
    },
  };
}

export default defineConfig({
  plugins: [tailwindcss(), react(), inlineCss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('.', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('words_4')) return 'dict-4';
          if (id.includes('words_5')) return 'dict-5';
          if (id.includes('words_6')) return 'dict-6';
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor-react';
          }
        },
      },
    },
  },
});
