import * as express from 'express'
import * as React from 'react'
import { Capture } from 'react-loadable'
import { getBundles } from 'react-loadable/webpack'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'

import App from './App'

let assets: any
let stats: any

const syncLoadAssets = () => {
  assets = require(process.env.RAZZLE_ASSETS_MANIFEST!)
  stats = require('../build/react-loadable.json')
}
syncLoadAssets()

const server = express()

server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR!))
  .get('/*', (req: express.Request, res: express.Response) => {
    const environment: any = process.env.NODE_ENV || 'development'
    const host: any = process.env.HOST
    const port: any = process.env.PORT || 3001

    const context: any = {}
    const modules: any = []
    const markup = renderToString(
      <Capture report={moduleName => modules.push(moduleName)}>
        <StaticRouter context={context} location={req.url}>
          <App />
        </StaticRouter>
      </Capture>,
    )
    if (context.url) {
      res.redirect(context.url)
    } else {
      const bundles = getBundles(stats, modules)
      const chunks = bundles.filter(bundle => bundle.file.endsWith('.js'))
      res.status(200).send(
        `<!doctype html>
      <html lang="">
      <head>
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta charSet='utf-8' />
          <title>Razzle TypeScript</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          ${
            assets.client.css
              ? `<link rel="stylesheet" href="${assets.client.css}">`
              : ''
          }
          ${
            environment === 'production'
              ? `<script src="${assets.client.js}" defer></script>`
              : `<script src="${
                  assets.client.js
                }" defer crossorigin></script>`
          }
      </head>
      <body>
          <div id="root">${markup}</div>
          ${() => {
            if (environment === 'production') {
              return `<script src="${assets.client.js || ''}"></script>`
            } else {
              return `<script src="${assets.client.js || ''}" crossorigin></script>`
            }
          }
          }
          ${chunks
            .map(
              chunk =>
                environment === 'production'
                  ? `<script src="/${chunk.file}"></script>`
                  : `<script src="http://${host}:${port}/${chunk.file}"></script>`,
            )
            .join('\n')}
      </body>
  </html>`,
      )
    }
  })

export default server
