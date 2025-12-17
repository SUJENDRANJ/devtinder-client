const API_BASE = 'https://devtinder-server-v33b.onrender.com';

export const api = {
  async signup(data) {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async login(emailId, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ emailId, password }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async logout() {
    const res = await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async getProfile() {
    const res = await fetch(`${API_BASE}/profile/view`, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async updateProfile(data) {
    const res = await fetch(`${API_BASE}/profile/edit`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async getFeed(page = 1, limit = 10) {
    const res = await fetch(`${API_BASE}/user/feed?page=${page}&limit=${limit}`, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async sendInterest(userId) {
    const res = await fetch(`${API_BASE}/request/send/interested/${userId}`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async reviewRequest(status, requestId) {
    const res = await fetch(`${API_BASE}/request/review/${status}/${requestId}`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async getReceivedRequests() {
    const res = await fetch(`${API_BASE}/user/requests/received`, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async getConnections() {
    const res = await fetch(`${API_BASE}/user/connections`, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
};
