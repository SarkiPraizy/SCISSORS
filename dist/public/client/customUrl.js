async function updateUrl() {
    const customId = document.getElementById("shortId").value;

    try {
      const response = await fetch(`/api/customUrl/${customId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ shortId: customId }),
      });
      const data = await response.json();

      if (response.ok) {
        document.getElementById("responseMessage").innerHTML = `
        <p>${data.message}</p>
      `;
      } else {
        console.error("Error:", data.message);
        document.getElementById("responseMessage").innerHTML = `
        <p>Error: ${data.message}</p>
      `;
      }
    } catch (error) {
      console.error("Error:", error);
      document.getElementById("responseMessage").innerHTML = `
      <p>Error: ${error.message}</p>
    `;
    }
  }