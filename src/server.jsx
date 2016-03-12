import express from 'express'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { match, RouterContext } from 'react-router'
import routes from './routes'
const app = express()

function renderFullPage(renderedContent) {
  return `
  <!DOCTYPE html>
    <html>

    <head>
        <meta charset="utf-8">
        <title>React Server Rendering sample</title>
    </head>

    <div id="app">${renderedContent}</div>

    <script type="text/javascript" charset="utf-8" src="bundle.js"></script>
    </body>
    </html>

  `;
}

app.use((req, res) => {
  match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
    if (error) {
      res.status(500).send(error.message)
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      const renderedContent = renderToString(<RouterContext {...renderProps} />);
      const renderedPage = renderFullPage(renderedContent);
      res.status(200).send(renderedPage);
    } else {
      res.status(404).send('Not found')
    }
  })
});

app.listen(8081, 'localhost', (err, res) => {
  if (err) {
    console.log(err);
  }
  console.log('Listening...localhost:8081');
});
