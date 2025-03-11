document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const togglePassword = document.getElementById('togglePassword');
    const rememberMeCheckbox = document.getElementById('rememberMe');
    
    // Toggle password visibility
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Toggle eye icon
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });
    
    // Form validation
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        
        // Reset error messages
        emailError.textContent = '';
        passwordError.textContent = '';
        
        // Validate email
        if (!emailInput.value) {
            emailError.textContent = 'Email is required';
            isValid = false;
        } else if (!isValidEmail(emailInput.value)) {
            emailError.textContent = 'Please enter a valid email address';
            isValid = false;
        }
        
        // Validate password
        if (!passwordInput.value) {
            passwordError.textContent = 'Password is required';
            isValid = false;
        }
        
        // If form is valid, submit it
        if (isValid) {
            loginUser();
        }
    });
    
    // Email validation helper
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Login user with API
    function loginUser() {
        const loginButton = document.querySelector('.login-button');
        const originalText = loginButton.textContent;
        
        // Show loading state
        loginButton.disabled = true;
        loginButton.textContent = 'Logging in...';
        
        // Prepare login data
        const loginData = {
            email: emailInput.value.trim(),
            password: passwordInput.value
        };
        
        // Send login request to server
        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.error || 'Login failed');
                });
            }
            return response.json();
        })
        .then(user => {
            // Save email if remember me is checked
            if (rememberMeCheckbox.checked) {
                localStorage.setItem('userEmail', emailInput.value);
            } else {
                localStorage.removeItem('userEmail');
            }
            
            // Success - redirect to dashboard
            window.location.href = 'dashboard.html';
        })
        .catch(error => {
            // Show error message
            alert(error.message);
            
            // Reset button
            loginButton.disabled = false;
            loginButton.textContent = originalText;
        });
    }
    
    // Social login buttons
    const socialButtons = document.querySelectorAll('.social-button');
    
    socialButtons.forEach(button => {
        button.addEventListener('click', function() {
            const provider = this.classList.contains('google') ? 'Google' : 'Facebook';
            alert(`${provider} login is not implemented in this demo.`);
        });
    });
    
    // Remember user's email if they've logged in before
    const savedEmail = localStorage.getItem('userEmail');
    
    if (savedEmail && emailInput) {
        emailInput.value = savedEmail;
        if (rememberMeCheckbox) {
            rememberMeCheckbox.checked = true;
        }
    }
});
