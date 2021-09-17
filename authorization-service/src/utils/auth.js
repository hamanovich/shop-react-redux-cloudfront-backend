export const getUserCredentials = (authorizationToken) => {
  const encodedCredentials = authorizationToken.split(' ')[1];
  const buff = Buffer.from(encodedCredentials, 'base64');
  const [username, password] = buff.toString('utf-8').split(':');
  return { encodedCredentials, username, password };
};

export const getPolicyEffect = (username, password) => {
  const storedUserPassword = process.env[username];
  const isPasswordCorrect = storedUserPassword && storedUserPassword === password;
  return isPasswordCorrect ? 'Allow' : 'Deny';
};

export const generatePolicy = (principalId, resource, effect = 'Allow') => ({
  principalId,
  policyDocument: {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: resource,
      },
    ],
  },
});
