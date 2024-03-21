const showAlert = (type, msg) => {
    hideAlert();
    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    document.body.insertAdjacentHTML('afterbegin', markup);
    window.setTimeout(hideAlert, 5000);
  };
  
  const hideAlert = () => {
    const alertElement = document.querySelector('.alert');
    if (alertElement) {
      alertElement.parentElement.removeChild(alertElement);
    }
  };

async function shortenUrl() {
    const url = document.getElementById("url").value;

    try {
      const response = await fetch("/api/shortenUrl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();

      if (response.ok) {
        document.getElementById("shortenedUrl").innerHTML = `
        <p>Shortened URL: <a href="${data.data.newUrl}" target="_blank">${data.data.newUrl}</a></p>
      `;
      } else {
        console.error("Error:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }