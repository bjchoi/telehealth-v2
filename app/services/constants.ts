export const Uris = {
  backendRoot : 'http://localhost:3000',
  token: {
    get: '/visit/token',
    validate: '/token/validate'
  },
  visits: {
    list: '/visits',
    get: '/visits/{id}',
    patientRoomToken: '/visit/room'
  },

  get: (endpoint: string): string => {
    return `${Uris.backendRoot}${endpoint}`;
  }
};

