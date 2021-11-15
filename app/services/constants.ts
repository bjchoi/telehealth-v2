export const Uris = {
  backendRoot : 'http://localhost:3000',
  token: {
    get: '/token',
    validate: '/token/validate'
  },
  visits: {
    list: '/visits',
    get: '/visits/{id}'
  },

  get: (endpoint: string): string => {
    return `${Uris.backendRoot}${endpoint}`;
  }
};

