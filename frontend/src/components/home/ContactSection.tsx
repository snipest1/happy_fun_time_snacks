import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send, User, Briefcase } from 'lucide-react';

interface FormData {
    name: string;
    company: string;
    email: string;
    phone: string;
    serviceType: string;
    locationSize: string;
    address: string;
    interest: string;
    message: string;
}

const interestOptions = [
    'New Machine Installation',
    'Machine Maintenance',
    'Product Restocking',
    'Business Partnership',
    'General Inquiry'
];

const serviceTypeOptions = [
    'Snack Vending',
    'Beverage Vending',
    'Office Coffee Service',
    'Mixed Refreshment Solution',
    'Other'
];

const locationSizeOptions = [
    'Small (1-50 people)',
    'Medium (50-200 people)',
    'Large (200-500 people)',
    'Enterprise (500+ people)'
];

const addressOptions = [
    'Douglas County',
    'Carroll County',
    'Paulding County',
    'Cobb County',
    'Haralson County',
    'Other'
];

const ContactSection: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        company: '',
        email: '',
        phone: '',
        serviceType: '',
        locationSize: '',
        address: '',
        interest: '',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch('/.netlify/functions/test-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!response.ok) {
                console.error("❌ Form submission failed:", result.error);
                throw new Error(result.error || 'Something went wrong');
            }

            console.log("✅ Form submission successful:", result);
            setIsSubmitted(true);
            setFormData({
                name: '',
                company: '',
                email: '',
                phone: '',
                serviceType: '',
                locationSize: '',
                address: '',
                interest: '',
                message: ''
            });
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Unknown error';
            console.error("❌ Error submitting form:", msg);
            setError(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="contact" className="py-20 bg-hfts-cream">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-display-lg text-hfts-navy mb-4">Get in Touch</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        Have questions about our vending solutions? Fill out the form below and our team will get back to you within 24 hours.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {/* Contact Info */}
                    <div className="bg-hfts-navy text-white p-8 rounded-xl shadow-xl">
                        <h3 className="text-2xl font-bold mb-8">Contact Information</h3>
                        <div className="space-y-8">
                            <div className="flex items-start">
                                <div className="bg-hfts-teal/20 p-3 rounded-full mr-4 flex-shrink-0">
                                    <MapPin className="h-6 w-6 text-hfts-teal" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg mb-1">Our Location</h4>
                                    <p className="text-gray-300">3088 Chapel Hill Rd. Douglasville, GA, 30135</p>
                                    <p className="text-gray-300">Villa Rica, GA 30180</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="bg-hfts-orange/20 p-3 rounded-full mr-4 flex-shrink-0">
                                    <Phone className="h-6 w-6 text-hfts-orange" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg mb-1">Phone</h4>
                                    <p className="text-gray-300">+1 (470) 206-5950</p>
                                    <p className="text-gray-400 text-sm">Mon-Fri, 9am-5pm EST</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="bg-hfts-coral/20 p-3 rounded-full mr-4 flex-shrink-0">
                                    <Mail className="h-6 w-6 text-hfts-coral" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg mb-1">Email</h4>
                                    <p className="text-gray-300">info@happyfuntimesnacks.com</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 pt-8 border-t border-hfts-navy/50">
                            <h4 className="font-bold text-lg mb-4">Service Areas</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
                                <div>• Douglas County</div>
                                <div>• Carroll County</div>
                                <div>• Paulding County</div>
                                <div>• Cobb County</div>
                                <div>• Haralson County</div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white p-8 rounded-xl shadow-xl border border-gray-200">
                        {isSubmitted ? (
                            <div className="text-center py-10">
                                <div className="inline-flex items-center justify-center p-4 bg-hfts-teal/10 text-hfts-teal rounded-full mb-4">
                                    <Send className="h-10 w-10" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2 text-hfts-navy">Message Sent!</h3>
                                <p className="text-gray-600 mb-6">Thank you for contacting us. Our team will get back to you within 24 hours.</p>
                                <button
                                    className="bg-hfts-orange hover:bg-hfts-coral text-white px-6 py-3 rounded-lg font-bold transition-colors"
                                    onClick={() => setIsSubmitted(false)}
                                >
                                    Send Another Message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <h3 className="text-2xl font-bold text-hfts-navy mb-6">Send a Message</h3>

                                {error && (
                                    <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
                                        {error}
                                    </div>
                                )}

                                {/* Name and Company */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-hfts-navy font-semibold mb-2" htmlFor="name">Your Name *</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hfts-teal"
                                                placeholder="John Smith"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-hfts-navy font-semibold mb-2" htmlFor="company">Company Name</label>
                                        <div className="relative">
                                            <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                            <input
                                                type="text"
                                                id="company"
                                                name="company"
                                                value={formData.company}
                                                onChange={handleChange}
                                                className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hfts-teal"
                                                placeholder="Company Inc."
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Email and Phone */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-hfts-navy font-semibold mb-2" htmlFor="email">Email Address *</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hfts-teal"
                                                placeholder="yourname@company.com"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-hfts-navy font-semibold mb-2" htmlFor="phone">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hfts-teal"
                                                placeholder="(555) 123-4567"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Service Type and Location Size */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-hfts-navy font-semibold mb-2" htmlFor="serviceType">Service Type</label>
                                        <select
                                            id="serviceType"
                                            name="serviceType"
                                            value={formData.serviceType}
                                            onChange={handleChange}
                                            className="px-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hfts-teal bg-white"
                                        >
                                            <option value="" disabled>Select a service</option>
                                            {serviceTypeOptions.map((option, index) => (
                                                <option key={index} value={option}>{option}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-hfts-navy font-semibold mb-2" htmlFor="locationSize">Location Size</label>
                                        <select
                                            id="locationSize"
                                            name="locationSize"
                                            value={formData.locationSize}
                                            onChange={handleChange}
                                            className="px-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hfts-teal bg-white"
                                        >
                                            <option value="" disabled>Select size</option>
                                            {locationSizeOptions.map((option, index) => (
                                                <option key={index} value={option}>{option}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Service Area */}
                                <div>
                                    <label className="block text-hfts-navy font-semibold mb-2" htmlFor="address">Service Area / County</label>
                                    <select
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="px-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hfts-teal bg-white"
                                    >
                                        <option value="" disabled>Select county</option>
                                        {addressOptions.map((option, index) => (
                                            <option key={index} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Interest */}
                                <div>
                                    <label className="block text-hfts-navy font-semibold mb-2" htmlFor="interest">What are you interested in? *</label>
                                    <select
                                        id="interest"
                                        name="interest"
                                        value={formData.interest}
                                        onChange={handleChange}
                                        className="px-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hfts-teal bg-white"
                                        required
                                    >
                                        <option value="" disabled>Select an option</option>
                                        {interestOptions.map((option, index) => (
                                            <option key={index} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Message */}
                                <div>
                                    <label className="block text-hfts-navy font-semibold mb-2" htmlFor="message">Your Message *</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={5}
                                        className="px-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hfts-teal"
                                        placeholder="Tell us about your requirements..."
                                        required
                                    ></textarea>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="bg-hfts-orange hover:bg-hfts-coral text-white px-8 py-4 rounded-lg font-bold text-lg w-full transition-colors flex items-center justify-center"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Sending Message...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="mr-2 h-5 w-5" />
                                            Send Message
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
