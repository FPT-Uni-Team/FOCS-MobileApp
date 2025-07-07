const endpoints = {
  auth: {
    login: () => '/api/me/login',
    refresh: () => '/api/me/refresh-token',
    logout: () => '/api/me/logout',
  },
};

export default endpoints;
