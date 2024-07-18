import React, { useState } from 'react';

const Contact: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});

  const validate = () => {
    const newErrors: { name?: string; email?: string; message?: string } = {};
    if (!name) newErrors.name = 'Name is required';
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!message) newErrors.message = 'Message is required';
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formErrors = validate();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      // Handle form submission
      console.log({ name, email, message });
      // Reset form
      setName('');
      setEmail('');
      setMessage('');
      setErrors({});
    }
  };

  return (
    <div className="contact-container">
      <div className="brand-logo"></div>
      <div className="brand-title">CONTACT US</div>
      <form onSubmit={handleSubmit} className="contact-form">
        <div className="inputs">
          <label htmlFor="name">NAME</label>
          <input
            type="text"
            id="name"
            value={name}
            placeholder="Your Name"
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <p className="error">{errors.name}</p>}
          <label htmlFor="email">EMAIL</label>
          <input
            type="email"
            id="email"
            value={email}
            placeholder="example@test.com"
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p className="error">{errors.email}</p>}
          <label htmlFor="message">MESSAGE</label>
          <textarea
            id="message"
            value={message}
            placeholder="Your Message"
            onChange={(e) => setMessage(e.target.value)}
          />
          {errors.message && <p className="error">{errors.message}</p>}
          <button type="submit">SUBMIT</button>
        </div>
      </form>
    </div>
  );
};

export default Contact;
