import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, AlertTriangle, CheckCircle, XCircle, Bike, ExternalLink } from 'lucide-react';

// ─── Reusable components ─────────────────────────────────────────────────────

const Important = ({ children }: { children: React.ReactNode }) => (
  <div className="flex gap-3 px-4 py-3 bg-primary-500/10 border-l-4 border-primary-500 rounded-r-xl mb-6">
    <AlertTriangle className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
    <p className="text-sm font-semibold text-primary-700 dark:text-primary-300">{children}</p>
  </div>
);

const StepList = ({ steps }: { steps: React.ReactNode[] }) => (
  <ol className="space-y-3">
    {steps.map((step, i) => (
      <li key={i} className="flex gap-3">
        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-500 text-black text-xs font-bold flex items-center justify-center mt-0.5">
          {i + 1}
        </span>
        <span className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{step}</span>
      </li>
    ))}
  </ol>
);

const BulletList = ({ items }: { items: React.ReactNode[] }) => (
  <ul className="space-y-2">
    {items.map((item, i) => (
      <li key={i} className="flex gap-2">
        <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary-500 mt-2" />
        <span className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{item}</span>
      </li>
    ))}
  </ul>
);

const DoList = ({ items }: { items: React.ReactNode[] }) => (
  <ul className="space-y-2">
    {items.map((item, i) => (
      <li key={i} className="flex gap-2">
        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
        <span className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{item}</span>
      </li>
    ))}
  </ul>
);

const DontList = ({ items }: { items: React.ReactNode[] }) => (
  <ul className="space-y-2">
    {items.map((item, i) => (
      <li key={i} className="flex gap-2">
        <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
        <span className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{item}</span>
      </li>
    ))}
  </ul>
);

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 mt-8 first:mt-0">{children}</h3>
);

const ZoneRow = ({ color, label, description }: { color: string; label: string; description: string }) => (
  <li className="flex gap-3 items-start">
    <span className={`flex-shrink-0 w-3 h-3 rounded-full mt-1.5 ${color}`} />
    <span className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
      <strong>{label}</strong> — {description}
    </span>
  </li>
);

// ─── Content sections ─────────────────────────────────────────────────────────

const GettingStartedContent = () => (
  <div>
    <Important>Riders must be 16+ years of age to ride with SCOOTY</Important>
    <StepList
      steps={[
        <>
          Download the{' '}
          <a href="#" className="text-primary-600 dark:text-primary-400 underline underline-offset-2">
            SCOOTY app
          </a>
        </>,
        'Create an account and add your preferred payment method',
        'Find a SCOOTY using the map in the app',
        'Scan to view pricing and unlock SCOOTY',
        "Don't forget your helmet and ride safely",
        'Be responsible, follow local rules in your city',
      ]}
    />
  </div>
);

const WhereToRideContent = () => (
  <div>
    <Important>Check the map in the SCOOTY app to see the different riding zones</Important>
    <ul className="space-y-4">
      <ZoneRow color="bg-green-500" label="Green" description="Service Area and Regular Riding Zone (maximum speed 20 km/h)." />
      <ZoneRow color="bg-yellow-400" label="Yellow" description="Slow Speed Zone (maximum speed 15 km/h)." />
      <ZoneRow color="bg-red-500" label="Red" description="No Riding/No Parking Zone (speed 0 km/h)." />
    </ul>
  </div>
);

const ParkingContent = () => (
  <div>
    <Important>Check the SCOOTY app to find the nearest designated parking zone</Important>

    <SectionHeading>Where to Park</SectionHeading>
    <BulletList
      items={[
        'Park SCOOTY at Designated Parking Zones (shown in the App).',
        <>
          <strong>Blue outline</strong> — Parking Zone (speed 0 km/h). These are shown as a blue "P" in the map in the SCOOTY App.
        </>,
        'Designated Parking Zones may have bike racks, parking mats, or ground tape.',
      ]}
    />

    <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40 rounded-xl">
      <p className="text-sm font-bold text-amber-800 dark:text-amber-300 mb-4 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4" /> Parking Do's and Don'ts
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <p className="text-xs font-bold text-green-700 dark:text-green-400 uppercase tracking-wider mb-2">Do</p>
          <DoList
            items={[
              'Park the SCOOTY vehicle upright and do not block the sidewalk/pathway/trail.',
              'At parking areas along roadways, park the device between the curb and the sidewalk.',
              'If the station is full, look for another station nearby.',
            ]}
          />
        </div>
        <div>
          <p className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider mb-2">Do Not</p>
          <DontList
            items={[
              'Block any path of travel, ramp, stairway or doorway.',
              'Park a SCOOTY vehicle in a No-Riding or No-Parking zone.',
              'Park at your home or any private residence.',
              'Non-compliance parking may be subject to parking penalty fees.',
            ]}
          />
        </div>
      </div>
    </div>

    <SectionHeading>How to Park (Ending a Ride)</SectionHeading>
    <StepList
      steps={[
        'Use the app to find a designated parking zone.',
        'Park the vehicle properly inside the designated parking zone and pull it up on the kickstand.',
        'Swipe right in the app screen to end your ride.',
        'Upload a photo of the SCOOTY vehicle, showing it is properly parked.',
        'When proper parking is confirmed, your ride will end.',
      ]}
    />

    <SectionHeading>How to Park (Pausing a Ride)</SectionHeading>
    <StepList
      steps={[
        'Use the app to find a designated parking zone.',
        "Park the vehicle properly inside the designated parking zone. If there is no designated parking zone, make sure you park off the pathway/trail.",
        'Pull the vehicle up on the kickstand and make sure it is upright and stable.',
        'Press the pause button in the app screen to pause your ride.',
      ]}
    />
  </div>
);

const SafetyContent = () => (
  <div>
    <Important>Riders must be 16+ years of age to ride with SCOOTY</Important>

    <SectionHeading>Helmets</SectionHeading>
    <BulletList
      items={[
        'All riders should wear a safety helmet when riding with SCOOTY.',
        'By law, all e-scooter riders under 18 must wear a helmet.',
        'By law, all e-bike riders of all ages must wear a helmet.',
      ]}
    />

    <SectionHeading>Riding Rules</SectionHeading>
    <BulletList
      items={[
        'Riding is permitted on all roads with a speed limit of 50 km/h or below.',
        'Riding is permitted on roads with a speed limit higher than 50 km/h only if a bike lane, cycle track or multi-use path is available.',
        'No riding on sidewalks.',
        'No riding under the influence of alcohol or drugs.',
        'Vehicles are for single person use only, no double joyriding.',
        'You must dismount and walk the vehicle where required (e.g. at a pedestrian crossing or where it is required by a sign).',
      ]}
    />

    <SectionHeading>Speed Limits</SectionHeading>
    <ul className="space-y-3">
      <ZoneRow color="bg-green-500" label="Regular Riding Zones" description="20 km/h" />
      <ZoneRow color="bg-yellow-400" label="Slow Speed Zones" description="15 km/h (parks, trails, high-pedestrian areas)" />
      <ZoneRow color="bg-red-500" label="No Riding and No-Parking Zones" description="0 km/h" />
    </ul>
  </div>
);

const VehiclesContent = () => (
  <div>
    <Important>Ride with safety and confidence using the latest technology</Important>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-2">
      <div className="bg-gray-50 dark:bg-navy-800 rounded-2xl p-6 border border-gray-200 dark:border-white/10">
        <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center mb-4">
          <Bike className="w-5 h-5 text-black" />
        </div>
        <h3 className="font-bold text-gray-900 dark:text-white mb-1">E-Scooter</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          Throttle-controlled electric scooter. Max speed 20 km/h. Lightweight and ideal for short urban trips.
        </p>
      </div>
      <div className="bg-gray-50 dark:bg-navy-800 rounded-2xl p-6 border border-gray-200 dark:border-white/10">
        <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center mb-4">
          <Bike className="w-5 h-5 text-black" />
        </div>
        <h3 className="font-bold text-gray-900 dark:text-white mb-1">E-Bike</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          Pedal-assist electric bicycle. Helmet required for all riders. Perfect for longer rides and mixed terrain.
        </p>
      </div>
    </div>
  </div>
);

// ─── Content mapping ─────────────────────────────────────────────────────────

const CONTENT_MAP: Record<string, { title: string; content: JSX.Element }> = {
  'getting-started': { title: 'Getting Started', content: <GettingStartedContent /> },
  'where-to-ride': { title: 'Where to Ride', content: <WhereToRideContent /> },
  'parking': { title: 'Parking', content: <ParkingContent /> },
  'safety': { title: 'Safety', content: <SafetyContent /> },
  'vehicles': { title: 'Vehicles', content: <VehiclesContent /> },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export const RiderDetailPage = () => {
  const { topic } = useParams<{ topic: string }>();
  const data = topic ? CONTENT_MAP[topic] : null;

  if (!data) {
    return (
      <div className="min-h-screen bg-white dark:bg-black pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Topic not found</h1>
          <Link
            to="/riders"
            className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Riders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Hero */}
      <section className="relative pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-white dark:from-black dark:via-navy-800 dark:to-black" />
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(234,179,8,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(234,179,8,0.4) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Link
              to="/riders"
              className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Riders
            </Link>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold font-display text-gray-900 dark:text-white"
          >
            {data.title}
          </motion.h1>
        </div>
      </section>

      {/* Content */}
      <section className="pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white dark:bg-navy-800 rounded-2xl p-8 border border-gray-200 dark:border-white/10"
          >
            {data.content}
          </motion.div>
        </div>
      </section>
    </div>
  );
};
