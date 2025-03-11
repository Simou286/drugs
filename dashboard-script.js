document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    fetch('/api/user')
        .then(response => {
            if (!response.ok) {
                throw new Error('Not authenticated');
            }
            return response.json();
        })
        .then(user => {
            // Update user info in UI
            const userNameElement = document.querySelector('.user-name');
            if (userNameElement) {
                userNameElement.textContent = `${user.firstName} ${user.lastName}`;
            }
            
            // Load medications
            loadMedications();
        })
        .catch(error => {
            // Redirect to login if not authenticated
            window.location.href = 'login.html';
        });
    
    // Toggle sidebar on mobile
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
    
    // Modal functionality
    const addMedicationBtn = document.getElementById('addMedicationBtn');
    const addMedicationModal = document.getElementById('addMedicationModal');
    const closeModalBtn = document.querySelector('.close-modal');
    const cancelModalBtn = document.querySelector('.cancel-modal');
    
    // Open modal
    if (addMedicationBtn && addMedicationModal) {
        addMedicationBtn.addEventListener('click', function() {
            addMedicationModal.classList.add('active');
        });
    }
    
    // Close modal functions
    function closeModal() {
        if (addMedicationModal) {
            addMedicationModal.classList.remove('active');
            // Reset form
            document.getElementById('addMedicationForm').reset();
        }
    }
    
    // Close modal with X button
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    // Close modal with Cancel button
    if (cancelModalBtn) {
        cancelModalBtn.addEventListener('click', closeModal);
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === addMedicationModal) {
            closeModal();
        }
    });
    
    // Add medication form submission
    const addMedicationForm = document.getElementById('addMedicationForm');
    
    if (addMedicationForm) {
        addMedicationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const medicationData = {
                name: document.getElementById('medicationName').value,
                dosage: document.getElementById('dosage').value,
                quantity: document.getElementById('quantity').value,
                expirationDate: document.getElementById('expirationDate').value,
                category: document.getElementById('category').value,
                notes: document.getElementById('notes').value
            };
            
            // Send data to server
            fetch('/api/medications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(medicationData)
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => {
                        throw new Error(data.error || 'Failed to add medication');
                    });
                }
                return response.json();
            })
            .then(medication => {
                // Add new medication to table
                addMedicationToTable(medication);
                
                // Close modal
                closeModal();
            })
            .catch(error => {
                alert(error.message);
            });
        });
    }
    
    // Load medications from server
    function loadMedications() {
        fetch('/api/medications')
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => {
                        throw new Error(data.error || 'Failed to load medications');
                    });
                }
                return response.json();
            })
            .then(medications => {
                // Clear existing table
                const tableBody = document.getElementById('medicationsTableBody');
                if (tableBody) {
                    tableBody.innerHTML = '';
                    
                    // Add medications to table
                    medications.forEach(medication => {
                        addMedicationToTable(medication, false);
                    });
                }
            })
            .catch(error => {
                console.error('Error loading medications:', error);
            });
    }
    
    // Function to add medication to table
    function addMedicationToTable(medication, prepend = true) {
        const tableBody = document.getElementById('medicationsTableBody');
        
        if (tableBody) {
            // Create new row
            const newRow = document.createElement('tr');
            
            // Determine badge class based on category
            let badgeClass = 'badge-other';
            
            switch(medication.category) {
                case 'Pain Relief':
                    badgeClass = 'badge-pain';
                    break;
                case 'Antibiotic':
                    badgeClass = 'badge-antibiotic';
                    break;
                case 'Allergy':
                    badgeClass = 'badge-allergy';
                    break;
                case 'Vitamin':
                    badgeClass = 'badge-vitamin';
                    break;
            }
            
            // Set row HTML
            newRow.innerHTML = `
                <td>${medication.name}</td>
                <td>${medication.dosage}</td>
                <td>${medication.quantity}</td>
                <td>${medication.expirationDate || 'N/A'}</td>
                <td><span class="badge ${badgeClass}">${medication.category}</span></td>
                <td>
                    <button class="btn-icon btn-edit" data-id="${medication.id}"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon btn-delete" data-id="${medication.id}"><i class="fas fa-trash"></i></button>
                </td>
            `;
            
            // Add event listeners to new buttons
            const deleteBtn = newRow.querySelector('.btn-delete');
            
            deleteBtn.addEventListener('click', function() {
                const medicationId = this.getAttribute('data-id');
                const medicationName = newRow.cells[0].textContent;
                
                if (confirm(`Are you sure you want to delete ${medicationName}?`)) {
                    deleteMedication(medicationId, newRow);
                }
            });
            
            // Add row to table
            if (prepend) {
                tableBody.prepend(newRow);
            } else {
                tableBody.appendChild(newRow);
            }
        }
    }
    
    // Delete medication
    function deleteMedication(medicationId, row) {
        fetch(`/api/medications/${medicationId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.error || 'Failed to delete medication');
                });
            }
            return response.json();
        })
        .then(() => {
            // Remove row from table
            row.remove();
        })
        .catch(error => {
            alert(error.message);
        });
    }
    
    // Logout functionality
    const logoutBtn = document.querySelector('.logout-btn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            fetch('/api/logout')
                .then(() => {
                    window.location.href = 'login.html';
                })
                .catch(error => {
                    console.error('Logout error:', error);
                    window.location.href = 'login.html';
                });
        });
    }
    
    // Search functionality
    const searchInput = document.querySelector('.search-bar input');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const rows = document.querySelectorAll('#medicationsTableBody tr');
            
            rows.forEach(row => {
                const medicationName = row.cells[0].textContent.toLowerCase();
                const category = row.cells[4].textContent.toLowerCase();
                
                if (medicationName.includes(searchTerm) || category.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
});
