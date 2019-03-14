var loginForm = document.getElementById('login-form');


function handleLoginSubmit(event){
  event.preventDefault();

  var UserId = event.target.username.value;
  var PassId = event.target.password.value;

  console.log(PassId);
  console.log(UserId);

  if (UserId === 'me' && PassId === '1') {
    window.location.replace('dashboard.html');
  } else {
    alert('Bi');
  }
}



loginForm.addEventListener('submit', handleLoginSubmit);
