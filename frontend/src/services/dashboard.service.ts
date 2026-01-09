export const dashboardService = {
  async getTasks() {
    const res = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5');
    return res.json();
  },

  async getAnalytics() {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
    return res.json();
  },
};
