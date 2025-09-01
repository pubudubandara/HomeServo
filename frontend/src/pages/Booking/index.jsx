import React, { useState, useEffect } from 'react';  
import { useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Book.css';

const BookingForm = () => {
    const { serviceId } = useParams(); // Get service ID from URL
    const location = useLocation();
    const { user } = useAuth(); // Get current user from auth context
    const serviceData = location.state?.service; // Get service data passed via navigation
    
    const [formData, setFormData] = useState({
        phone: '',
        description: '',
        date: '',
        location: '',
        serviceCategory: '',
        terms: false
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');
    const [selectedService, setSelectedService] = useState(serviceData || null);

    // If service ID is provided but no service data, fetch service details
    useEffect(() => {
        if (serviceId && !selectedService) {
            // Fetch service details from backend
            const fetchServiceDetails = async () => {
                try {
                    const response = await fetch(`http://localhost:5001/api/services/profile/${serviceId}`);
                    if (response.ok) {
                        const serviceData = await response.json();
                        setSelectedService(serviceData.data || serviceData);
                    } else {
                        console.log('Service not found, using serviceId only');
                        setSelectedService({ id: serviceId });
                    }
                } catch (error) {
                    console.error('Error fetching service details:', error);
                    setSelectedService({ id: serviceId });
                }
            };
            
            fetchServiceDetails();
        }
    }, [serviceId, selectedService]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage('');

        try {
            const bookingData = {
                customerPhone: formData.phone,
                serviceDescription: formData.description,
                serviceLocation: formData.location,
                preferredDate: formData.date,
                customerNotes: '', // Optional field
                serviceId: serviceId || selectedService?.id || null, // Include service ID
                userId: user?._id || user?.id || null // Include user ID if logged in
            };

            console.log('Submitting booking data:', bookingData);

            const response = await fetch('http://localhost:5001/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingData)
            });

            console.log('Response status:', response.status);
            const result = await response.json();
            console.log('Response data:', result);

            if (response.ok) {
                setSubmitMessage('Booking submitted successfully! We will contact you soon.');
                setFormData({
                    phone: '',
                    description: '',
                    date: '',
                    location: '',
                    serviceCategory: '',
                    terms: false
                });
            } else {
                setSubmitMessage(`Error: ${result.message || 'Failed to submit booking'}`);
            }
        } catch (error) {
            console.error('Error submitting booking:', error);
            setSubmitMessage('Failed to submit booking. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (  
        <section className="booking-section">  
            <div className="booking-container">
                <div className="booking-header">
                    <h1>Book Your <span>Service</span></h1>
                    {selectedService && selectedService.name && (
                        <div className="selected-service">
                            <p>Selected Service: <strong>{selectedService.name}</strong></p>
                            {selectedService.price && <p>Price: <strong>{selectedService.price}</strong></p>}
                        </div>
                    )}
                    <p>Get connected with skilled professionals for your needs</p>
                </div>
                
                <div className="form-container">  
                    <form id="bookingForm" onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="phone">Phone Number</label>  
                                <input 
                                    type="tel" 
                                    id="phone" 
                                    name="phone" 
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="+1 (555) 123-4567" 
                                    required 
                                />
                            </div>

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
                        </div>

                        {!selectedService && (
                            <div className="form-group">
                                <label htmlFor="serviceCategory">Service Category</label>
                                <select 
                                    id="serviceCategory" 
                                    name="serviceCategory"
                                    value={formData.serviceCategory || ''}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select a service category</option>
                                    <option value="Assembly">Assembly</option>
                                    <option value="Mounting">Mounting</option>
                                    <option value="Moving">Moving</option>
                                    <option value="Cleaning">Cleaning</option>
                                    <option value="Outdoor Help">Outdoor Help</option>
                                    <option value="Home Repairs">Home Repairs</option>
                                    <option value="Painting">Painting</option>
                                </select>
                            </div>
                        )}

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

                        {submitMessage && (
                            <div className={`submit-message ${submitMessage.includes('Error') ? 'error' : 'success'}`}>
                                {submitMessage}
                            </div>
                        )}

                        <button type="submit" className="book-btn" disabled={isSubmitting}>
                            <i className="fas fa-calendar-check"></i>
                            {isSubmitting ? 'Submitting...' : 'Book Service Now'}
                        </button>  
                    </form>  
                </div>
            </div>
        </section>  
    );  
};

export default BookingForm;
