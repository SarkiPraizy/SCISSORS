document
.getElementById("signin-form")
.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();

    if (response.ok) {
      document.getElementById("success-message").innerText =
        data.message;
      document.getElementById("error-message").innerText = "";
    } else {
      document.getElementById("error-message").innerText = data.message;
      document.getElementById("success-message").innerText = "";
    }
  } catch (error) {
    console.error("Error signing in:", error);
  }
});