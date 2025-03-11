document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const registerForm = document.getElementById('registerForm');
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const termsCheckbox = document.getElementById('termsAgree');
    
    // Error elements
    const firstNameError = document.getElementById('firstNameError');
    const lastNameError = document.getElementById('lastNameError');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');
    const termsError = document.getElementById('termsError');
    
    // Password strength elements
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');
    
    // Toggle password visibility
    const togglePassword = document.getElementById('togglePassword');
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Toggle eye icon
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });
    
    // Password strength checker
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        const strength = checkPasswordStrength(password);
        
        // Update strength bar
        strengthBar.style.width = strength.percentage + '%';
        strengthBar.style.backgroundColor = strength.color;
        
        // Update strength text
        strengthText.textContent = strength.text;
        strengthText.style.color = strength.color;
    });
    
    // Form validation
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        
        // Reset error messages
        firstNameError.textContent = '';
        lastNameError.textContent = '';
        emailError.textContent = '';
        passwordError.textContent = '';
        confirmPasswordError.textContent = '';
        termsError.textContent = '';
        
        // Validate first name
        if (!firstNameInput.value.trim()) {
            firstNameError.textContent = 'First name is required';
            isValid = false;
        }
        
        // Validate last name
        if (!lastNameInput.value.trim()) {
            lastNameError.textContent = 'Last name is required';
            isValid = false;
        }
        
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
        } else if (passwordInput.value.length < 8) {
            passwordError.textContent = 'Password must be at least 8 characters';
            isValid = false;
        }
        
        // Validate confirm password
        if (!confirmPasswordInput.value) {
            confirmPasswordError.textContent = 'Please confirm your password';
            isValid = false;
        } else if (confirmPasswordInput.value !== passwordInput.value) {
            confirmPasswordError.textContent = 'Passwords do not match';
            isValid = false;
        }
        
        // Validate terms agreement
        if (!termsCheckbox.checked) {
            termsError.textContent = 'You must agree to the terms';
            isValid = false;
        }
        
        // If form is valid, submit it
        if (isValid) {
            // Here you would typically send the data to your server
            // For demonstration, we'll just show a success message
            simulateRegistration();
        }
    });
    
    // Email validation helper
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Password strength checker
    function checkPasswordStrength(password) {
        // Default values
        let strength = {
            percentage: 0,
            color: '#e5e7eb',
            text: 'Password strength'
        };
        
        if (!password) {
            return strength;
        }
        
        let score = 0;
        
        // Length check
        if (password.length >= 8) score += 25;
        
        // Complexity checks
        if (/[A-Z]/.test(password)) score += 25; // Has uppercase
        if (/[a-z]/.test(password)) score += 25; // Has lowercase
        if (/[0-9]/.test(password)) score += 25; // Has number
        if (/[^A-Za-z0-9]/.test(password)) score += 25; // Has special char
        
        // Cap at 100%
        score = Math.min(score, 100);
        
        // Set color and text based on score
        if (score >= 100) {
            strength.color = '#10b981'; // Strong - green
            strength.text = 'Strong password';
        } else if (score >= 50) {
            strength.color = '#f59e0b'; // Medium - yellow/orange
            strength.text = 'Medium strength';
        } else if (score > 0) {
            strength.color = '#ef4444'; // Weak - red
            strength.text = 'Weak password';
        }
        
        strength.percentage = score;
        
        return strength;
    }
    
    // Simulate registration process
    function simulateRegistration() {
        const registerButton = document.querySelector('.login-button');
        const originalText = registerButton.textContent;
        
        // Show loading state
        registerButton.disabled = true;
        registerButton.textContent = 'Creating account...';
        
        // Simulate API call
        setTimeout(function() {
            // Success - show message and redirect
            alert('Account created successfully! You can now login.');
            window.location.href = 'login.html';
        }, 1500);
    }
    
    // Social registration buttons
    const socialButtons = document.querySelectorAll('.social-button');
    
    socialButtons.forEach(button => {
        button.addEventListener('click', function() {
            const provider = this.classList.contains('google') ? 'Google' : 'Facebook';
            alert(`${provider} registration is not implemented in this demo.`);
        });
    });
});

    // Simulate registration process
    function simulateRegistration() {
        const registerButton = document.querySelector('.login-button');
        const originalText = registerButton.textContent;
        
        // Show loading state
        registerButton.disabled = true;
        registerButton.textContent = 'Creating account...';
        
        // Simulate API call
        setTimeout(function() {
            // Success - show message and redirect
            alert('Account created successfully! Redirecting to dashboard...');
            
            // In a real application, you might want to redirect to login page first
            // But for demo purposes, we'll go straight to dashboard
            window.location.href = 'dashboard.html';
        }, 1500);
    }
