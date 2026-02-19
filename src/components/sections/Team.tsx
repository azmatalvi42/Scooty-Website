import { motion, useMotionValue, useAnimationFrame } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useRef, useState } from 'react';
import { Linkedin, Mail, Quote } from 'lucide-react';

const partnerQuotes = [
  {
    quote: 'Scooty\'s AI platform cut our fleet rebalancing costs in half within the first quarter. The data insights alone were worth the partnership.',
    name: 'Elena Vasquez',
    role: 'Director of Transportation',
    org: 'City of San Francisco',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    quote: 'We evaluated six vendors. Scooty was the only platform that could handle real-time demand prediction at our scale — across 12 districts simultaneously.',
    name: 'Thomas Brandt',
    role: 'Head of Urban Mobility',
    org: 'Berlin Senate Department',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    quote: 'Rider satisfaction jumped 34% after switching to Scooty. The app experience is seamless and our city dashboard gives us complete visibility.',
    name: 'Priya Nair',
    role: 'Transit Innovation Lead',
    org: 'Austin Metro Authority',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    quote: 'The predictive maintenance module alone reduced our vehicle downtime by 60%. Scooty doesn\'t just manage fleets — it transforms operations.',
    name: 'James Okoro',
    role: 'COO',
    org: 'GreenWheel Mobility',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    quote: 'As a city of 4 million people, we needed a partner who understood compliance at scale. Scooty made our regulatory reporting fully automated.',
    name: 'Marie Dupont',
    role: 'Deputy Mayor of Transport',
    org: 'City of Lyon',
    avatar: 'https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    quote: 'From onboarding to launch in 6 weeks — Scooty\'s team moved faster than any technology partner we\'ve worked with. Truly world-class execution.',
    name: 'Carlos Medina',
    role: 'VP Operations',
    org: 'RideFlow LATAM',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
];

const teamMembers = [
  {
    name: 'Amir Khalid',
    role: 'CEO & Co-Founder',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300',
    bio: 'Former transit tech lead at Google. 10+ years building intelligent transportation systems.',
    skills: ['Strategy', 'AI/ML', 'Urban Planning', 'Fundraising'],
    linkedin: 'https://linkedin.com',
  },
  {
    name: 'Sarah Chen',
    role: 'CTO',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=300',
    bio: 'PhD in ML from Stanford. Previously built autonomous systems at Waymo and Cruise.',
    skills: ['Machine Learning', 'Systems Architecture', 'Robotics', 'Edge Computing'],
    linkedin: 'https://linkedin.com',
  },
  {
    name: 'Marcus Rivera',
    role: 'VP Engineering',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=300',
    bio: 'Scaled engineering teams at Uber and Lime. Expert in real-time distributed systems.',
    skills: ['Platform Engineering', 'IoT', 'Cloud Infra', 'Team Leadership'],
    linkedin: 'https://linkedin.com',
  },
];

const scrollQuotes = [...partnerQuotes, ...partnerQuotes];

export const Team = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const CARD_WIDTH = 400;
  const totalWidth = partnerQuotes.length * CARD_WIDTH;
  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useAnimationFrame(() => {
    if (isPaused) return;
    const current = x.get();
    const next = current - 0.5;
    x.set(next <= -totalWidth ? 0 : next);
  });

  return (
    <section id="careers" ref={ref} className="py-20 bg-gray-50 dark:bg-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-display text-gray-900 dark:text-white mb-4">
            Meet the <span className="text-primary-500">Team</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            The people building the operating system for micro-mobility.
          </p>
        </motion.div>

        {/* Leadership Team */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-white dark:bg-black/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-white/10 hover:shadow-xl hover:border-primary-500/30 transition-all duration-300">
                <div className="text-center mb-6">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover ring-4 ring-gray-100 dark:ring-secondary-800 group-hover:ring-primary-500/30 transition-all duration-300"
                  />
                  <h3 className="text-xl font-bold font-display text-gray-900 dark:text-white mb-1">
                    {member.name}
                  </h3>
                  <p className="text-primary-600 dark:text-primary-400 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {member.bio}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {member.skills.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="px-2 py-1 bg-primary-500/10 text-primary-700 dark:text-primary-400 rounded text-xs font-medium border border-primary-500/20"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex justify-center space-x-4">
                  <a
                    href={member.linkedin}
                    className="p-2 text-gray-400 hover:text-primary-500 transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a
                    href="mailto:careers@scooty.ai"
                    className="p-2 text-gray-400 hover:text-primary-500 transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Partner quotes */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold font-display text-gray-900 dark:text-white mb-3">
              Global Scale, <span className="text-primary-500">Local Impact</span>
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Hear from the city leaders and operators who partner with Scooty every day.
            </p>
          </div>

          {/* Scrolling track */}
          <div
            className="overflow-hidden"
            ref={containerRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <motion.div className="flex gap-6" style={{ x }}>
              {scrollQuotes.map((q, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-[360px] sm:w-[380px]"
                >
                  <div className="bg-white dark:bg-black/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-white/10 h-full flex flex-col">
                    <Quote className="w-8 h-8 text-primary-500/20 mb-4 flex-shrink-0" />

                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-6 flex-1">
                      "{q.quote}"
                    </p>

                    <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-white/10">
                      <img
                        src={q.avatar}
                        alt={q.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100 dark:ring-secondary-800"
                      />
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {q.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {q.role}, {q.org}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
