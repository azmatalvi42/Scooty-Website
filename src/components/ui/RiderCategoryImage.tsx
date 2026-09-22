import { SiteImage } from './SiteImage';

const visuals: Record<string, { src: string; alt: string; caption: string; position?: string }> = {
  'getting-started': {
    src: '/assets/Cities/Burlington/burlington-scooters.png',
    alt: 'SCOOTY scooters with scan-to-ride instructions on their handlebars',
    caption: 'Your first ride starts with a scan.', position: '50% 35%',
  },
  'how-to-ride': {
    src: '/assets/Cities/Burlington/burlington-rider.png',
    alt: 'A helmeted SCOOTY rider standing on a scooter with both hands on the handlebars',
    caption: 'Helmet on. Both hands on. Ready to ride.', position: '48% 52%',
  },
  'where-to-ride': {
    src: '/assets/Riders/Carousel/riders-carousel-parking.png',
    alt: 'SCOOTY scooters at a Burlington location with a designated parking information sign',
    caption: 'Check the SCOOTY app for current riding and parking zones.',
  },
  parking: {
    src: '/assets/Cities/Burlington/burlington-scooters.png',
    alt: 'Yellow SCOOTY scooters parked upright in a neat row beside a designated parking sign',
    caption: 'Park upright. Leave the way clear.', position: '50% 75%',
  },
  safety: {
    src: '/assets/Cities/Markham/markham-helmet.jpg',
    alt: 'Close-up of a black SCOOTY helmet resting on a scooter handlebar',
    caption: 'A safer ride starts before you roll.', position: '36% 45%',
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
