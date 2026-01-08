import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Masonry from 'react-masonry-css';
import { generatePattern, EMOTIONS } from '../utils/patternGenerator';

function Home() {
  const [placeholderSecrets, setPlaceholderSecrets] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    // Generate placeholder patterns for demonstration with different emotions
    const emotionKeys = EMOTIONS; // ['passion', 'calm', 'joy', 'mystery', 'nature', 'serenity']
    const mockSecrets = Array.from({ length: 15 }, (_, i) => {
      const emotion = emotionKeys[i % emotionKeys.length];
      return {
        id: i + 1,
        pattern: generatePattern(400, Math.floor(Math.random() * 200) + 300, Math.random(), emotion),
        author: `Encoder${Math.floor(Math.random() * 999)}`,
        likes: Math.floor(Math.random() * 500),
        unlocks: Math.floor(Math.random() * 300),
        timestamp: `${Math.floor(Math.random() * 24)}h ago`,
        emotion
      };
    });
    setPlaceholderSecrets(mockSecrets);
  }, []);

  const breakpointColumns = {
    default: 4,
    1280: 3,
    1024: 2,
    640: 1
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-linear-to-br from-[#0084D1] to-[#0070B8] text-white py-12 sm:py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
            Where feelings hide in plain sight.
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-blue-100 mb-6 md:mb-8 px-4">
            Click on a pattern to unlock the thought inside.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-white text-[#0084D1] rounded-lg font-semibold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl text-center"
            >
              Start Encoding
            </Link>
            <Link
              to="/about"
              className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-all text-center"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 md:py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8 md:mb-12">
            How It Works
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {/* Step 1 */}
            <div className="text-center p-4">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-[#0084D1] text-white rounded-full flex items-center justify-center text-2xl md:text-3xl font-bold mx-auto mb-4 shadow-lg">
                1
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">Encode Your Feelings</h3>
              <p className="text-sm md:text-base text-gray-600">
                Write your thoughts, emotions, or secrets. They'll be transformed into beautiful geometric art.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center p-4">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-[#0084D1] text-white rounded-full flex items-center justify-center text-2xl md:text-3xl font-bold mx-auto mb-4 shadow-lg">
                2
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">Share as Art</h3>
              <p className="text-sm md:text-base text-gray-600">
                Your message becomes a stunning pattern. Only those who click can decode your hidden message.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center p-4 sm:col-span-2 md:col-span-1">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-[#0084D1] text-white rounded-full flex items-center justify-center text-2xl md:text-3xl font-bold mx-auto mb-4 shadow-lg">
                3
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">Connect Anonymously</h3>
              <p className="text-sm md:text-base text-gray-600">
                Explore others' patterns, unlock secrets, and connect through encrypted creativity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feed Section - Interactive Pattern Showcase */}
      <section className="py-12 md:py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Explore Secrets</h2>
              <p className="text-sm md:text-base text-gray-600 mt-1">Click any pattern to unlock hidden messages</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
              <button className="whitespace-nowrap px-3 sm:px-4 py-2 text-sm bg-[#0084D1] text-white rounded-lg font-medium hover:bg-[#0070B8] transition-colors shadow-sm">
                Recent
              </button>
              <button className="whitespace-nowrap px-3 sm:px-4 py-2 text-sm bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors shadow-sm">
                Popular
              </button>
              <button className="whitespace-nowrap px-3 sm:px-4 py-2 text-sm bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors shadow-sm">
                Following
              </button>
            </div>
          </div>

          {/* Masonry Grid with Placeholder Patterns */}
          <Masonry
            breakpointCols={breakpointColumns}
            className="flex -ml-4 md:-ml-6 w-auto"
            columnClassName="pl-4 md:pl-6 bg-clip-padding"
          >
            {placeholderSecrets.map((secret) => (
              <div
                key={secret.id}
                className="mb-4 md:mb-6 group cursor-pointer relative overflow-hidden rounded-xl bg-white shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                onMouseEnter={() => setHoveredCard(secret.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Pattern Image */}
                <div className="relative">
                  <img
                    src={secret.pattern}
                    alt={`Secret by ${secret.author}`}
                    className="w-full h-auto"
                  />
                  {/* Hover Overlay with Lock Icon */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                      <div className="text-white text-4xl md:text-5xl mb-2">🔒</div>
                      <p className="text-white text-sm md:text-base font-medium">Click to Unlock</p>
                    </div>
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-3 md:p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-linear-to-br from-[#0084D1] to-[#0070B8] rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {secret.author.charAt(secret.author.length - 1)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{secret.author}</p>
                        <p className="text-xs text-gray-500">{secret.timestamp}</p>
                      </div>
                    </div>
                  </div>

                  {/* Engagement Stats */}
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
                    <button className="flex items-center gap-1 text-gray-600 hover:text-[#0084D1] transition-colors">
                      <span className="text-lg">❤️</span>
                      <span className="text-sm font-medium">{secret.likes}</span>
                    </button>
                    <button className="flex items-center gap-1 text-gray-600 hover:text-[#0084D1] transition-colors">
                      <span className="text-lg">🔓</span>
                      <span className="text-sm font-medium">{secret.unlocks}</span>
                    </button>
                    <button className="flex items-center gap-1 text-gray-600 hover:text-[#0084D1] transition-colors ml-auto">
                      <span className="text-lg">💬</span>
                      <span className="text-sm font-medium">Reply</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </Masonry>

          {/* Load More CTA */}
          <div className="text-center mt-8 md:mt-12">
            <p className="text-gray-600 mb-4 text-sm md:text-base">
              Sign up to explore thousands of encrypted secrets
            </p>
            <Link
              to="/signup"
              className="inline-block px-6 md:px-8 py-3 bg-[#0084D1] text-white rounded-lg font-semibold hover:bg-[#0070B8] transition-colors shadow-lg hover:shadow-xl"
            >
              Join CipherCanvas
            </Link>
          </div>
        </div>
      </section>

      {/* Community Stats */}
      <section className="py-12 md:py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8 md:mb-12">
            The CipherCanvas Community
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
            <div className="p-4">
              <div className="text-3xl md:text-4xl font-bold text-[#0084D1] mb-2">10K+</div>
              <div className="text-sm md:text-base text-gray-600">Secrets Shared</div>
            </div>
            <div className="p-4">
              <div className="text-3xl md:text-4xl font-bold text-[#0084D1] mb-2">5K+</div>
              <div className="text-sm md:text-base text-gray-600">Active Encoders</div>
            </div>
            <div className="p-4">
              <div className="text-3xl md:text-4xl font-bold text-[#0084D1] mb-2">50K+</div>
              <div className="text-sm md:text-base text-gray-600">Patterns Created</div>
            </div>
            <div className="p-4">
              <div className="text-3xl md:text-4xl font-bold text-[#0084D1] mb-2">100%</div>
              <div className="text-sm md:text-base text-gray-600">Anonymous</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 px-4 bg-linear-to-br from-[#0084D1] to-[#0070B8] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
            Ready to Hide Your Story?
          </h2>
          <p className="text-base md:text-xl text-blue-100 mb-6 md:mb-8 px-4">
            Join thousands who express themselves through encrypted art.
          </p>
          <Link
            to="/signup"
            className="inline-block px-6 md:px-8 py-3 md:py-4 bg-white text-[#0084D1] rounded-lg font-semibold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl text-base md:text-lg"
          >
            Create Your First Secret
          </Link>
        </div>
      </section>

      {/* Floating Action Button - Hidden on small screens to avoid blocking content */}
      <Link
        to="/create"
        className="hidden sm:flex fixed bottom-6 right-6 md:bottom-8 md:right-8 w-14 h-14 md:w-16 md:h-16 bg-[#0084D1] text-white rounded-full shadow-2xl hover:bg-[#0070B8] transition-all duration-200 items-center justify-center text-2xl md:text-3xl hover:scale-110 z-40"
        title="Create Secret"
      >
        +
      </Link>
    </div>
  );
}

export default Home;
