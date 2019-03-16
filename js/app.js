var loginForm = document.getElementById('login-form');


function handleLoginSubmit(event){
  event.preventDefault();

  var UserId = event.target.username.value;
  var PassId = event.target.password.value;

  console.log(PassId);
  console.log(UserId);

  if (UserId === 'Username' && PassId === 'Pa$$word') {
    window.location.replace('dashboard.html');
  } else {
    alert('Wrong Password');
  }
}



loginForm.addEventListener('submit', handleLoginSubmit);



