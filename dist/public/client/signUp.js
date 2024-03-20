document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
  
    try {
      const res = await signUp(firstName, lastName, email, password, confirmPassword);
      if (res.status === 201) {
        const data = res.data;
        console.log(data);
        document.getElementById('response').textContent = 'Sign up successful';
      }
    } catch (error) {
      console.error(error);
      document.getElementById('response').textContent = 'Error: ' + error.message;
    }
  });
  
  const signUp = async (firstName, lastName, email, password, confirmPassword) => {
    try {
      const res = await axios.post("/api/signup", { firstName, lastName, email, password, confirmPassword });
      return res;
    } catch (error) {
      throw error;
    }
  };
  
  console.log("connected")