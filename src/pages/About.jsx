import { Link } from 'react-router-dom';

const About = () => {
  const features = [
    {
      icon: '🔐',
      title: 'AES-256 Encryption',
      description: 'Military-grade encryption protects your messages. Only those with the secret key can reveal what you\'ve hidden.',
    },
    {
      icon: '🎨',
      title: 'Generative Art',
      description: 'Each message transforms into a unique visual pattern based on the emotion you choose. No two artworks are alike.',
    },
    {
      icon: '💭',
      title: 'Emotional Expression',
      description: 'Choose from passion, calm, joy, mystery, nature, or serenity to influence the visual style of your encrypted art.',
    },
    {
      icon: '🔓',
      title: 'Interactive Unlocking',
      description: 'Share hints with friends and let them discover your hidden messages by guessing the secret key.',
    },
  ];

  const emotions = [
    { id: 'passion', icon: '❤️', label: 'Passion', color: '#FF1744' },
    { id: 'calm', icon: '🌊', label: 'Calm', color: '#0084D1' },
    { id: 'joy', icon: '🌟', label: 'Joy', color: '#FFD600' },
    { id: 'mystery', icon: '🔮', label: 'Mystery', color: '#7C4DFF' },
    { id: 'nature', icon: '🌿', label: 'Nature', color: '#00C853' },
    { id: 'serenity', icon: '☮️', label: 'Serenity', color: '#00BCD4' },
  ];

  const steps = [
    { step: 1, title: 'Write', description: 'Compose your secret message', icon: '✍️' },
    { step: 2, title: 'Feel', description: 'Choose an emotion', icon: '💫' },
    { step: 3, title: 'Lock', description: 'Set your secret key', icon: '🔑' },
    { step: 4, title: 'Share', description: 'Post your encrypted art', icon: '🚀' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-linear-to-br from-[#0084D1] to-[#0070B8] text-white">
        <div className="max-w-5xl mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About Whispher Pattern
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Where encryption meets art. We transform your secret messages into beautiful 
              visual patterns that can only be decoded with the right key.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                In a world of instant messaging and public posts, we believe some things 
                are meant to be shared in a more meaningful way. Whispher Pattern bridges 
                the gap between privacy and expression.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We empower users to hide messages in plain sight—transforming text into 
                art that tells a story only the intended recipient can fully understand.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {emotions.map((emotion) => (
                <div
                  key={emotion.id}
                  className="p-4 rounded-xl text-center transition-transform hover:scale-105"
                  style={{ backgroundColor: `${emotion.color}10` }}
                >
                  <span className="text-3xl">{emotion.icon}</span>
                  <p 
                    className="text-sm font-medium mt-2"
                    style={{ color: emotion.color }}
                  >
                    {emotion.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={step.step} className="text-center">
                <div className="relative">
                  <div className="w-16 h-16 mx-auto bg-linear-to-br from-[#0084D1] to-[#0070B8] rounded-full flex items-center justify-center text-3xl mb-4 shadow-lg shadow-[#0084D1]/20">
                    {step.icon}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gray-200"></div>
                  )}
                </div>
                <p className="text-sm text-gray-500 mb-1">Step {step.step}</p>
                <h3 className="font-semibold text-gray-900">{step.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">Features</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              <span className="text-4xl">{feature.icon}</span>
              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Technology Section */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-4">Built With Security First</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Your privacy matters. Messages are encrypted client-side before 
              reaching our servers. We never see or store your secret keys.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl mb-3">🛡️</div>
              <h3 className="font-semibold mb-1">End-to-End</h3>
              <p className="text-sm text-gray-400">Client-side encryption</p>
            </div>
            <div>
              <div className="text-4xl mb-3">🔒</div>
              <h3 className="font-semibold mb-1">AES-256</h3>
              <p className="text-sm text-gray-400">Military-grade security</p>
            </div>
            <div>
              <div className="text-4xl mb-3">🚫</div>
              <h3 className="font-semibold mb-1">Zero Knowledge</h3>
              <p className="text-sm text-gray-400">We can&apos;t read your messages</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="bg-linear-to-br from-[#0084D1] to-[#0070B8] rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Create?</h2>
          <p className="text-blue-100 mb-8 max-w-lg mx-auto">
            Join our community and start turning your secrets into art.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/signup"
              className="px-8 py-3 bg-white text-[#0084D1] rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              Get Started
            </Link>
            <Link
              to="/gallery"
              className="px-8 py-3 bg-white/10 text-white border border-white/30 rounded-xl font-semibold hover:bg-white/20 transition-colors"
            >
              View Gallery
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
