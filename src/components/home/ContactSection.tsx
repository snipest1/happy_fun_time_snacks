import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send, User, Briefcase } from 'lucide-react';

interface FormData {
    name: string;
    company: string;
    email: string;
    phone: string;
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

const ContactSection: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        company: '',
        email: '',
        phone: '',
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
        <section id="contact" className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Get in Touch</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Have questions about our vending solutions? Contact us today to learn more about how we can provide the perfect vending solution for your needs.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {/* Contact Info */}
                    <div className="bg-blue-800 text-white p-8 rounded-xl shadow-xl">
                        <h3 className="text-2xl font-semibold mb-6">Contact Information</h3>
                        <div className="space-y-6">
                            <div className="flex items-start">
                                <div className="bg-blue-700 p-3 rounded-full mr-4">
                                    <MapPin className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-lg">Our Location</h4>
                                    <p className="text-blue-100">123 Vending Way, Suite 456</p>
                                    <p className="text-blue-100">Business District, NY 10001</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="bg-blue-700 p-3 rounded-full mr-4">
                                    <Phone className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-lg">Phone</h4>
                                    <p className="text-blue-100">+1 (555) 123-4567</p>
                                    <p className="text-blue-100">Mon-Fri, 9am-5pm EST</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="bg-blue-700 p-3 rounded-full mr-4">
                                    <Mail className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-lg">Email</h4>
                                    <p className="text-blue-100">info@vendtech.com</p>
                                    <p className="text-blue-100">support@vendtech.com</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10">
                            <h4 className="font-medium text-lg mb-4">Business Hours</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between"><span>Monday - Friday</span><span>9:00 AM - 5:00 PM</span></div>
                                <div className="flex justify-between"><span>Saturday</span><span>10:00 AM - 2:00 PM</span></div>
                                <div className="flex justify-between"><span>Sunday</span><span>Closed</span></div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white p-8 rounded-xl shadow-xl border border-gray-100">
                        {isSubmitted ? (
                            <div className="text-center py-10">
                                <div className="inline-flex items-center justify-center p-4 bg-green-100 text-green-600 rounded-full mb-4">
                                    <Send className="h-10 w-10" />
                                </div>
                                <h3 className="text-2xl font-semibold mb-2">Message Sent!</h3>
                                <p className="text-gray-600">Thank you for contacting us. Our team will get back to you within 24 hours.</p>
                                <button
                                    className="mt-6 bg-blue-800 hover:bg-blue-900 text-white px-6 py-3 rounded-lg transition-colors"
                                    onClick={() => setIsSubmitted(false)}
                                >
                                    Send Another Message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Send a Message</h3>

                                {error && (
                                    <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                                        {error}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 mb-2" htmlFor="name">Your Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="John Smith"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 mb-2" htmlFor="company">Company Name</label>
                                        <div className="relative">
                                            <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                            <input
                                                type="text"
                                                id="company"
                                                name="company"
                                                value={formData.company}
                                                onChange={handleChange}
                                                className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Company Inc."
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 mb-2" htmlFor="email">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="yourname@company.com"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 mb-2" htmlFor="phone">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="(555) 123-4567"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-2" htmlFor="interest">What are you interested in?</label>
                                    <select
                                        id="interest"
                                        name="interest"
                                        value={formData.interest}
                                        onChange={handleChange}
                                        className="px-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                        required
                                    >
                                        <option value="" disabled>Select an option</option>
                                        {interestOptions.map((option, index) => (
                                            <option key={index} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-2" htmlFor="message">Your Message</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={4}
                                        className="px-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Tell us about your requirements..."
                                        required
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-lg transition-colors w-full flex items-center justify-center"
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
