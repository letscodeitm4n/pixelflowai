import { x402ResourceServer } from '@okxweb3/x402-express';
import { ExactEvmScheme } from '@okxweb3/x402-evm/exact/server';

const resourceServer = new x402ResourceServer();
resourceServer.register('eip155:196', new ExactEvmScheme());

const requirements = [
  {
    scheme: 'exact',
    network: 'eip155:196',
    asset: '0x779ded0c9e1022225f8e0630b35a9b54be713736',
    payTo: '0xae003877641ed159f45296904014ac1616d50f76',
    price: '0.01',
  }
];

const resp = resourceServer.createPaymentRequiredResponse(requirements, { description: 'Compress images' });
console.log('PaymentRequiredResponse:', JSON.stringify(resp, null, 2));
