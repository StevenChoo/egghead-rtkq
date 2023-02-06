import { useState } from "react";
import * as api from "../../api";

export function ContactPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    setIsLoading(true);
    try {
      await api.makeContact(Object.fromEntries(formData) as any);
      setIsSuccess(true);
      form.reset();
      // Reset success message after a few seconds
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const disabled = isLoading || isSuccess;
  return (
    <div className="page">
      <h1>Contact</h1>
      <p className={`alert ${isSuccess ? "show" : ""}`}>
        <b>Message sent</b>
      </p>
      <p>
        Please send us a detailed message if you&apos;d like to get in touch to
        ask questions about any of our dog grooming services, or anything at
        all.
      </p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          disabled={disabled}
          required
          id="email"
          type="email"
          name="email"
          placeholder="youremail@youremail.com"
        />
        <label htmlFor="message">Message:</label>
        <textarea
          disabled={disabled}
          required
          id="message"
          name="message"
          rows={5}
          placeholder="Please let us know what you want answered and we will try to help"
        />
        <div>
          <button disabled={disabled} type="submit">
            Contact
          </button>
        </div>
      </form>
    </div>
  );
}
