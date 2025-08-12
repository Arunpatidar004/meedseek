// libs/ipfs.js
import { create } from 'ipfs-http-client';

export const ipfs = create({
  host: 'localhost',
  port: 5001,
  protocol: 'http'
});
