                            // Add some demo medications
                            const demoMedications = [
                                {
                                    name: 'Ibuprofen',
                                    dosage: '200mg',
                                    quantity: '30 tablets',
                                    expiration_date: '2024-12-31',
                                    category: 'Pain Relief',
                                    notes: 'Take with food as needed for pain or fever.'
                                },
                                {
                                    name: 'Amoxicillin',
                                    dosage: '500mg',
                                    quantity: '21 capsules',
                                    expiration_date: '2023-10-15',
                                    category: 'Antibiotic',
                                    notes: 'Take 3 times daily until completed.'
                                },
                                {
                                    name: 'Cetirizine',
                                    dosage: '10mg',
                                    quantity: '30 tablets',
                                    expiration_date: '2025-05-20',
                                    category: 'Allergy',
                                    notes: 'Take once daily for allergies.'
                                },
                                {
                                    name: 'Vitamin D3',
                                    dosage: '1000 IU',
                                    quantity: '90 softgels',
                                    expiration_date: '2025-08-10',
                                    category: 'Vitamin',
                                    notes: 'Take daily with food.'
                                }
                            ];
                            
                            // Insert demo medications
                            const insertMedication = db.prepare(`
                                INSERT INTO medications (user_id, name, dosage, quantity, expiration_date, category, notes)
                                VALUES (?, ?, ?, ?, ?, ?, ?)
                            `);
                            
                            demoMedications.forEach(med => {
                                insertMedication.run(
                                    userId,
                                    med.name,
                                    med.dosage,
                                    med.quantity,
                                    med.expiration_date,
                                    med.category,
                                    med.notes
                                );
                            });
                            
                            insertMedication.finalize();
                            console.log('Demo medications added.');
                            
                            console.log('Database initialization complete!');
                            console.log('Demo user credentials:');
                            console.log('Email: demo@example.com');
                            console.log('Password: password123');
                        });
                    });
                }
                else {
                    console.log('Users already exist in the database. Skipping demo data creation.');
                }
                
                // Close the database connection
                db.close((err) => {
                    if (err) {
                        console.error('Error closing database:', err.message);
                    } else {
                        console.log('Database connection closed.');
                    }
                });
            });
        });
    });
});
