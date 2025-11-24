const authSettings = {
    authority: 'https://localhost:7000',
    client_id: 'SINGLECLIC.IDENTITY.UI',
    client_secret: '901564A5-E7FE-42CB-B10D-61EF6A8F3655',
    redirect_uri: 'http://localhost:3000/oauth/callback',
    silent_redirect_uri: 'http://localhost:3000/oauth/callback',
    post_logout_redirect_uri: 'http://localhost:3000/',
    response_type: 'code',
    scope: 'openid profile email api1'
  };
  
  export const authConfig = {
    settings: authSettings,
    flow: 'auth'
  };