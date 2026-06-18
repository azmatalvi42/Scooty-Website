// SCOOTY blog content.
//
// Article bodies are written strictly from SCOOTY's own published website copy
// (rider rules, riding zones, vehicle specs, city programs, product & brand copy)
// — no statistics, quotes, places, or specs were invented. Four headlines were
// rewritten from their original placeholders because the originals promised
// specifics the site copy does not contain (named spots, specific new zones, a
// ranked route list). Card metadata (stop/date/author) is editorial placeholder.

export const CATEGORIES = ["All","City Guides","Rider Tips","Safety","Behind SCOOTY","Local Spots","City Updates"] as const;

export const CATEGORY_ACCENT: Record<string, string> = {
  "City Guides": "#01BDFE",
  "Rider Tips": "#01FEC0",
  "Safety": "#FE4601",
  "Behind SCOOTY": "#C001FE",
  "Local Spots": "#01FE01",
  "City Updates": "#4101FE"
};

// A single lenient block type keeps the renderer simple and avoids union friction.
export type ArticleBlock = {
  type: 'heading' | 'paragraph' | 'list' | 'tip';
  text?: string;
  ordered?: boolean;
  items?: string[];
};

export type Post = {
  id: string;
  stop: string;
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
  date: string;
  author: string;
  image: string;
  featured?: boolean;
  body: ArticleBlock[];
};

export const POSTS: Post[] = [
  {
    "id": "summer-routes",
    "stop": "Stop 01",
    "category": "City Guides",
    "title": "How to Find Your Perfect Summer Evening Ride with SCOOTY",
    "excerpt": "From Barrie's waterfront to Burlington's Centennial Trail, here's how to pick the SCOOTY routes that make a summer evening feel cinematic.",
    "readTime": "4 min read",
    "date": "Jun 2, 2026",
    "author": "City Team",
    "image": "/assets/mainPage/our-solutions-carousel/toronto-skyline.webp",
    "featured": true,
    "body": [
      {
        "type": "paragraph",
        "text": "There is something about a long summer evening that practically begs you to be outside and moving. The light softens, the air cools, and a ride that would feel like a commute at noon suddenly feels like the best part of your day. With SCOOTY, that ride is only a couple of taps away. SCOOTY offers shared e-scooters and e-bikes you can use to glide through the city, and the brand's whole idea is right there in the tagline: Your City, Your Ride."
      },
      {
        "type": "paragraph",
        "text": "The good news is that you do not need an insider's map to find a great evening route. SCOOTY operates across Ontario, Canada, and the SCOOTY app already shows you the riding zones and parking zones across the waterfronts, trails, and downtown areas where it operates. Here is how to use what is in the app to build a ride that feels effortless and a little bit cinematic."
      },
      {
        "type": "heading",
        "text": "Start with the map in the app"
      },
      {
        "type": "paragraph",
        "text": "Every memorable ride starts the same way. Open the SCOOTY app, where you can check the map to see the different speed-control riding zones and parking zones before you go. The colours tell you everything you need to know about where you can ride and how fast. Setup is quick too, so you can be rolling within minutes."
      },
      {
        "type": "list",
        "items": [
          "Clear zones are your open road: a 20 km/h speed limit, ideal for covering ground at a relaxed evening pace.",
          "Yellow zones are slow-speed areas at 15 km/h, often parks, trails, and high-pedestrian spots, which are exactly the scenic places you will want to linger.",
          "Red zones are no-riding, no-parking areas at 0 km/h, so the app keeps you clear of them automatically.",
          "Blue zones mark designated parking, and purple zones mark mandatory parking for ending your trip neatly."
        ]
      },
      {
        "type": "heading",
        "text": "Chase the water and the trails"
      },
      {
        "type": "paragraph",
        "text": "If you want that golden-hour, postcard feeling, follow the water. In Barrie, SCOOTY's e-bikes are built for trail and recreational riding, with the service running along the waterfront corridor on Kempenfelt Bay and the Barrie trail system. Rides there are hub-based, starting and ending at Centennial Park, which makes it a clean out-and-back loop for a summer evening. In Burlington, SCOOTY's emission-free e-scooters run the length of the 7 km Centennial Trail, one of the city's primary active transportation routes, with 17 designated parking zones spaced along the corridor so you can stop wherever the view is best."
      },
      {
        "type": "heading",
        "text": "Or take the downtown strip"
      },
      {
        "type": "paragraph",
        "text": "Prefer the energy of a city core after dark? Markham's service covers Downtown Markham and the surrounding urban core, and it is SCOOTY's only Ontario program offering both e-scooters and e-bikes in the same app, so you can pick your mood. Brampton's service area is city-wide, reaching neighbourhoods, parks, and transit hubs, which gives you the freedom to string together your own route across the city. Riding is permitted on roads with speed limits of 50 km/h or less, and geofencing keeps your ride inside the right zones the whole way."
      },
      {
        "type": "tip",
        "text": "Planning to pair your ride with patio plans or a transit connection? SCOOTY AI RideGuide can help you plan routes and check service updates, and SCOOTY supports first- and last-mile connections to transit, so an evening ride can flow right into a GO Train or bus without missing a beat."
      },
      {
        "type": "heading",
        "text": "Ride it right, end it clean"
      },
      {
        "type": "paragraph",
        "text": "A perfect evening ride is a safe and tidy one. A few essentials keep it that way:"
      },
      {
        "type": "list",
        "ordered": true,
        "items": [
          "Make sure you meet the minimum age of 16 or older, and always wear a helmet.",
          "Scan to unlock, then ride solo, since SCOOTY vehicles are for one rider only and never on sidewalks.",
          "Watch the zone colours and dismount and walk where required, such as at a pedestrian crossing.",
          "When you are done, use the app to find a designated parking zone, park the vehicle upright without blocking the path, and upload a photo to end your ride. Parking is free at designated zones, and non-compliant parking can mean a penalty fee."
        ]
      },
      {
        "type": "paragraph",
        "text": "That is really all it takes. Open the app, let the map point you toward the water, the trails, or the downtown lights, and let the evening do the rest. The best summer route is the one that fits your mood tonight, and with SCOOTY it is always just a scan away. Your city, your ride."
      }
    ]
  },
  {
    "id": "park-like-a-pro",
    "stop": "Stop 02",
    "category": "Rider Tips",
    "title": "How to Park Like a Pro",
    "excerpt": "A simple guide to ending your ride properly without blocking sidewalks, entrances, or making the city hate scooters.",
    "readTime": "3 min read",
    "date": "May 28, 2026",
    "author": "Rider Experience",
    "image": "/assets/Riders/Carousel/riders-carousel-parking.webp",
    "body": [
      {
        "type": "paragraph",
        "text": "A great ride deserves a great ending. How you park your SCOOTY matters just as much as how you ride it, because a vehicle left in the wrong spot can block a sidewalk, frustrate pedestrians, and give shared mobility a bad name. The good news? Parking like a pro is genuinely simple once you know the rules, and SCOOTY builds most of them right into the app."
      },
      {
        "type": "paragraph",
        "text": "Here's how to wrap up every trip cleanly, keep your city happy, and make sure your ride actually ends the way it should."
      },
      {
        "type": "heading",
        "text": "Park in three easy steps"
      },
      {
        "type": "paragraph",
        "text": "Ending a ride properly comes down to a short, repeatable routine. You can park a SCOOTY vehicle in three easy steps."
      },
      {
        "type": "list",
        "ordered": true,
        "items": [
          "Find a designated parking zone using the map in the SCOOTY app.",
          "Park the vehicle upright on its kickstand so it is stable.",
          "Take a photo of the SCOOTY parked properly to confirm and end your ride."
        ]
      },
      {
        "type": "paragraph",
        "text": "Once proper parking is confirmed, the ride will end. Designated Parking Zones show up on the map with a blue outline and a blue 'P', and you may spot bike racks, parking mats, or ground tape marking the exact spot. Best of all, parking is free at designated zones."
      },
      {
        "type": "heading",
        "text": "Know your zones before you stop"
      },
      {
        "type": "paragraph",
        "text": "SCOOTY uses geofencing to manage where you can ride and park, so checking the map saves you time and hassle. A Blue zone indicates Designated Parking, while a Purple zone indicates Mandatory Parking. Red zones are No Riding/No Parking Zones, so never end a trip there. In some cities, like Barrie, the program is hub-based and all rides start and end at the same spot, while others such as Brampton offer dockless parking options in select areas. When in doubt, the app always shows you the current zones."
      },
      {
        "type": "heading",
        "text": "Park courteously, every time"
      },
      {
        "type": "paragraph",
        "text": "Even inside the right zone, where you place the vehicle makes the difference between helpful and annoying. A few simple habits keep things tidy for everyone."
      },
      {
        "type": "list",
        "items": [
          "Park the vehicle upright and never block the sidewalk, pathway, or trail.",
          "At parking areas along roadways, place the device between the curb and the sidewalk.",
          "Never block a path of travel, ramp, stairway, or doorway.",
          "Don't park at your home or any private residence.",
          "If a parking station is full, look for another station nearby."
        ]
      },
      {
        "type": "tip",
        "text": "Need to make a quick stop without ending your ride? Use the pause button in the app instead. Find a designated parking zone, or if there isn't one, pull off the pathway, stand the vehicle upright and stable on its kickstand, and press pause. Your ride stays active and ready when you are."
      },
      {
        "type": "heading",
        "text": "Why it pays to park right"
      },
      {
        "type": "paragraph",
        "text": "Parking properly isn't just good manners, it's part of the rules. Non-compliant parking may be subject to parking penalty fees, so taking ten extra seconds to position the vehicle well is always worth it. Designated parking zones also keep vehicles organized and accessible, which means the next rider can find a SCOOTY quickly, and the whole program stays welcome in your city."
      },
      {
        "type": "paragraph",
        "text": "Master the three steps, glance at the map, and park with a little courtesy, and you'll end every trip like a pro. Your City, Your Ride, parked the right way."
      }
    ]
  },
  {
    "id": "helmet-hair",
    "stop": "Stop 03",
    "category": "Safety",
    "title": "Helmet Hair Is Temporary. Safety Is Forever.",
    "excerpt": "Why wearing a helmet is the easiest way to ride smart and still look like you know what you’re doing.",
    "readTime": "2 min read",
    "date": "May 24, 2026",
    "author": "Safety Team",
    "image": "/assets/Riders/Carousel/riders-carousel-safety.webp",
    "body": [
      {
        "type": "paragraph",
        "text": "Let's be honest: nobody loves the way a helmet rearranges their hair. But here's the trade-off worth keeping in mind every time you grab a SCOOTY: the flat spot fixes itself in about ten seconds, and a helmet does its job in the one moment you'll never see coming. At SCOOTY, riding with safety and confidence using the latest technology is the whole point, and a helmet is the simplest, lowest-effort piece of that picture."
      },
      {
        "type": "paragraph",
        "text": "The good news is that wearing one isn't a judgement call you have to agonize over before every trip. SCOOTY's rules make it clear, and once it's part of your routine, it stops feeling like a decision at all."
      },
      {
        "type": "heading",
        "text": "What the rules actually say"
      },
      {
        "type": "paragraph",
        "text": "SCOOTY keeps this straightforward. Riders must wear a helmet at all times, and there are specific legal requirements layered on top depending on what you're riding and how old you are:"
      },
      {
        "type": "list",
        "items": [
          "All SCOOTY riders should wear a safety helmet when riding.",
          "By law, all e-scooter riders under 18 must wear a helmet.",
          "By law, all e-bike riders of all ages must wear a helmet.",
          "You must be 16 years or older to ride a SCOOTY in the first place."
        ]
      },
      {
        "type": "paragraph",
        "text": "Notice the e-bike rule has no age exemption. If you're on a SCOOTY e-bike, the helmet goes on, full stop. It's the one rule that applies to everyone, every ride."
      },
      {
        "type": "tip",
        "text": "Heading to Markham? SCOOTY provides helmets there alongside its dual-vehicle fleet of e-scooters and e-bikes, so a forgotten helmet is no excuse to skip the safe choice."
      },
      {
        "type": "heading",
        "text": "Make it part of the unlock"
      },
      {
        "type": "paragraph",
        "text": "The easiest way to never ride without a helmet is to fold it into the routine you already follow. When you unlock a SCOOTY, the app reminds you not to forget your helmet and to ride safely. Treat that prompt as your cue:"
      },
      {
        "type": "list",
        "ordered": true,
        "items": [
          "Find a SCOOTY using the map in the app.",
          "Scan to view pricing and unlock the vehicle.",
          "Put your helmet on before you flick back the kickstand.",
          "Push forward to gain momentum, then pedal or use the throttle to get going."
        ]
      },
      {
        "type": "paragraph",
        "text": "Build it into that sequence and the helmet stops being an afterthought. It becomes step three, every single time, the same way scanning the QR code is."
      },
      {
        "type": "heading",
        "text": "A helmet is teamwork, not the whole team"
      },
      {
        "type": "paragraph",
        "text": "A helmet protects you, but smart riding keeps you out of the situations where it matters most. SCOOTY's rules are there for exactly that reason: don't ride on sidewalks, never ride under the influence of alcohol or drugs, keep it to one rider per vehicle, and dismount and walk where required, such as at a pedestrian crossing or anywhere a sign tells you to. Riding is permitted on roads with a speed limit of 50 km/h or below, or on higher-speed roads only where a bike lane, cycle track, or multi-use path is available."
      },
      {
        "type": "paragraph",
        "text": "SCOOTY's technology has your back here too. Geofencing enforces slow-speed zones and no-riding areas automatically, and every vehicle tops out at 20 km/h, with built-in safety features and front and rear brakes to help you stop when you need to. The helmet covers the gap that technology can't, which is why it stays on."
      },
      {
        "type": "paragraph",
        "text": "So go ahead and accept the helmet hair. It brushes out in seconds, and looking like you know what you're doing is mostly about riding like you do: helmeted, in the right lane, one person per ride, following the local rules in your city. That's not just safer, it's the look of someone who's clearly done this before. Your city, your ride. Wear the helmet."
      }
    ]
  },
  {
    "id": "behind-the-scenes",
    "stop": "Stop 04",
    "category": "Behind SCOOTY",
    "title": "Behind the Scenes: How SCOOTY Builds and Operates Every Ride",
    "excerpt": "A look at the hardware, safety features, swappable batteries, and operations that keep every SCOOTY ready for the city.",
    "readTime": "5 min read",
    "date": "May 19, 2026",
    "author": "Operations",
    "image": "/assets/Riders/Carousel/riders-carousel-vehicles.webp",
    "body": [
      {
        "type": "paragraph",
        "text": "When you scan a SCOOTY and roll off down the street, the experience feels effortless. But getting a vehicle ready for the city is the result of careful work behind the scenes, where hardware, software, and operations all come together. SCOOTY integrates hardware, software, operations, and planning to deliver complete micromobility programs, so every ride is backed by more than just a vehicle on a curb."
      },
      {
        "type": "paragraph",
        "text": "Here is a look at what goes into making each SCOOTY e-scooter and e-bike ready to roll, from the way the vehicles are built to how they stay charged, organized, and safe on the road."
      },
      {
        "type": "heading",
        "text": "Built with safety in the hardware"
      },
      {
        "type": "paragraph",
        "text": "A lot of what keeps a SCOOTY ready for the city is engineered right into the vehicle. SCOOTY e-scooters and e-bikes are designed to be seen and to stop reliably, with safety features built into every unit:"
      },
      {
        "type": "list",
        "items": [
          "A high-contrast black-on-yellow, high-visibility livery and reflective vinyl wrap so the vehicle stands out in all conditions",
          "High-visibility LED lights, including a day-time LED headlight, plus front and rear running lights that keep riders visible day and night",
          "Turn signals with visual and audio alerts",
          "Double hand braking systems with front and rear brakes for reliable stopping power",
          "Dual shock suspension and an anti-slip foot grip pad for a steadier ride",
          "Concealed and protected cables, plus a built-in fast wireless phone charger"
        ]
      },
      {
        "type": "heading",
        "text": "Power that keeps the fleet moving"
      },
      {
        "type": "paragraph",
        "text": "Keeping vehicles charged is one of the biggest jobs in running a shared fleet. SCOOTY vehicles use swappable batteries designed for operational efficiency and reduced vehicle downtime. Because batteries can be swapped rather than tethered to a charger for hours, more of the fleet stays available for riders. SCOOTY's electric fleet is made up of zero-emission vehicles powered by these swappable battery systems, so every ready-to-ride SCOOTY is also an emission-free one. The SCOOTY e-scooter has a range of up to 70 km and the e-bike up to 100 km, giving riders plenty of room before a battery needs attention."
      },
      {
        "type": "heading",
        "text": "Smart zones and tidy parking"
      },
      {
        "type": "paragraph",
        "text": "Getting a vehicle ready is not only about the hardware. It is also about where and how it operates. SCOOTY uses advanced geofencing and speed control technology that enforces speed limits and safe zones automatically, and every vehicle is GPS tracked. That technology is what powers the colour-coded zones you see on the map in the app:"
      },
      {
        "type": "list",
        "items": [
          "Green zones are the regular riding area, with a maximum speed of 20 km/h",
          "Yellow zones are slow-speed zones, capped at 15 km/h for parks, trails, and high-pedestrian areas",
          "Red zones are no-riding and no-parking areas, set to 0 km/h",
          "Blue zones mark designated parking, where you end your ride"
        ]
      },
      {
        "type": "paragraph",
        "text": "SCOOTY uses designated parking zones to keep vehicles organized and accessible, so the next rider can always find one. That is part of why a ride ends with parking the vehicle upright in a designated zone and uploading a photo to confirm it is parked properly."
      },
      {
        "type": "tip",
        "text": "Doing your part is easy: park upright in a designated zone shown in the app, and never block a sidewalk, pathway, ramp, doorway, or trail. Tidy parking keeps every vehicle ready for the next rider, and non-compliant parking may be subject to parking penalty fees."
      },
      {
        "type": "heading",
        "text": "An operation built for Canadian cities"
      },
      {
        "type": "paragraph",
        "text": "Behind every SCOOTY is a 100% Canadian company headquartered in Brampton, Ontario, with vehicles and technology built for Canadian winters and cities. SCOOTY's programs are guided by Vision Zero principles to help cities build safer streets, and the team brings decades of combined experience in urban planning, civil engineering, transportation policy, mobility operations, and community development. All of that planning is what turns a parked vehicle into a dependable part of how a city moves."
      },
      {
        "type": "paragraph",
        "text": "So the next time you unlock a SCOOTY and ride off in seconds, you can trust there is a whole operation behind it, keeping the fleet charged, visible, safe, and ready for your city."
      }
    ]
  },
  {
    "id": "local-spots",
    "stop": "Stop 05",
    "category": "Local Spots",
    "title": "How to Find the Best Weekend Spots to Scoot To",
    "excerpt": "Coffee, food, parks, and waterfront paths feel better on two wheels. Here's how to use the SCOOTY app to find and reach them this weekend.",
    "readTime": "4 min read",
    "date": "May 15, 2026",
    "author": "City Team",
    "image": "/assets/Cities/Burlington/burlington-hero.webp",
    "body": [
      {
        "type": "paragraph",
        "text": "Some weekends are made for wandering. A coffee on a patio, a walk through a park, a slow loop along the water, a bite somewhere you've been meaning to try. The catch is usually the same: the last stretch between transit and the place you actually want to be. That's exactly the gap SCOOTY is built to close, turning a short hop into part of the fun rather than a chore."
      },
      {
        "type": "paragraph",
        "text": "Instead of naming spots we can't promise are near you, here's something more useful: how to use the SCOOTY app to find the weekend destinations worth scooting to in your own city, and how to get there comfortably on an e-scooter or e-bike. SCOOTY operates across Ontario, Canada, with programs in Brampton, Barrie, Markham, and Burlington, so the right places are already within reach."
      },
      {
        "type": "heading",
        "text": "Coffee and food: let the map do the planning"
      },
      {
        "type": "paragraph",
        "text": "The best weekend ride starts in the app. Open the SCOOTY app and check the map to see nearby vehicles, riding zones, and parking. Pair that with a destination you've had your eye on, and you have a plan in minutes. Setup is quick too, taking about two minutes to get started, and getting rolling is simple:"
      },
      {
        "type": "list",
        "ordered": true,
        "items": [
          "Download the SCOOTY app, create an account, and add your preferred payment method.",
          "Find a SCOOTY nearby using the map in the app.",
          "Scan the QR code (or type the vehicle ID) to view pricing and unlock.",
          "Put on your helmet, ride safely, and follow your local rules."
        ]
      },
      {
        "type": "paragraph",
        "text": "When you arrive, end your ride at a designated parking zone, marked with a blue outline and a blue 'P' on the map. Parking is free at designated zones, so a coffee run or a leisurely brunch doesn't come with a parking headache."
      },
      {
        "type": "heading",
        "text": "Parks and trails: ride a little slower, enjoy a little more"
      },
      {
        "type": "paragraph",
        "text": "Parks, trails, and high-pedestrian areas are some of the best weekend destinations, and SCOOTY is set up to keep them pleasant for everyone. These are slow-speed (yellow) zones where the speed limit drops to 15 km/h, while regular riding zones top out at 20 km/h. The app shows these zones on the map so you always know where to ease off. In Brampton, for example, slow-speed geofenced zones are in place across major parks and trails."
      },
      {
        "type": "heading",
        "text": "Waterfront and scenic routes"
      },
      {
        "type": "paragraph",
        "text": "If your idea of a perfect weekend is open air and a view, look for scenic corridors. In Barrie, SCOOTY's e-bikes are purpose-built for trail and recreational riding along the waterfront corridor on Kempenfelt Bay and the Barrie trail system, with rides starting and ending at Centennial Park. In Burlington, e-scooters run along the 7 km Centennial Trail corridor, one of the city's primary active transportation routes, with designated parking zones at trail access points. These are made for unhurried weekend exploring."
      },
      {
        "type": "tip",
        "text": "Heading somewhere new on a longer scenic ride? Choose the e-bike, which has a range of up to 100 km and is suited for longer rides and mixed terrain. By law, all e-bike riders of all ages must wear a helmet."
      },
      {
        "type": "heading",
        "text": "Make a day of it with transit"
      },
      {
        "type": "paragraph",
        "text": "The real magic of a weekend out is stitching trips together. SCOOTY is designed for the first and last mile, connecting you from your door to a transit stop and from the stop to wherever you're headed. Rides connect with networks like Brampton Transit and Zum, YRT/Viva in Markham, and GO Transit stations across the region, so a coffee, a park, and a riverside stroll can all be one smooth outing."
      },
      {
        "type": "paragraph",
        "text": "Before you set off this weekend, a quick refresher: you must be 16 or older, wear a helmet, ride one person per vehicle, stay off sidewalks, and never ride under the influence. Beyond that, open the app, pick a spot, and let the ride be half the fun. Your city, your ride."
      }
    ]
  },
  {
    "id": "new-parking-zones",
    "stop": "Stop 06",
    "category": "City Updates",
    "title": "How SCOOTY Parking Zones Keep Sidewalks Clear",
    "excerpt": "A quick look at how SCOOTY parking zones keep sidewalks clear and make every ride easy to find.",
    "readTime": "3 min read",
    "date": "May 11, 2026",
    "author": "SCOOTY Editorial",
    "image": "/assets/Riders/Carousel/riders-carousel-map.webp",
    "body": [
      {
        "type": "paragraph",
        "text": "One of the simplest things that makes shared mobility work well in a city is good parking. When vehicles are tidy and predictable, sidewalks stay clear, the next rider can find a ride fast, and neighbourhoods stay happy to have SCOOTY around. That is exactly what SCOOTY's designated parking zones are built to do."
      },
      {
        "type": "paragraph",
        "text": "If you are new to SCOOTY, here is the good news: parking is simple, it is free at designated zones, and the SCOOTY app shows you exactly where to go. SCOOTY's live riding-zone map is coming soon, so for now the best place to check current zones is always the SCOOTY app itself."
      },
      {
        "type": "heading",
        "text": "What a Parking Zone Looks Like"
      },
      {
        "type": "paragraph",
        "text": "SCOOTY uses geofencing technology, which includes no-riding and no-parking zones along with slow-speed zones. Designated parking zones are also shown in the app, and they are easy to spot."
      },
      {
        "type": "list",
        "items": [
          "Parking zones are shown with a blue outline and a blue \"P\" on the map in the SCOOTY app.",
          "On the map, a Blue zone indicates Designated Parking, and a Purple zone indicates Mandatory Parking.",
          "On the ground, a designated parking zone may have bike racks, parking mats, or ground tape to guide you.",
          "Parking zones carry a speed of 0 km/h."
        ]
      },
      {
        "type": "heading",
        "text": "How to Park in Three Easy Steps"
      },
      {
        "type": "paragraph",
        "text": "Ending your ride well takes just a few moments. You can park a SCOOTY vehicle in three easy steps:"
      },
      {
        "type": "list",
        "ordered": true,
        "items": [
          "Use the app to find a designated parking zone nearby.",
          "Park the vehicle upright and pull it onto the kickstand so it is stable.",
          "Swipe right in the app and upload a photo of the SCOOTY parked properly. When proper parking is confirmed, your ride will end."
        ]
      },
      {
        "type": "tip",
        "text": "If the parking station you are heading to is full, don't worry. Just look for another station nearby."
      },
      {
        "type": "heading",
        "text": "Parking Courtesy That Keeps Sidewalks Clear"
      },
      {
        "type": "paragraph",
        "text": "A few simple habits keep shared streets working for everyone, riders and pedestrians alike. When you finish a ride, keep these in mind:"
      },
      {
        "type": "list",
        "items": [
          "Park the vehicle upright and don't block the sidewalk, pathway, or trail.",
          "At parking areas along roadways, park the device between the curb and the sidewalk.",
          "Never block a path of travel, ramp, stairway, or doorway.",
          "Don't park in a no-riding or no-parking zone, and never park at your home or any private residence."
        ]
      },
      {
        "type": "paragraph",
        "text": "Parking outside the rules can lead to parking penalty fees, so it pays to take the extra few seconds to finish in a designated zone. Need a quick break mid-trip instead of ending your ride? You can pause it: find a designated parking zone (or, if there isn't one, park off the pathway), pull the vehicle up on the kickstand so it is upright and stable, and press the pause button in the app."
      },
      {
        "type": "paragraph",
        "text": "Parking zones are a small detail that make a big difference. They keep sidewalks clear, help the next rider find a ride quickly, and keep SCOOTY a welcome part of the neighbourhoods we serve across Ontario. Open the app, check the map, and you'll always know exactly where to leave your ride."
      }
    ]
  },
  {
    "id": "after-class-ride",
    "stop": "Stop 07",
    "category": "City Guides",
    "title": "The 20-Minute After-Class Ride",
    "excerpt": "A short route idea for students who want fresh air, food, and a reset before heading home.",
    "readTime": "3 min read",
    "date": "May 6, 2026",
    "author": "City Team",
    "image": "/assets/Riders/Carousel/riders-carousel-ride.webp",
    "body": [
      {
        "type": "paragraph",
        "text": "The lecture is over, your brain is full, and home still feels a long way off. Instead of going straight from desk to couch, a short ride can be the reset you didn't know you needed: a little fresh air, a stop for food, and a clear head before the evening. With SCOOTY, that twenty-minute window between class and home is easy to fill, because every ride is built around the SCOOTY app, your city, and a few simple rules."
      },
      {
        "type": "paragraph",
        "text": "SCOOTY is a Canadian mobility company that serves communities across Ontario, with on-demand e-scooters and e-bikes you can unlock right from your phone. Some campuses know SCOOTY well already: Toronto Metropolitan University and Ontario Tech University are both SCOOTY academic partners. Here's how to turn the walk to the parking lot into a genuinely good after-class loop."
      },
      {
        "type": "heading",
        "text": "Get rolling in about two minutes"
      },
      {
        "type": "paragraph",
        "text": "If this is your first SCOOTY ride, setup takes roughly two minutes and the getting-started flow is just four steps. You'll need to be 16 or older to ride."
      },
      {
        "type": "list",
        "ordered": true,
        "items": [
          "Download the SCOOTY app and create an account.",
          "Add your preferred payment method.",
          "Open the map in the app to find a vehicle nearby.",
          "Scan the QR code to view pricing, unlock, and ride."
        ]
      },
      {
        "type": "paragraph",
        "text": "Choose what fits your mood and distance: a throttle-controlled e-scooter is lightweight and ideal for short urban trips, while a pedal-assist e-bike suits longer rides and mixed terrain. Both come with a top speed of up to 20 km/h, GPS tracking, front and rear brakes, and even a fast wireless phone charger for the ride."
      },
      {
        "type": "heading",
        "text": "Plan a loop using the map's zones"
      },
      {
        "type": "paragraph",
        "text": "The best after-class route is the one you build yourself, and the SCOOTY app map does the heavy lifting. It shows the speed-control riding zones and the parking zones so you can string together a relaxed loop. Use the colours as your guide:"
      },
      {
        "type": "list",
        "items": [
          "Clear (green) zones are regular riding with a 20 km/h limit, good for covering ground between campus and a food stop.",
          "Yellow zones are slow-speed at 15 km/h, made for parks, trails, and busy pedestrian areas, perfect for the fresh-air part of your ride.",
          "Red zones are no-riding/no-parking at 0 km/h, so plan your turns around them.",
          "Blue zones are designated parking, and purple zones are mandatory parking, where you'll end your trip."
        ]
      },
      {
        "type": "paragraph",
        "text": "A simple formula: ride a clear zone toward a spot to eat, ease through a slow-speed zone for the scenic stretch, and finish at a parking zone near your transit connection home. Because SCOOTY supports first- and last-mile commuter connectivity, you can wrap the ride at a station and roll straight into the rest of your evening."
      },
      {
        "type": "tip",
        "text": "Pausing for food? Use the app to pause your ride. Find a designated parking zone, or if there isn't one, pull off the pathway, set the vehicle upright and stable on its kickstand, and press pause in the app. Your SCOOTY waits while you do."
      },
      {
        "type": "heading",
        "text": "Park it right and ride safe"
      },
      {
        "type": "paragraph",
        "text": "Ending well is part of a smooth ride. Parking is free at designated zones and only takes three steps: find a parking zone in the app, park the vehicle upright, and take a photo to confirm. Park it standing tall without blocking the sidewalk, pathway, or any doorway, and never leave it at home or a private residence, non-compliant parking can mean a penalty fee."
      },
      {
        "type": "list",
        "items": [
          "Wear a helmet, by law all e-bike riders and e-scooter riders under 18 must.",
          "Keep to roads with a 50 km/h limit or lower, and skip the sidewalks.",
          "One rider per vehicle, never ride under the influence, and follow your city's local rules."
        ]
      },
      {
        "type": "paragraph",
        "text": "That's the whole loop: unlock, ride a little fresh air, grab a bite, and park near your way home, all in about the time it takes to scroll your phone on the bus. So next time class lets out, don't beeline for home. Open the app, pick a zone, and give yourself twenty minutes to reset. Your city, your ride."
      }
    ]
  },
  {
    "id": "first-ride",
    "stop": "Stop 08",
    "category": "Rider Tips",
    "title": "First Ride? Start Here.",
    "excerpt": "Everything a new rider should know before unlocking their first SCOOTY.",
    "readTime": "4 min read",
    "date": "May 1, 2026",
    "author": "Rider Experience",
    "image": "/assets/Cities/Markham/markham-hero.webp",
    "body": [
      {
        "type": "paragraph",
        "text": "Your first SCOOTY ride should feel easy from the moment you open the app. SCOOTY offers shared e-scooters and e-bikes so you can ride through your city, and the whole getting-started process is built to be beginner-friendly. Before you unlock your first vehicle, here is everything a new rider needs to know."
      },
      {
        "type": "paragraph",
        "text": "First things first: you need to be 16 years or older to ride with SCOOTY, and every ride is accessed through the SCOOTY app. Setup takes only about 2 minutes, and if it is your first time, it is worth learning how to ride before your first trip so you feel confident from the start."
      },
      {
        "type": "heading",
        "text": "Getting set up"
      },
      {
        "type": "paragraph",
        "text": "The getting-started flow has four steps, and you can be riding within seconds of finishing. Here is the order:"
      },
      {
        "type": "list",
        "ordered": true,
        "items": [
          "Download the SCOOTY app, available on iOS and Android (the App Store and Google Play).",
          "Create your account.",
          "Add your preferred payment method.",
          "Find vehicles using the map in the app, then scan and ride."
        ]
      },
      {
        "type": "heading",
        "text": "Unlocking and starting your ride"
      },
      {
        "type": "paragraph",
        "text": "Once you have found a vehicle on the map, the ride itself is simple. To start a SCOOTY:"
      },
      {
        "type": "list",
        "ordered": true,
        "items": [
          "Scan the QR code, or type the vehicle ID number into the app, to view pricing and unlock the vehicle.",
          "Put on your helmet and don't forget it.",
          "Hold the vehicle firmly and push it forward to flick the kickstand back.",
          "Push forward to gain momentum, then start pedalling on an e-bike or use the throttle on an e-scooter to increase your speed."
        ]
      },
      {
        "type": "tip",
        "text": "Helmets matter, and the law is clear: all e-scooter riders under 18 must wear a helmet, and all e-bike riders of every age must wear one. When in doubt, put a helmet on for every ride."
      },
      {
        "type": "heading",
        "text": "Know your zones"
      },
      {
        "type": "paragraph",
        "text": "SCOOTY uses geofencing to keep riders and communities safe, and you can check the map in the app to see the different riding and parking zones. The maximum speed in SCOOTY riding zones is 20 km/h. Here is what the colours mean:"
      },
      {
        "type": "list",
        "items": [
          "Green (clear) zones: the regular riding zone, with a maximum speed of 20 km/h.",
          "Yellow zones: slow-speed zones for parks, trails, and high-pedestrian areas, with a maximum speed of 15 km/h.",
          "Red zones: no-riding and no-parking zones, with a speed of 0 km/h.",
          "Blue zones: designated parking, shown with a blue outline and a blue 'P' on the map.",
          "Purple zones: mandatory parking."
        ]
      },
      {
        "type": "heading",
        "text": "The rules that keep everyone safe"
      },
      {
        "type": "paragraph",
        "text": "A few ground rules apply everywhere you ride. Keep these in mind and you will be a courteous, confident rider:"
      },
      {
        "type": "list",
        "items": [
          "Riding on sidewalks is not allowed; ride on roads with a speed limit of 50 km/h or below, or use a bike lane, cycle track, or multi-use path on faster roads.",
          "SCOOTY vehicles are for one rider only, so no double joyriding.",
          "Never ride under the influence of alcohol or drugs.",
          "Dismount and walk the vehicle where required, such as at a pedestrian crossing or where a sign says to.",
          "Be responsible and follow the local rules in your city."
        ]
      },
      {
        "type": "heading",
        "text": "Ending your ride and parking"
      },
      {
        "type": "paragraph",
        "text": "Parking is free at designated zones, and ending a ride takes just a few steps. Use the app to find a designated parking zone, park the vehicle upright without blocking the sidewalk, pathway, or trail, pull it up on the kickstand, swipe right in the app, and upload a photo of the vehicle properly parked. When proper parking is confirmed, your ride ends. Avoid parking in no-riding or no-parking zones or at any private residence, since non-compliant parking may be subject to penalty fees. If a parking station is full, simply look for another nearby."
      },
      {
        "type": "paragraph",
        "text": "That's everything you need for a smooth first ride. SCOOTY is built to let you ride with safety and confidence using the latest technology, so download the app, pick your vehicle, and enjoy your city. Your City, Your Ride."
      }
    ]
  }
];
