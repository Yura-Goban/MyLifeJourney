document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const allowedEmails = ['ugoban4@gmail.com'];
    const emailInput = document.getElementById('emailInput').value;

    if (allowedEmails.includes(emailInput)) {
        window.location.href = 'home.html'; // Перенаправлення на сторінку home.html
    } else {
        document.getElementById('error-message').classList.remove('hidden');
    }
});
