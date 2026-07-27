import { x402ResourceServer } from '@okxweb3/x402-express';
import { ExactEvmScheme } from '@okxweb3/x402-evm/exact/server';

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

console.log('Resource server methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(resourceServer)));
