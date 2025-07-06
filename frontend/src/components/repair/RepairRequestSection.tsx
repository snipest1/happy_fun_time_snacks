import { useState } from 'react';

export default function RepairRequestSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    business: '',
    zip: '',
    issue: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Repair request submitted:', formData);
    // TODO: Replace with actual API call to Supabase, Mailgun, etc.
  };

  return (
    <section className="bg-white py-12 px-4 sm:px-8 lg:px-16">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Need a Vending Machine Fixed?</h2>
        <p className="text-gray-600 mb-8">
          We connect you with trusted local vending machine technicians — fast fixes, all machine types, and veteran-owned professionalism.
        </p>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="border p-3 rounded-md w-full"
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="border p-3 rounded-md w-full"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="border p-3 rounded-md w-full"
          />
          <input
            type="text"
            name="business"
            placeholder="Business Name"
            value={formData.business}
            onChange={handleChange}
            className="border p-3 rounded-md w-full"
          />
          <input
            type="text"
            name="zip"
            placeholder="Zip Code / City"
            value={formData.zip}
            onChange={handleChange}
            className="border p-3 rounded-md w-full"
          />
          <textarea
            name="issue"
            placeholder="Describe the problem..."
            value={formData.issue}
            onChange={handleChange}
            rows={4}
            className="border p-3 rounded-md w-full sm:col-span-2"
          />
          <button
            type="submit"
            className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 sm:col-span-2"
          >
            Submit Repair Request
          </button>
        </form>
      </div>
    </section>
  );
}

