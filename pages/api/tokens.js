const https = require('https');

const KOVAN_TOKENS = [
  {
    name: 'Wrapped Ether',
    symbol: 'WETH',
    address: '0xd0A1E359811322d97991E03f863a0C30C2cF029C',
  },
  {
    name: 'USD Coin',
    symbol: 'USDC',
    address: '0xb7a4F3E9097C08dA09517b5aB877F7a917224ede',
  },
  {
    name: 'Dai Stablecoin',
    symbol: 'DAI',
    address: '0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa',
  },
  {
    name: 'Tether USD',
    symbol: 'USDT',
    address: '0x07de306FF27a2B630B1141956844eB1552B956B5',
  },
  {
    name: 'Wrapped BTC',
    symbol: 'WBTC',
    address: '0xd3A691C852CDB01E281545A27064741F0B7f6825',
  },
  {
    name: 'Compound BAT',
    symbol: 'cBAT',
    address: '0x4a77fAeE9650b09849Ff459eA1476eaB01606C7a',
  },
];

export default function handler(req, res) {
  if (req.query.chainId === '42') {
    res.status(200).json(KOVAN_TOKENS);
  } else {
    https
      .get('https://tokens.coingecko.com/uniswap/all.json', (resp) => {
        let data = '';

        resp.on('data', (chunk) => {
          data += chunk;
        });

        resp.on('end', () => {
          const parsedData = JSON.parse(data);
          res.status(200).json(parsedData.tokens);
        });
      })
      .on('error', (err) => {
        console.error('Error: ' + err.message);
      });
  }
}
