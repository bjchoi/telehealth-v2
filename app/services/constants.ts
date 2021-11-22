export const Uris = {
  backendRoot : 'http://localhost:3001',
  token: {
    get: '/visit/token',
    validate: '/token/validate'
  },
  visits: {
    list: '/visits',
    get: '/visits/{id}',
    patientRoomToken: '/visit/room',
    providerRoomToken: '/visit/provider-room',
  },

  get: (endpoint: string): string => {
    return `${Uris.backendRoot}${endpoint}`;
  }
};

