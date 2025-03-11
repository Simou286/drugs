// Database utility for user authentication
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

// Create database connection
const dbPath = path.join(__dirname, 'users.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to the users database.');
        // Create users table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            firstName TEXT NOT NULL,
            lastName TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                console.error('Error creating users table:', err.message);
            } else {
                console.log('Users table ready');
            }
        });
        
        // Create medications table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS medications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            dosage TEXT NOT NULL,
            quantity TEXT NOT NULL,
            expiration_date TEXT,
            category TEXT,
            notes TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )`, (err) => {
            if (err) {
                console.error('Error creating medications table:', err.message);
            } else {
                console.log('Medications table ready');
            }
        });
    }
});

// User registration
function registerUser(userData) {
    return new Promise((resolve, reject) => {
        // Check if user already exists
        db.get('SELECT * FROM users WHERE email = ?', [userData.email], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            
            if (row) {
                reject(new Error('User with this email already exists'));
                return;
            }
            
            // Hash the password
            bcrypt.hash(userData.password, 10, (err, hashedPassword) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                // Insert new user
                const stmt = db.prepare(`
                    INSERT INTO users (firstName, lastName, email, password)
                    VALUES (?, ?, ?, ?)
                `);
                
                stmt.run(
                    userData.firstName,
                    userData.lastName,
                    userData.email,
                    hashedPassword,
                    function(err) {
                        if (err) {
                            reject(err);
                            return;
                        }
                        
                        resolve({
                            id: this.lastID,
                            firstName: userData.firstName,
                            lastName: userData.lastName,
                            email: userData.email
                        });
                    }
                );
                
                stmt.finalize();
            });
        });
    });
}

// User login
function loginUser(email, password) {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
            if (err) {
                reject(err);
                return;
            }
            
            if (!user) {
                reject(new Error('User not found'));
                return;
            }
            
            // Compare password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                if (!isMatch) {
                    reject(new Error('Invalid password'));
                    return;
                }
                
                // Return user without password
                const { password, ...userWithoutPassword } = user;
                resolve(userWithoutPassword);
            });
        });
    });
}

// Get medications for a user
function getUserMedications(userId) {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM medications WHERE user_id = ? ORDER BY created_at DESC', [userId], (err, medications) => {
            if (err) {
                reject(err);
                return;
            }
            
            resolve(medications);
        });
    });
}

// Add a new medication
function addMedication(medicationData) {
    return new Promise((resolve, reject) => {
        const stmt = db.prepare(`
            INSERT INTO medications (user_id, name, dosage, quantity, expiration_date, category, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        
        stmt.run(
            medicationData.userId,
            medicationData.name,
            medicationData.dosage,
            medicationData.quantity,
            medicationData.expirationDate,
            medicationData.category,
            medicationData.notes,
            function(err) {
                if (err) {
                    reject(err);
                    return;
                }
                
                resolve({
                    id: this.lastID,
                    ...medicationData
                });
            }
        );
        
        stmt.finalize();
    });
}

// Delete a medication
function deleteMedication(medicationId, userId) {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM medications WHERE id = ? AND user_id = ?', [medicationId, userId], function(err) {
            if (err) {
                reject(err);
                return;
            }
            
            if (this.changes === 0) {
                reject(new Error('Medication not found or not authorized'));
                return;
            }
            
            resolve({ id: medicationId });
        });
    });
}

module.exports = {
    db,
    registerUser,
    loginUser,
    getUserMedications,
    addMedication,
    deleteMedication
};
