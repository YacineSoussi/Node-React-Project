export default {
    server: {
      port: process.env.CLIENT_PORT,
      host: process.env.CLIENT_HOST
    },
    build: {
      outDir: "../build/client",
      emptyOutDir: true
    }
  }
  