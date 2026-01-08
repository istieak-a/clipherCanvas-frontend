import { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError('');

    // Simulate sending (replace with actual API call)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSent(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch {
      setError('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const contactInfo = [
    {
      icon: '📧',
      title: 'Email',
      value: 'support@Whispher Pattern.art',
      description: 'We typically respond within 24 hours'
    },
    {
      icon: '💬',
      title: 'Social',
      value: '@Whispher Pattern',
      description: 'Follow us for updates and inspiration'
    },
    {
      icon: '📍',
      title: 'Location',
      value: 'Global',
      description: 'Available worldwide, 24/7'
    }
  ];

  const faqs = [
    {
      question: 'How secure is Whispher Pattern?',
      answer: 'We use AES-256 encryption, the same standard used by banks and governments. Your messages are encrypted on your device before being stored.'
    },
    {
      question: 'Can you recover my secret key?',
      answer: 'No. We never store your secret keys. If you lose your key, the message cannot be recovered—this is a feature, not a bug.'
    },
    {
      question: 'Is Whispher Pattern free to use?',
      answer: 'Yes! Creating and sharing encrypted art is completely free. We may introduce premium features in the future.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-linear-to-br from-[#0084D1] to-[#0070B8] text-white">
        <div className="max-w-5xl mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Have questions, feedback, or just want to say hi? We&apos;d love to hear from you.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Cards */}
      <div className="max-w-5xl mx-auto px-4 -mt-10">
        <div className="grid md:grid-cols-3 gap-6">
          {contactInfo.map((info, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center hover:shadow-xl transition-shadow"
            >
              <span className="text-4xl">{info.icon}</span>
              <h3 className="font-semibold text-gray-900 mt-3">{info.title}</h3>
              <p className="text-[#0084D1] font-medium mt-1">{info.value}</p>
              <p className="text-sm text-gray-500 mt-1">{info.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send a Message</h2>
            
            {sent ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">✓</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-600 mb-6">We&apos;ll get back to you as soon as possible.</p>
                <button
                  onClick={() => setSent(false)}
                  className="text-[#0084D1] font-medium hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0084D1] focus:border-transparent transition-all outline-none"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0084D1] focus:border-transparent transition-all outline-none"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0084D1] focus:border-transparent transition-all outline-none"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0084D1] focus:border-transparent transition-all outline-none resize-none"
                    placeholder="Tell us more..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-3 bg-[#0084D1] text-white rounded-xl font-medium hover:bg-[#0070B8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {sending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <span>Send Message</span>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                >
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>

            {/* Additional Help */}
            <div className="mt-8 p-6 bg-gray-100 rounded-2xl">
              <div className="flex items-start gap-4">
                <span className="text-3xl">💡</span>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Need more help?</h3>
                  <p className="text-sm text-gray-600">
                    Check out our documentation and guides for detailed information 
                    on how to use Whispher Pattern.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
