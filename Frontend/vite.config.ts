// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })


// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import { viteStaticCopy } from 'vite-plugin-static-copy'; // Import viteStaticCopy instead of VitePluginStaticCopy

// export default defineConfig({
//   plugins: [
//     react(),
//     viteStaticCopy({
//       targets: [
//         {
//           src: 'src/assets/images',
//           dest: 'assets'
//         }
//       ]
//     })
//   ],
//   build: {
//     outDir: 'dist',
//     assetsDir: 'assets',
//     rollupOptions: {
//       // Ensure proper output format for JavaScript modules
//       output: {
//         format: 'es'
//       }
//     }
//   },
// });


import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        format: 'es' // Ensure output format is 'es' for ECMAScript modules
      }
    }
  }
});
