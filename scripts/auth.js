import { requireAuth } from './utils.js';

const loginLink = document.getElementById('loginLink');
const logoutBtn = document.getElementById('logoutBtn');

const token = localStorage.getItem('token');

if (token) {
  loginLink.style.display = 'none';
  logoutBtn.style.display = 'inline-block';
} else {
  logoutBtn.style.display = 'none';
}

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
});
