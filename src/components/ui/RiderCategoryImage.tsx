import { SiteImage } from './SiteImage';

// `position` frames the 4:3 figure; `widePosition` frames the Riders page's 16:9 carousel card.
const visuals: Record<string, { src: string; alt: string; caption: string; position?: string; widePosition?: string }> = {
  'getting-started': {
    src: '/assets/Riders/DSC02472.JPG',
    alt: 'A helmeted rider using a phone beside a row of parked SCOOTY scooters',
    caption: 'Your first ride starts with a scan.', position: '62% 55%', widePosition: '55% 50%',
  },
  'how-to-ride': {
    src: '/assets/Riders/2024MarkhamOVINScootyDemo-046.jpg',
    alt: 'Two helmeted riders on a SCOOTY e-scooter and e-bike',
    caption: 'Helmet on. Both hands on. Ready to ride.', position: '55% 50%', widePosition: '55% 55%',
  },
  'where-to-ride': {
    src: '/assets/Riders/Carousel/riders-carousel-parking.png',
    alt: 'SCOOTY scooters at a Burlington location with a designated parking information sign',
    caption: 'Check the SCOOTY app for current riding and parking zones.',
  },
  parking: {
    src: '/assets/Riders/2024MarkhamOVINScootyDemo-002.jpg',
    alt: 'A neat row of SCOOTY e-scooters parked upright with helmets on the handlebars',
    caption: 'Park upright. Leave the way clear.', position: '50% 40%',
  },
  safety: {
    src: '/assets/Riders/2024MarkhamOVINScootyDemo-058.jpg',
    alt: 'A rider wearing a helmet on a SCOOTY e-scooter',
    caption: 'A safer ride starts before you roll.', position: '50% 15%', widePosition: '50% 20%',
  },
  vehicles: {
    src: '/assets/Riders/Carousel/riders-carousel-vehicles.png',
    alt: 'A row of black and yellow SCOOTY electric bicycles with front baskets',
    caption: 'Two ways to make your everyday electric.',
  },
};

export function RiderCategoryImage({ topic, eager = false }: { topic: string; eager?: boolean }) {
  const visual = visuals[topic];
  if (!visual) return null;
  return (
    <figure className="rider-category-figure">
      <div className="rider-category-photo">
        <SiteImage src={visual.src} alt={visual.alt} className="w-full h-full object-cover" style={{ objectPosition: visual.position ?? 'center' }} sizes="(min-width: 1024px) 560px, 100vw" loading={eager ? 'eager' : 'lazy'} />
      </div>
      {topic === 'vehicles' && <div className="rider-category-scooter">
        <SiteImage src="/assets/Cities/Burlington/burlington-scooters.png" alt="SCOOTY electric scooters with wide decks and handlebar displays" className="w-full h-full object-cover" style={{ objectPosition: '50% 68%' }} sizes="(min-width: 1024px) 560px, 100vw" />
      </div>}
      <figcaption className="rider-category-caption"><span aria-hidden="true" />{visual.caption}</figcaption>
    </figure>
  );
}

const SCOOTERS = { src: '/assets/Cities/Burlington/burlington-scooters.png', alt: 'SCOOTY electric scooters with wide decks and handlebar displays', position: '50% 68%' };

/** The topic's photo filling a Riders page carousel card; vehicles pairs the e-bikes with the e-scooters. */
export function RiderCategorySlide({ topic, active }: { topic: string; active: boolean }) {
  const visual = visuals[topic];
  if (!visual) return null;
  const tone = `w-full h-full object-cover transition-[filter] duration-500 ${active ? '' : 'saturate-[.75] group-hover/card:saturate-100'}`;
  return (
    <div className={`w-full h-full ${topic === 'vehicles' ? 'grid grid-cols-2 gap-1' : ''}`}>
      <SiteImage src={visual.src} alt={visual.alt} draggable={false} className={tone} style={{ objectPosition: visual.widePosition ?? visual.position ?? 'center' }} sizes="(min-width: 768px) 62vw, 100vw" />
      {topic === 'vehicles' && (
        <SiteImage src={SCOOTERS.src} alt={SCOOTERS.alt} draggable={false} className={tone} style={{ objectPosition: SCOOTERS.position }} sizes="(min-width: 768px) 31vw, 50vw" />
      )}
    </div>
  );
}
