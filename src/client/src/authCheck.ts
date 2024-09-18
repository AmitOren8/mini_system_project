document.addEventListener('DOMContentLoaded', async () => {
  try {
    let accessToken = sessionStorage.getItem('accessToken');

    // Check if access token exists
    if (!accessToken) {
      window.location.href = '/index.html';
      return;
    }

    // Validate the access token with the server
    let response = await fetch('http://localhost:9090/auth/validate', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 403) {
        // Assuming 403 means token is expired or invalid
        // Attempt to refresh the token
        const refreshResponse = await fetch('http://localhost:9090/auth/refresh', {
          method: 'POST',
          credentials: 'include', // Include cookies (for refresh token stored in cookies)
        });

        if (refreshResponse.ok) {
          const data = await refreshResponse.json();
          accessToken: String = data.accessToken;

          sessionStorage.setItem('accessToken', accessToken);

          // Optionally retry the original request or reload the page
          response = await fetch('http://localhost:9090/auth/validate', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (!response.ok) {
            // If validation still fails, redirect to login page
            window.location.href = '/index.html';
          }
        } else {
          // If refresh fails, redirect to login page
          window.location.href = '/index.html';
        }
      } else {
        // For any other errors, redirect to login page
        window.location.href = '/index.html';
      }
    }
  } catch (error) {
    console.error('Error checking authentication:', error);
    window.location.href = '/index.html';
  }
});
