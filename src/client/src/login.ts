export async function handleLogin(e: Event) {
  e.preventDefault();

  const username = document.querySelector<HTMLInputElement>('#name-input')!.value;
  const password = document.querySelector<HTMLInputElement>('#password-input')!.value;

  try {
    const response = await fetch('http://localhost:9090/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      const accessToken = data.accessToken;

      sessionStorage.setItem('accessToken', accessToken);

      window.location.href = '/pages/control.html';
    } else {
      const errorData = await response.json();
      alert('Login failed: ' + errorData.message);
    }
  } catch (error) {
    console.error('Error during login:', error);
    alert('An error occurred during login. Please try again later.');
  }
}
