import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            'src': path.resolve(__dirname, './src'),
        },
    },
    // server: {
    //     port: 4201,
    //     cors: false,
    //     open: true,
    //     origin: 'http://192.168.50.210:4201'
    // }
})