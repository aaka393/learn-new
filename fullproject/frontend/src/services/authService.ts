export const authService = {
  login: async (username: string, password: string) => {
    await new Promise((res) => setTimeout(res, 500));
    if (username === 'admin' && password === 'password') {
      return { success: true, username };
    }
    throw new Error('Invalid credentials');
  },

  register: async (username: string, password: string) => {
    await new Promise((res) => setTimeout(res, 500));
    return { success: true, username };
  },
};
