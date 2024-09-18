import './assets/css/style.css';
import { handleLogin } from './login';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector<HTMLFormElement>('#login-form form');

  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
});
