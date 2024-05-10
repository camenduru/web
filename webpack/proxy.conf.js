function setupProxy({ tls }) {
  const serverResources = ['/api', '/services', '/management', '/v3/api-docs', '/h2-console', '/health'];
  const conf = [
    {
      context: serverResources,
      target: `http${tls ? 's' : ''}://localhost:3000`,
      secure: false,
      changeOrigin: tls,
    },
    {
      context: ['/websocket'],
      target: 'ws://localhost:3000',
      ws: true,
    },
  ];
  return conf;
}

module.exports = setupProxy;
