import fs from 'node:fs'
import path from 'node:path'
import { defineConfig, searchForWorkspaceRoot } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

const musicRoot = path.resolve(process.cwd(), 'public/music')

// https://vite.dev/config/
export default defineConfig({

  plugins: [
    react(),
    tailwindcss(),
    nodePolyfills({
      include: ['buffer', 'process']
    }),
    {
      name: 'local-music-dev-server',
      configureServer(server) {
        server.middlewares.use('/local-music-manifest', (_req, res) => {
          fs.readdir(musicRoot, (error, files) => {
            if (error) {
              res.statusCode = 500
              res.end(JSON.stringify({ error: 'Unable to read music folder' }))
              return
            }

            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(files.filter((file) => {
              const ext = file.toLowerCase();
              return ext.endsWith('.mp3') || ext.endsWith('.flac') || ext.endsWith('.opus') || ext.endsWith('.m4a') || ext.endsWith('.wav') || ext.endsWith('.ogg');
            })))
          })
        })

        server.middlewares.use('/music', (req, res, next) => {
          const pathname = new URL(req.url || '/', 'http://localhost').pathname
          const fileName = decodeURIComponent(pathname).replace(/^\/+/, '')
          const filePath = path.resolve(musicRoot, fileName)
          const rootPath = path.resolve(musicRoot)

          if (!filePath.startsWith(rootPath + path.sep)) {
            res.statusCode = 403
            res.end('Forbidden')
            return
          }

          fs.stat(filePath, (statError, stat) => {
            if (statError || !stat.isFile()) {
              next()
              return
            }

            const ext = path.extname(filePath).toLowerCase()
            const mimeTypes: Record<string, string> = {
              '.mp3': 'audio/mpeg',
              '.flac': 'audio/flac',
              '.opus': 'audio/ogg',
              '.ogg': 'audio/ogg',
              '.m4a': 'audio/mp4',
              '.wav': 'audio/wav',
            }
            res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream')
            res.setHeader('Accept-Ranges', 'bytes')

            const range = req.headers.range
            if (!range) {
              res.setHeader('Content-Length', stat.size)
              if (req.method === 'HEAD') {
                res.end()
                return
              }
              fs.createReadStream(filePath).pipe(res)
              return
            }

            const [startText, endText] = range.replace(/bytes=/, '').split('-')
            const start = Number.parseInt(startText, 10)
            const end = endText ? Number.parseInt(endText, 10) : stat.size - 1

            if (Number.isNaN(start) || Number.isNaN(end) || start > end) {
              res.statusCode = 416
              res.setHeader('Content-Range', `bytes */${stat.size}`)
              res.end()
              return
            }

            res.statusCode = 206
            res.setHeader('Content-Length', end - start + 1)
            res.setHeader('Content-Range', `bytes ${start}-${end}/${stat.size}`)
            fs.createReadStream(filePath, { start, end }).pipe(res)
          })
        })
      },
    },
  ],
  server: {
    fs: {
      allow: [
        searchForWorkspaceRoot(process.cwd())
      ]
    }
  }
})
