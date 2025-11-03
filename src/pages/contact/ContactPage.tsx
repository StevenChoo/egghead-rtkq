import { useState } from "react";
import { useMakeContactMutation } from "../../store/apiSlice";

export function ContactPage() {
  const [makeContact, { isLoading, isSuccess }] = useMakeContactMutation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await makeContact(formData).unwrap();
      // Reset form on success
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="page">
      <h1>Contact Us</h1>
      {isSuccess ? (
        <div className="successMessage">
          <p>Thank you for your message! We&apos;ll get back to you soon.</p>
          <button
            className="btn"
            onClick={() => window.location.reload()}
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={formData.message}
            onChange={handleChange}
            required
          />

          <button type="submit" className="btn" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send Message"}
          </button>
        </form>
      )}
    </div>
  );
}
