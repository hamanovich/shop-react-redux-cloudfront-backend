import 'source-map-support/register';
import logger from '../libs/logger';
import { getUserCredentials, getPolicyEffect, generatePolicy } from '../utils/auth';

async function basicAuthorizer(event, _context, cb) {
  logger.info('Basic authorizer event received', event);

  if (event.type !== 'TOKEN') {
    cb('Unauthorized');
    logger.error('Incorrect event type');
    return null;
  }

  try {
    const { authorizationToken, methodArn } = event;
    const { encodedCredentials, username, password } = getUserCredentials(authorizationToken);

    const effect = getPolicyEffect(username, password);
    const policy = generatePolicy(encodedCredentials, methodArn, effect);

    cb(null, policy);

    logger.info(`User authorization result: ${effect}`);

    return policy;
  } catch (err) {
    cb(`Unauthorized: ${err.message}`);
    logger.error(err);
  }
}

export default basicAuthorizer;
