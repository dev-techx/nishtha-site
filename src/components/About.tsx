import { Users, Globe, Scale, BookOpen } from 'lucide-react';

export default function About() {
  const pillars = [
    {
      icon: Scale,
      title: 'Governance & Reform',
      text: 'Examining public administration, institutional frameworks, and governance reforms that shape effective policy.',
    },
    {
      icon: Globe,
      title: 'International Relations',
      text: 'Exploring global affairs, diplomatic discourse, and the evolving dynamics of international cooperation.',
    },
    {
      icon: BookOpen,
      title: 'Public Policy',
      text: 'Analyzing policy formulation, social development, and emerging challenges in the public sector.',
    },
    {
      icon: Users,
      title: 'Inclusive Dialogue',
      text: 'Bringing together voices from government, academia, civil society, and the research community.',
    },
  ];

  return (
    <section id="about" className="py-20 lg:py-28 library-bg relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="font-ui text-sm uppercase tracking-widest text-library-gold mb-3">
            Our Mission
          </p>
          <h2 className="font-serif-display text-4xl sm:text-5xl md:text-6xl font-bold text-library-wood-dark mb-6">
            About NISHTHA
          </h2>
          <div className="gold-divider mx-auto w-32" />
        </div>

        {/* Main description */}
        <div className="paper-bg rounded-lg p-8 md:p-12 mb-16 shadow-md ornament">
          <p className="font-body text-lg md:text-xl text-library-ink leading-relaxed text-center max-w-4xl mx-auto">
            Established with the vision of strengthening governance discourse, NISHTHA seeks to
            bridge the gap between policy formulation, administrative practice, and public
            understanding. Our publication explores subjects across public administration,
            governance reforms, international relations, public policy, social development,
            institutional frameworks, and emerging challenges in the public sector.
          </p>
          <div className="gold-divider mx-auto w-24 my-6" />
          <p className="font-body text-base md:text-lg text-library-wood-mid leading-relaxed text-center max-w-3xl mx-auto italic">
            We bring together diverse voices from government, academia, civil society, and the
            research community to examine contemporary issues, exchange perspectives, and highlight
            ideas that can contribute to effective and inclusive governance.
          </p>
        </div>

        {/* Pillars grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="paper-bg rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-smooth hover:-translate-y-1 group"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-library-wood-dark/5 mb-4 group-hover:bg-library-gold/10 transition-smooth">
                  <Icon
                    size={28}
                    className="text-library-wood-mid group-hover:text-library-gold transition-smooth"
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="font-serif-display text-xl font-semibold text-library-wood-dark mb-2">
                  {pillar.title}
                </h3>
                <p className="font-body text-sm text-library-ink/70 leading-relaxed">
                  {pillar.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
