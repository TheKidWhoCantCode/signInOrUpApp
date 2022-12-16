const signUpContainer = document.getElementById('signUpContainer');
const signInContainer = document.getElementById('signInContainer');

function toggleSignUpPage() {
    if(signUpContainer.classList.contains('hidden')) {
        signInContainer.classList.add('hidden');
        signUpContainer.classList.remove('hidden');
        return;
    } else if(!signUpContainer.classList.contains('hidden')) {
        signUpContainer.classList.add('hidden');
        signInContainer.classList.remove('hidden');
        return; 
    };
};