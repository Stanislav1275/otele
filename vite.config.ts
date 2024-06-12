import path from "path"
import react from "@vitejs/plugin-react"
import {defineConfig} from "vite"
import tailwindcss from 'tailwindcss'

export default defineConfig({
    
    plugins: [react()],
    server: {
        //@ts-expect-error
        historyApiFallback: true,
    },
    css: {
        postcss: {
            plugins: [tailwindcss()]
        }
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
})
