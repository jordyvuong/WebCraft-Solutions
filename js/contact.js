// Menu mobile
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function() {
        if (mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.remove('hidden');
            mobileMenuBtn.setAttribute('aria-expanded', 'true');
        } else {
            mobileMenu.classList.add('hidden');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
    });
}

// Validation formulaire
const form = document.getElementById('contact-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
const successMsg = document.getElementById('success-message');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    console.log('Formulaire soumis');

    clearErrors();

    let isValid = true;

    if (nameInput.value.trim() === '') {
        showError('name', 'Le nom est obligatoire');
        isValid = false;
    } else if (nameInput.value.trim().length < 2) {
        showError('name', 'Le nom doit contenir au moins 2 caractères');
        isValid = false;
    }

    if (emailInput.value.trim() === '') {
        showError('email', 'L\'email est obligatoire');
        isValid = false;
    } else if (!isValidEmail(emailInput.value)) {
        showError('email', 'L\'email n\'est pas valide');
        isValid = false;
    }

    if (messageInput.value.trim() === '') {
        showError('message', 'Le message est obligatoire');
        isValid = false;
    } else if (messageInput.value.trim().length < 10) {
        showError('message', 'Le message doit contenir au moins 10 caractères');
        isValid = false;
    }

    if (isValid) {
        console.log('Formulaire valide !');
        console.log('Nom:', nameInput.value);
        console.log('Email:', emailInput.value);
        console.log('Message:', messageInput.value);

        successMsg.style.display = 'block';
        form.reset();

        successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });

        setTimeout(function() {
            successMsg.style.display = 'none';
        }, 5000);
    }
});

function showError(field, message) {
    const errorElement = document.getElementById(field + '-error');
    const inputElement = document.getElementById(field);
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    inputElement.classList.add('input-error');
}

function clearErrors() {
    const errors = document.querySelectorAll('.error-msg');
    for (let i = 0; i < errors.length; i++) {
        errors[i].textContent = '';
        errors[i].style.display = 'none';
    }

    const inputs = document.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.classList.remove('input-error');
    });
}

function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

nameInput.addEventListener('input', function() {
    if (nameInput.value.trim() !== '') {
        document.getElementById('name-error').style.display = 'none';
        nameInput.classList.remove('input-error');
    }
});

emailInput.addEventListener('input', function() {
    if (emailInput.value.trim() !== '') {
        document.getElementById('email-error').style.display = 'none';
        emailInput.classList.remove('input-error');
    }
});

messageInput.addEventListener('input', function() {
    if (messageInput.value.trim() !== '') {
        document.getElementById('message-error').style.display = 'none';
        messageInput.classList.remove('input-error');
    }
});
