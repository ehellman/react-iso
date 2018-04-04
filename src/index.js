import http from 'http'
// import express from 'express';
import app from './server'
import Loadable from 'react-loadable'

const server = http.createServer(app)

let currentApp = app

Loadable.preloadAll().then(() => {
  server.listen(process.env.PORT || 3000)
})

if (module.hot) {
  console.log('✅  Server-side HMR Enabled!')

  module.hot.accept('./server', () => {
    console.log('🔁  HMR Reloading `./server`...')
    server.removeListener('request', currentApp)
    const newApp = require('./server').default
    server.on('request', newApp)
    currentApp = newApp
  })
}

// if (module.hot) {
//   module.hot.accept('./server', function() {
//     console.log('🔁  HMR Reloading `./server`...')
//   })
//   console.info('✅  Server-side HMR Enabled!')
// }

// const port = process.env.PORT || 3000

// export default express()
//   .use((req, res) => app.handle(req, res))
//   .listen(port, function(err) {
//     if (err) {
//       console.error(err)
//       return
//     }
//     console.log(`> Started on port ${port}`)
//   })
