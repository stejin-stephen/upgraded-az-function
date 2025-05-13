// import { esClient } from './elastic-client';
import logger from './logger';
import fs from 'fs';

const dns = require('dns');

//Check internet connection
async function checkInternet(): Promise<string> {
  return new Promise((resolve, reject) => {
    dns.lookup('api-dev.aldar.com', (err) => {
      if (err) {
        logger.warn('Error occurred: No internet connection. Could not resolve api-dev.aldar.com', err);
        resolve('No internet connection.');
      } else {
        resolve('Internet connection is available. Resolved api-dev.aldar.com');
      }
    });
  });
}

// async function getElasticHealth() {
//   try {
//     // Check cluster health
//     const health = await esClient.getClusterHealth();
//     return health;
//   } catch (error) {
//     logger.warn('Error fetching elastic error:', error);
//     return '';
//   }
// }

//Reach the package.json file
export function getPackageJson() {
  const path = `${process.cwd()}/package.json`;
  const packageData = JSON.parse(fs.readFileSync(path, 'utf8'));
  return packageData;
}
const { name, version } = getPackageJson();

export async function healthEndpoint() {
  return {
    response: {
      error: false,
      networkStatus: await checkInternet(),
      status: 'UP',
      service: name,
      version: version,
    //   elasticHealth: await getElasticHealth(),
    }
  };
}
