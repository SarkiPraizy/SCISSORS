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


document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
  
    try {
      const res = await signUp(firstName, lastName, email, password, confirmPassword);
      
    } catch (error) {
      console.error(error);
      }
  });
  
  const signUp = async (firstName, lastName, email, password, confirmPassword) => {
    try {
      const res = await axios.post("/api/auth/signup", { firstName, lastName, email, password, confirmPassword });
      console.log(res)

      if(res.status === 201){
      const {message} = res.data
    showAlert("success", message)
       window.setTimeout(() => {
          location.assign('/views/login');
        }, 5000);
        console.log("signup is successful")
        console.log(res.data)
        return res;
      }

    else {
      console.log("signup is unsuccessful")
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
  
  console.log("connected")