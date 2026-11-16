import { Users, Globe, Scale, BookOpen } from 'lucide-react';

const founders = [
  {
    name: 'Shivangi Khare',
    role: 'Founder & Project Director, Project NISHTHA',
    bio: 'I believe meaningful governance begins with informed conversations and the courage to ask questions. Through Project NISHTHA, I hope to create a platform that brings together citizens, policymakers, academicians and professionals to encourage dialogue, transparency and accountability. My vision is to make governance more accessible, participatory and people-centric.',
  },
  {
    name: 'Krishna Chawla',
    role: 'Co-Founder, Project NISHTHA',
    bio: 'With a strong interest in public policy, governance and international relations, I believe meaningful change comes through informed dialogue and collaborative thinking. Through Project NISHTHA, I aim to contribute to building a platform that encourages transparency, accountability and constructive engagement between institutions and citizens.',
  },
];

const leadership = [
  {
    name: 'Dr. Aastha Srivastav',
    role: 'Doctor (DGO) | Founder, Sankalp Matri Evam Shishu Kalyan Samiti',
    bio: 'A medical professional and social development advocate, Dr. Aastha Srivastav founded Sankalp to support maternal and child welfare and contribute to community well-being.',
  },
  {
    name: 'Dr. Rajesh Kumar Khare',
    role: 'MBBS, MD | President, Sankalp Matri Evam Shishu Kalyan Samiti',
    bio: 'An experienced medical professional, Dr. Rajesh Kumar Khare serves as President of Sankalp, supporting its mission of social welfare, community development and institutional growth.',
  },
];

export default function About() {
  const pillars = [
    { icon: Scale, title: 'Governance & Reform', text: 'Examining public administration, institutional frameworks, and governance reforms that shape effective policy.' },
    { icon: Globe, title: 'International Relations', text: 'Exploring global affairs, diplomatic discourse, and the evolving dynamics of international cooperation.' },
    { icon: BookOpen, title: 'Public Policy', text: 'Analyzing policy formulation, social development, and emerging challenges in the public sector.' },
    { icon: Users, title: 'Inclusive Dialogue', text: 'Bringing together voices from government, academia, civil society, and the research community.' },
  ];

  return (
    <section id="about" className="py-20 lg:py-28 bg-[#f7f6f2]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-sm uppercase tracking-[.18em] text-[#a8792c] mb-3">Our Mission</p>
          <h2 className="about-heading text-4xl sm:text-5xl font-semibold tracking-tight text-[#142640] mb-5"><img src="/nishtha-site/logos/NISHTHA%20LOGO.jpeg" alt="Project NISHTHA emblem" className="about-nishtha-logo"/>About NISHTHA</h2>
          <div className="h-px bg-[#c49a53] w-20 mx-auto" />
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-7 md:p-11 mb-14">
          <p className="text-lg md:text-xl text-slate-700 leading-8 text-center max-w-4xl mx-auto">
            Established with the vision of strengthening governance discourse, NISHTHA seeks to bridge the gap between policy formulation, administrative practice, and public understanding. Our publication explores subjects across public administration, governance reforms, international relations, public policy, social development, institutional frameworks, and emerging challenges in the public sector.
          </p>
          <p className="text-base md:text-lg text-slate-500 leading-7 text-center max-w-3xl mx-auto mt-5">
            We bring together diverse voices from government, academia, civil society, and the research community to examine contemporary issues, exchange perspectives, and highlight ideas that can contribute to effective and inclusive governance.
          </p>
        </div>
      </div>

      <div id="founders" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="text-center mb-10"><p className="text-sm uppercase tracking-[.18em] text-[#a8792c] mb-3">The people behind the initiative</p><h2 className="text-3xl sm:text-4xl font-semibold text-[#142640]">Founders</h2></div>
        <div className="grid md:grid-cols-2 gap-6">
          {founders.map(person => <article key={person.name} className="bg-white border border-slate-200 rounded-2xl p-7 md:p-9"><h3 className="text-2xl font-semibold text-[#142640]">{person.name}</h3><p className="text-sm font-medium text-[#a8792c] mt-2 mb-5">{person.role}</p><p className="text-slate-600 leading-7">{person.bio}</p></article>)}
        </div>
      </div>

      <div id="leadership" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="text-center mb-10"><p className="text-sm uppercase tracking-[.18em] text-[#a8792c] mb-3">Parent organisation</p><h2 className="text-3xl sm:text-4xl font-semibold text-[#142640]">Sankalp Leadership</h2></div>
        <div className="grid md:grid-cols-2 gap-6">
          {leadership.map(person => <article key={person.name} className="bg-white border border-slate-200 rounded-2xl p-7 md:p-9"><h3 className="text-2xl font-semibold text-[#142640]">{person.name}</h3><p className="text-sm font-medium text-[#a8792c] mt-2 mb-5">{person.role}</p><p className="text-slate-600 leading-7">{person.bio}</p></article>)}
        </div>
      </div>
    </section>
  );
}
