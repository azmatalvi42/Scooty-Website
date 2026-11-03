export const products = [
  {
    slug: 'micromobility', tag: 'Micromobility', title: 'SCOOTY Micromobility',
    headline: 'Your next connection starts here.',
    sectionTitle: 'Connected to everyday life.', workflowTitle: 'From here to there.',
    description: 'On-demand e-bikes and e-scooters that connect neighbourhoods to regional transit. Transit to Your Doorstep®.',
    image: '/assets/Cities/Burlington/burlington-rider.png',
    alt: 'A helmeted rider on a yellow SCOOTY scooter in Burlington', position: '50% 45%', accent: '#FEC001',
    introduction: 'A short ride can open up a much bigger journey. SCOOTY brings vehicles, software, operations and planning together to help communities close the first-and-last-kilometre gap.',
    features: [
      { title: 'Find your ride', text: 'Locate nearby SCOOTY vehicles and plan your connection to transit.' },
      { title: 'Scan and go', text: 'Unlock your vehicle through the app and make the first part of your trip electric.' },
      { title: 'Connect your community', text: 'Explore micromobility programs for municipalities, campuses and local destinations.' },
    ],
    steps: ['Find a vehicle near you in the SCOOTY app.', 'Check local riding guidance and get ready to ride.', 'Ride to your destination and park responsibly.'],
    cta: 'Explore rider information', href: '/riders',
  },
  {
    slug: 'ai-rideguide', tag: 'AI RideGuide', title: 'SCOOTY AI RideGuide',
    headline: 'A little guidance. A better journey.',
    sectionTitle: 'Guidance for the whole journey.', workflowTitle: 'Plan. Connect. Go.',
    description: 'Conversational AI, real-time service updates and dynamic routing to help people navigate their daily transit commute.',
    image: '/assets/illustrations/ride-guide.svg',
    alt: 'RideGuide illustration connecting walking, riding and transit', position: 'center', accent: '#01BDFE', backdrop: '#101b22',
    introduction: 'Bring the pieces of a transit trip together. AI RideGuide helps commuters find routes, understand service updates and get support along the way.',
    features: [
      { title: 'Ask naturally', text: 'Use conversational trip planning to find a way from where you are to where you need to be.' },
      { title: 'Stay informed', text: 'Use service updates to understand changes that affect your journey.' },
      { title: 'Connect the journey', text: 'Bring walking, shared mobility and regional transit into your trip planning.' },
    ],
    steps: ['Start with your destination and a question about your trip.', 'Explore routes and relevant service information.', 'Get guidance as your travel plans change.'],
    cta: 'Explore partnership opportunities', href: '/partners',
  },
];
