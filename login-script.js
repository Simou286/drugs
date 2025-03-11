document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const togglePassword = document.getElementById('togglePassword');
    
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
        } else if (passwordInput.value.length < 6) {
            passwordError.textContent = 'Password must be at least 6 characters';
            isValid = false;
        }
        
        // If form is valid, submit it
        if (isValid) {
            // Here you would typically send the data to your server
            // For demonstration, we'll just show a success message
            simulateLogin();
        }
    });
    
    // Email validation helper
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Simulate login process
    function simulateLogin() {
        const loginButton = document.querySelector('.login-button');
        const originalText = loginButton.textContent;
        
        // Show loading state
        loginButton.disabled = true;
        loginButton.textContent = 'Logging in...';
        
        // Simulate API call
        setTimeout(function() {
            // For demo purposes, we'll accept any credentials
            // In a real application, this would validate against a server
            
            // Success - redirect to dashboard
            alert('Login successful! Redirecting to dashboard...');
            window.location.href = 'dashboard.html';
            
        }, 1500);
    }
    
    // Social login buttons
    const socialButtons = document.querySelectorAll('.social-button');
    
    socialButtons.forEach(button => {
        button.addEventListener('click', function() {
            const provider = this.classList.contains('google') ? 'Google' : 'Facebook';
            alert(`${provider} login is not implemented in this demo. Redirecting to dashboard for demo purposes.`);
            
            // For demo purposes, redirect to dashboard
            setTimeout(function() {
                window.location.href = 'dashboard.html';
            }, 1000);
        });
    });
    
    // Remember user's email if they've logged in before
    const savedEmail = localStorage.getItem('userEmail');
    const rememberMeCheckbox = document.getElementById('rememberMe');
    
    if (savedEmail) {
        emailInput.value = savedEmail;
        rememberMeCheckbox.checked = true;
    }
    
    // Save email if remember me is checked
    loginForm.addEventListener('submit', function() {
        if (rememberMeCheckbox.checked) {
            localStorage.setItem('userEmail', emailInput.value);
        } else {
            localStorage.removeItem('userEmail');
        }
    });
});
