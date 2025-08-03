import React, { useState } from 'react';  
import './Book.css';

const BookingForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        description: '',
        date: '',
        location: '',
        terms: false
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission here
        console.log('Form submitted:', formData);
    };

    return (  
        <section className="booking-section">  
            <div className="booking-container">
                <div className="booking-header">
                    <h1>Book Your <span>Service</span></h1>
                    <p>Get connected with skilled professionals for your needs</p>
                </div>
                
                <div className="form-container">  
                    <form id="bookingForm" onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="name">Full Name</label>  
                                <input 
                                    type="text" 
                                    id="name" 
                                    name="name" 
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter your full name" 
                                    required 
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>  
                                <input 
                                    type="email" 
                                    id="email" 
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="yourname@example.com" 
                                    required 
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Service Description</label>  
                            <textarea 
                                id="description" 
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Please describe what you need help with..."
                                rows="4"
                                required
                            ></textarea>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="date">Preferred Date</label>  
                                <input 
                                    type="date" 
                                    id="date" 
                                    name="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    required 
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="location">Service Location</label>  
                                <input 
                                    type="text" 
                                    id="location" 
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    placeholder="Enter the service address" 
                                    required 
                                />
                            </div>
                        </div>

                        <div className="terms-container">  
                            <input 
                                type="checkbox" 
                                id="terms" 
                                name="terms"
                                checked={formData.terms}
                                onChange={handleInputChange}
                                required 
                            />  
                            <label htmlFor="terms">
                                I agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>
                            </label>  
                        </div>  

                        <button type="submit" className="book-btn">
                            <i className="fas fa-calendar-check"></i>
                            Book Service Now
                        </button>  
                    </form>  
                </div>
            </div>
        </section>  
    );  
};

export default BookingForm;
