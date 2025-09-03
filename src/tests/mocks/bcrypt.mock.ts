export default {
  hash: async (pw: string) => `hashed-${pw}`,
  compare: async (candidate: string, hashed: string) => hashed === `hashed-${candidate}`
};
