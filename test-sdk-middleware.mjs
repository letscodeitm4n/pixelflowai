import { x402ResourceServer, paymentMiddleware } from '@okxweb3/x402-express';
import { ExactEvmScheme } from '@okxweb3/x402-evm/exact/server';
import express from 'express';

const app = express();
app.use(express.json());

const resourceServer = new x402ResourceServer();
resourceServer.register('eip155:196', new ExactEvmScheme());

const routesConfig = {
  'POST /v1/compress': {
    accepts: [
      {
        scheme: 'exact',
        network: 'eip155:196',
        asset: '0x779ded0c9e1022225f8e0630b35a9b54be713736',
        payTo: '0xae003877641ed159f45296904014ac1616d50f76',
        price: '0.01',
      },
    ],
    description: 'Compress images',
    mimeType: 'application/json',
  },
};

app.use(paymentMiddleware(routesConfig, resourceServer));

app.post('/v1/compress', (req, res) => {
  res.json({ success: true, message: 'delivered' });
});

app.listen(4005, () => {
  console.log('Test SDK server running on port 4005');
});
