document.addEventListener('DOMContentLoaded', function() {
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
            const medicationName = document.getElementById('medicationName').value;
            const dosage = document.getElementById('dosage').value;
            const quantity = document.getElementById('quantity').value;
            const expirationDate = document.getElementById('expirationDate').value;
            const category = document.getElementById('category').value;
            
            // Add new medication to table
            addMedicationToTable(medicationName, dosage, quantity, expirationDate, category);
            
            // Close modal
            closeModal();
        });
    }
    
    // Function to add medication to table
    function addMedicationToTable(name, dosage, quantity, expiration, category) {
        const tableBody = document.getElementById('medicationsTableBody');
        
        if (tableBody) {
            // Create new row
            const newRow = document.createElement('tr');
            
            // Determine badge class based on category
            let badgeClass = 'badge-other';
            
            switch(category) {
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
                <td>${name}</td>
                <td>${dosage}</td>
                <td>${quantity}</td>
                <td>${expiration}</td>
                <td><span class="badge ${badgeClass}">${category}</span></td>
                <td>
                    <button class="btn-icon btn-edit"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon btn-delete"><i class="fas fa-trash"></i></button>
                </td>
            `;
            
            // Add event listeners to new buttons
            const editBtn = newRow.querySelector('.btn-edit');
            const deleteBtn = newRow.querySelector('.btn-delete');
            
            editBtn.addEventListener('click', function() {
                alert(`Edit functionality for ${name} would go here`);
            });
            
            deleteBtn.addEventListener('click', function() {
                if (confirm(`Are you sure you want to delete ${name}?`)) {
                    newRow.remove();
                }
            });
            
            // Add row to table
            tableBody.prepend(newRow);
        }
    }
    
    // Add event listeners to existing edit and delete buttons
    const editButtons = document.querySelectorAll('.btn-edit');
    const deleteButtons = document.querySelectorAll('.btn-delete');
    
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const medicationName = row.cells[0].textContent;
            alert(`Edit functionality for ${medicationName} would go here`);
        });
    });
    
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const medicationName = row.cells[0].textContent;
            
            if (confirm(`Are you sure you want to delete ${medicationName}?`)) {
                row.remove();
            }
        });
    });
    
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
