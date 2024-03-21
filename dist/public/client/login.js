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


document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    try {
      const res = await signIn(email, password);
      
    } catch (error) {
      console.error(error);
      }
  });
  
  const signIn = async  (email, password) => {
    try {
      const res = await axios.post("/api/auth/login", { email, password});
      console.log(res)

      if(res.status === 201){
      const {message} = res.data
    showAlert("success", message)
       window.setTimeout(() => {
          location.assign('/login');
        }, 5000);
        console.log("logged in!")
        console.log(res.data)
        return res;
      }

    else {
      console.log("login unsuccessful")
    }

  }catch (error) {
    console.log(error.response)
    if (error.response) {
    showAlert("fail", error.response.data.message)
    } 
    else {
      showAlert("fail", "Something went wrong")
    }
  }
};