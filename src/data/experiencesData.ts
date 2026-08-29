import { ExperienceItem } from '../types';

export const EXPERIENCES: ExperienceItem[] = [
  // ================= ADVENTURE =================
  {
    id: 'udaipur-vintage-boat-sunset',
    name: 'Royal Mewar Solar Yacht & Island Sunset Cruise',
    category: 'Adventure',
    location: 'Lake Pichola, Udaipur, Rajasthan, India',
    country: 'India',
    region: 'India',
    destinationId: 'udaipur',
    shortDescription: 'Sail along the mirrored waters of Lake Pichola past Jag Mandir on a private royal solar yacht with bespoke Mewari hors d’oeuvres.',
    description: 'Drift along the shimmering waters of Lake Pichola in a handcrafted royal solar yacht. Glide past the majestic facade of City Palace, Jag Niwas (Lake Palace), and Mohan Mandir as the sun sets behind the rugged Aravalli ranges. Step ashore on Jag Mandir Island for a private torchlit cocktail reception and live classical sitar melodies.',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
    cinematicImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=2400&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80'
    ],
    estimatedPrice: '₹7,500 per guest',
    duration: '3 Hours (Sunset)',
    highlights: [
      'Private eco-solar yacht cruise across Lake Pichola',
      'Champagne and artisanal Mewari treats served on board',
      'Front-row photography views of the illuminated City Palace',
      'Exclusive private landing at the historic Jag Mandir island palace'
    ],
    included: [
      'Private yacht charter & personal boat captain',
      'Chilled champagne & canapés',
      'Heritage island palace entry',
      'Classical live musician accompaniment'
    ],
    bestTime: 'October – March',
    physicalLevel: 'Gentle',
    groupType: 'Private Cruise (Up to 6 guests)',
    rating: 4.98,
    reviewsCount: 194,
    coordinates: { lat: 24.5764, lng: 73.6800 },
    formattedAddress: 'Lake Pichola, Udaipur, Rajasthan 313001, India',
    googleMapsUri: 'https://maps.google.com/?q=Lake+Pichola+Udaipur'
  },
  {
    id: 'kerala-backwaters-kayak-drift',
    name: 'Vembanad Backwaters Kayak & Village Canal Trail',
    category: 'Adventure',
    location: 'Alleppey & Kumarakom, Kerala, India',
    country: 'India',
    region: 'India',
    destinationId: 'kerala',
    shortDescription: 'Navigate narrow emerald canal networks and lotus lagoons in sea kayaks, engaging with generational coir weavers and toddy tappers.',
    description: 'Venture deep into the serene labyrinth of Kerala’s backwaters beyond where large houseboats can reach. Glide quietly through canopied palm canals in precision touring kayaks. Meet local village artisans making coir rope from coconut husks, observe migratory kingfishers, and enjoy fresh tender coconut water right from village farms.',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
    cinematicImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=2400&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80'
    ],
    estimatedPrice: '₹4,200 per guest',
    duration: '4 Hours (Dawn or Afternoon)',
    highlights: [
      'Access secluded village waterways impassable to motorboats',
      'Guided by a local naturalist & water rescue expert',
      'Visit heritage coir and boat-making cottage workshops',
      'Traditional spiced chai & steamed banana snacks at canal-side shacks'
    ],
    included: [
      'Touring kayak, lightweight carbon paddle & life vest',
      'Certified kayak guide',
      'Waterproof dry bags & hydration kit',
      'Organic village breakfast or tea'
    ],
    bestTime: 'September – March',
    physicalLevel: 'Moderate',
    groupType: 'Small Group (Max 8)',
    rating: 4.97,
    reviewsCount: 165,
    coordinates: { lat: 9.4981, lng: 76.3388 },
    formattedAddress: 'Vembanad Lake, Alleppey, Kerala 688001, India',
    googleMapsUri: 'https://maps.google.com/?q=Vembanad+Lake+Alleppey'
  },
  {
    id: 'ladakh-khardungla-cycle-descent',
    name: 'Khardung La to Nubra Valley Mountain Bike Descent',
    category: 'Adventure',
    location: 'Leh & Nubra Valley, Ladakh, India',
    country: 'India',
    region: 'India',
    destinationId: 'ladakh',
    shortDescription: 'Descend from one of the highest motorable mountain passes in the world (17,982 ft) through dramatic Himalayan gorges.',
    description: 'Begin at the dizzying summit of Khardung La Pass surrounded by prayer flags and glacier peaks. Gear up with top-tier hydraulic dual-suspension downhill bikes and descend 40 kilometers of winding tarmac through the heart of the Karakoram and Ladakh ranges, terminating in the fertile high-altitude valley of Nubra.',
    image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80',
    cinematicImage: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=2400&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
    ],
    estimatedPrice: '₹8,900 per guest',
    duration: '6 Hours',
    highlights: [
      'Exhilarating 40km downhill gravity descent from 17,982 ft',
      'Backup support vehicle with oxygen cylinders & spare equipment',
      'Scenic stop at ancient Diskit Monastery and cold desert sand dunes',
      'Warm butter tea & Ladakhi momos lunch at riverside camp'
    ],
    included: [
      'Trek / Specialized dual-suspension mountain bike & helmet',
      'Certified Himalayan cycling marshal',
      '4x4 chase vehicle with oxygen support',
      'Gourmet trail lunch & permits'
    ],
    bestTime: 'June – September',
    physicalLevel: 'High Energy',
    groupType: 'Small Group (Max 6)',
    rating: 4.99,
    reviewsCount: 142,
    coordinates: { lat: 34.2787, lng: 77.6047 },
    formattedAddress: 'Khardung La Pass, Ladakh 194101, India',
    googleMapsUri: 'https://maps.google.com/?q=Khardung+La+Pass+Ladakh'
  },
  {
    id: 'hampi-boulder-coracle',
    name: 'Coracle Navigation & Ancient Boulder Trek',
    category: 'Adventure',
    location: 'Hampi, Karnataka, India',
    country: 'India',
    region: 'India',
    destinationId: 'hampi',
    shortDescription: 'Navigate swirling Tungabhadra waters in a handwoven wicker coracle, followed by an archaeologist-guided granite bouldering expedition.',
    description: 'Experience the raw, prehistoric energy of Hampi from two unique perspectives. Begin at sunrise in an artisanal circular coracle boat, gliding gently along the sacred Tungabhadra River beneath towering medieval stone ghats and submerged monoliths. Next, join a certified bouldering expert to traverse the dramatic granite outcrops of Hemakuta and Matanga Hill.',
    image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80',
    cinematicImage: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=2400&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
    ],
    estimatedPrice: '₹4,800 per guest',
    duration: '4.5 Hours (Dawn or Dusk)',
    highlights: [
      'Authentic circular coracle boat cruise along the sacred Tungabhadra River',
      'Private safety-equipped boulder scrambling with certified outdoor naturalists',
      'Exclusive access to unmapped 14th-century cave shrines & stone carvings',
      'Chilled tender coconut refreshments and traditional spiced tea at Matanga summit'
    ],
    included: [
      'Private coracle craft & certified boatman',
      'High-grade bouldering & safety gear',
      'Licensed archaeologist naturalist guide',
      'Gourmet hydration pack & artisanal snacks',
      'All monument and forest transit permits'
    ],
    bestTime: 'October – March',
    physicalLevel: 'Moderate',
    groupType: 'Private / Small Group (Max 6)',
    rating: 4.96,
    reviewsCount: 148,
    coordinates: { lat: 15.3350, lng: 76.4600 },
    formattedAddress: 'Tungabhadra River, Hampi, Karnataka 583239, India',
    googleMapsUri: 'https://maps.google.com/?q=Tungabhadra+River+Hampi'
  },
  {
    id: 'kabini-predator-safari',
    name: 'Nagarhole Deep Jungle Safari & River Patrol',
    category: 'Adventure',
    location: 'Kabini, Karnataka, India',
    country: 'India',
    region: 'India',
    destinationId: 'kabini',
    shortDescription: 'Traverse prime Bengal tiger and black panther territory in an open bespoke 4x4, followed by a silent solar-powered river safari.',
    description: 'Venture into the heart of Nagarhole National Park, legendary home of Asiatic wild elephants, stealthy leopards, and royal Bengal tigers. Accompanied by a veteran wildlife tracker, explore secret jungle corridors in a custom open safari jeep. Conclude with a twilight boat expedition along the Kabini backwaters.',
    image: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1200&q=80',
    cinematicImage: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=2400&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1200&q=80'
    ],
    estimatedPrice: '₹14,500 per guest',
    duration: '6 Hours (Split Dawn & Twilight Drives)',
    highlights: [
      'Exclusive 4x4 open-top vehicle permitted in core wilderness zones',
      'Master naturalist tracker tracking apex predator pugmarks and alarm calls',
      'Sunset solar boat navigation alongside wild elephant herds and marsh crocodiles',
      'Bush breakfast served beside tranquil jungle waterholes'
    ],
    included: [
      'Reserved VIP forest department permits',
      'Dedicated expert naturalist & veteran driver',
      'High-resolution Swarovski spotting scopes',
      'Champagne bush breakfast & sundowner refreshments'
    ],
    bestTime: 'November – May',
    physicalLevel: 'Moderate',
    groupType: 'Private Bespoke Vehicle',
    rating: 4.99,
    reviewsCount: 230,
    coordinates: { lat: 11.9261, lng: 76.2711 },
    formattedAddress: 'Nagarhole National Park, Kabini, Karnataka 571114, India',
    googleMapsUri: 'https://maps.google.com/?q=Nagarhole+National+Park+Kabini'
  },
  {
    id: 'zermatt-glacier-ski-traverse',
    name: 'Matterhorn Glacier Ski & Crevasse Traverse',
    category: 'Adventure',
    location: 'Zermatt, Valais, Switzerland',
    country: 'Switzerland',
    region: 'Europe',
    destinationId: 'swiss-alps',
    shortDescription: 'High-altitude ski mountaineering and glacier traversal under the imposing granite pyramid of the Matterhorn.',
    description: 'Ascend to Europe highest cable car station at 3,883 meters on Matterhorn Glacier Paradise. Bound onto pristine eternal powder with an IFMGA-certified Swiss mountain guide. Navigate through dramatic blue ice seracs, carve down 25 kilometers of uninterrupted alpine slopes, and cross the Italian border into Cervinia for an authentic high-altitude lunch.',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80',
    cinematicImage: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=2400&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=1200&q=80'
    ],
    estimatedPrice: '₹35,000 per guest',
    duration: '7 Hours (Full Day Alpine)',
    highlights: [
      'Ski from Switzerland to Italy on the world longest uninterrupted descent',
      'Certified IFMGA guide with safety beacon and crevasses rescue equipment',
      'Private access to untracked glacier powder fields',
      'Alpine fondue & Valais wine stop at an exclusive mountain rifugio'
    ],
    included: [
      'International Zermatt-Cervinia ski pass',
      'Certified UIAGM / IFMGA Swiss Mountain Guide',
      'Full avalanche safety gear kit (Mammut Barryvox)',
      'Four-course alpine lunch with wine pairing'
    ],
    bestTime: 'December – April',
    physicalLevel: 'High Energy',
    groupType: 'Private (1-4 skiers)',
    rating: 4.97,
    reviewsCount: 89,
    coordinates: { lat: 45.9765, lng: 7.7491 },
    formattedAddress: 'Matterhorn Glacier Paradise, 3920 Zermatt, Switzerland',
    googleMapsUri: 'https://maps.google.com/?q=Matterhorn+Glacier+Paradise+Zermatt'
  },
  {
    id: 'amalfi-private-yacht-faraglioni',
    name: 'Private Riva Yacht Sail & Secret Sea Caves',
    category: 'Adventure',
    location: 'Positano & Capri, Amalfi Coast, Italy',
    country: 'Italy',
    region: 'Europe',
    destinationId: 'amalfi-coast',
    shortDescription: 'Speed along dramatic vertical cliffs in a vintage Italian mahogany yacht, diving into emerald sea grottos and swimming through the Faraglioni arch.',
    description: 'Board a handcrafted Riva Aquarama yacht in Positano for an exhilarating private voyage across the Gulf of Salerno to Capri. Slice through cobalt Mediterranean waves, drop anchor in secluded coves accessible only by sea, and snorkel inside the White and Green Grottos.',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
    cinematicImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=2400&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80'
    ],
    estimatedPrice: '₹43,000 per guest',
    duration: '5 Hours',
    highlights: [
      'Private Riva motor yacht with experienced captain & steward',
      'Anchor in hidden coves for secluded Mediterranean swimming and seabob gliding',
      'Passage through the legendary Faraglioni rock passage of Capri',
      'Complimentary Franciacorta sparkling wine, fresh figs, and mozzarella'
    ],
    included: [
      'Private charter yacht & fuel',
      'Skipper, steward, and snorkeling gear',
      'Gourmet aperitivo & chilled Italian wines',
      'Capri port docking taxes'
    ],
    bestTime: 'May – October',
    physicalLevel: 'Moderate',
    groupType: 'Private Yacht (Up to 6 guests)',
    rating: 4.98,
    reviewsCount: 164,
    coordinates: { lat: 40.6281, lng: 14.4850 },
    formattedAddress: 'Faraglioni Rocks, Capri & Positano, Amalfi Coast, Italy',
    googleMapsUri: 'https://maps.google.com/?q=Faraglioni+Capri+Amalfi'
  },

  // ================= CULTURE =================
  {
    id: 'udaipur-city-palace-curator',
    name: 'Exclusive City Palace Royal Vaults & Fresco Tour',
    category: 'Culture',
    location: 'City Palace, Udaipur, Rajasthan, India',
    country: 'India',
    region: 'India',
    destinationId: 'udaipur',
    shortDescription: 'Step through private Mewar dynasty royal quarters, crystal gallery, and historic armor vaults with an official palace curator.',
    description: 'Unlock 450 years of Mewar royal history with direct access to private halls of the Udaipur City Palace. Walk through Mor Chowk (Peacock Courtyard) with its 5,000 glass mosaic tiles, study priceless 17th-century miniature paintings, and explore the legendary Crystal Gallery commissioned by Maharana Sajjan Singh.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    cinematicImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2400&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80'
    ],
    estimatedPrice: '₹6,200 per guest',
    duration: '3.5 Hours',
    highlights: [
      'Private curator-guided access through royal residential wings',
      'Exclusive viewing of the world-famous F. & C. Osler Crystal collection',
      'Miniature painting masterclass with master artisan in palace atelier',
      'High tea at the Shiv Niwas Palace royal terrace'
    ],
    included: [
      'VIP all-access palace and crystal gallery entry',
      'Personal art historian curator guide',
      'Royal high tea with sparkling refreshments',
      'Chauffeured luxury vintage car transit'
    ],
    bestTime: 'October – March',
    physicalLevel: 'Gentle',
    groupType: 'Private Tour (1-4 guests)',
    rating: 4.99,
    reviewsCount: 210,
    coordinates: { lat: 24.5764, lng: 73.6835 },
    formattedAddress: 'City Palace Complex, Udaipur, Rajasthan 313001, India',
    googleMapsUri: 'https://maps.google.com/?q=City+Palace+Udaipur'
  },
  {
    id: 'mysore-palace-durbar-illumination',
    name: 'Private Mysore Royal Heritage & Durbar Illumination',
    category: 'Culture',
    location: 'Mysore, Karnataka, India',
    country: 'India',
    region: 'India',
    destinationId: 'mysore',
    shortDescription: 'An aristocratic journey through the Indo-Saracenic royal halls of the Wadiyar dynasty with private historian access and 100,000 bulb illumination.',
    description: 'Step into the gilded era of South India most legendary royal kingdom. Accompanied by a court historian, explore the private corridors, ivory-inlaid doors, and stained glass ceilings of Amba Vilas Palace. Stroll through the royal carriage stables and witness the awe-inspiring spectacle as 100,000 golden incandescent bulbs illuminate the grand palace facade against the dark sky.',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
    cinematicImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=2400&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80'
    ],
    estimatedPrice: '₹6,500 per guest',
    duration: '4 Hours (Afternoon to Evening)',
    highlights: [
      'VIP historian-led tour through restricted residential wings of Mysore Palace',
      'Private seating for the magnificent 100,000-bulb palace light-up spectacle',
      'Visit to traditional sandalwood oil distilleries and rosewood inlay ateliers',
      'Royal Mysore Pak tasting prepared with pure ghee at origin sweetmakers'
    ],
    included: [
      'VIP skip-the-line palace permits & shoe storage concierge',
      'Dedicated court historian and cultural guide',
      'Royal palace illumination reserved seating',
      'Private air-conditioned chauffeur vehicle'
    ],
    bestTime: 'October – March',
    physicalLevel: 'Gentle',
    groupType: 'Private Guided Experience',
    rating: 4.97,
    reviewsCount: 182,
    coordinates: { lat: 12.3051, lng: 76.6551 },
    formattedAddress: 'Mysore Palace, Sayyaji Rao Rd, Mysuru, Karnataka 570001, India',
    googleMapsUri: 'https://maps.google.com/?q=Mysore+Palace+Karnataka'
  },
  {
    id: 'kyoto-geisha-tea-ceremony',
    name: 'Gion Ochaya Private Tea Ceremony & Geiko Arts',
    category: 'Culture',
    location: 'Gion District, Kyoto, Japan',
    country: 'Japan',
    region: 'Asia',
    destinationId: 'kyoto',
    shortDescription: 'Step beyond closed traditional sliding doors into a historic 200-year-old teahouse for an exclusive chado tea ritual and shamisen performance.',
    description: 'Enter the secretive, discreet world of Gion karyū (the flower and willow world). Hosted in a heritage 200-year-old machiya teahouse, participate in a formal Chanoyu tea ceremony led by an authentic Grand Master. Learn the delicate choreography of whisking ceremonial Uji matcha before enjoying a private classical dance and shamisen musical performance.',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    cinematicImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=2400&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80'
    ],
    estimatedPrice: '₹21,500 per guest',
    duration: '2.5 Hours',
    highlights: [
      'Exclusive access to an invitation-only traditional Gion Ochaya (teahouse)',
      'Formal Chanoyu matcha preparation with a licensed Urasenke Tea Master',
      'Private classical performance and seasonal dance by a Geiko & Maiko',
      'Cultural etiquette dialogue translated by a bilingual Kyoto cultural envoy'
    ],
    included: [
      'Private teahouse booking & hostess fees',
      'Bilingual expert cultural host',
      'Ceremonial grade Uji matcha & seasonal handcrafted wagashi sweets',
      'Maiko commemorative photography opportunity'
    ],
    bestTime: 'Year-round',
    physicalLevel: 'Gentle',
    groupType: 'Exclusive Private Reservation',
    rating: 4.99,
    reviewsCount: 94,
    coordinates: { lat: 35.0037, lng: 135.7772 },
    formattedAddress: 'Gion District, Higashiyama Ward, Kyoto 605-0074, Japan',
    googleMapsUri: 'https://maps.google.com/?q=Gion+Kyoto+Japan'
  },

  // ================= FOOD & WINE =================
  {
    id: 'kerala-spice-sadya-mastery',
    name: 'Kumarakom Ancestral Spice Trail & 24-Dish Sadya',
    category: 'Food',
    location: 'Kumarakom, Kerala, India',
    country: 'India',
    region: 'India',
    destinationId: 'kerala',
    shortDescription: 'Forage green cardamom and Tellicherry pepper in ancestral spice orchards, followed by a grand traditional 24-course banana leaf feast.',
    description: 'Immerse in the aromatic culinary heartland of God’s Own Country. Walk through century-old spice plantations picking fresh nutmeg, cinnamon bark, and vanilla pods. Under the guidance of a celebrated Kerala master chef, prepare traditional Avial, Thoran, and Payasam in heavy bronze uruli vessels, enjoying the grand 24-item vegetarian Sadya.',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    cinematicImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=2400&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80'
    ],
    estimatedPrice: '₹4,500 per guest',
    duration: '4 Hours',
    highlights: [
      'Guided spice foraging through organic backwater orchards',
      'Hands-on cooking class with heritage brass Uruli cookware',
      'Grand 24-course authentic banana leaf feast with payasam pairings',
      'Take-home jar of fresh single-estate Tellicherry black peppercorns'
    ],
    included: [
      'Master chef culinary class and printed recipe folios',
      'Full 24-course Sadya luncheon',
      'Estate spice gift hamper',
      'Fresh tender coconut welcome drink'
    ],
    bestTime: 'September – April',
    physicalLevel: 'Relaxed',
    groupType: 'Small Group (Max 8)',
    rating: 4.98,
    reviewsCount: 175,
    coordinates: { lat: 9.6176, lng: 76.4301 },
    formattedAddress: 'Kumarakom Spice Orchards, Kottayam, Kerala 686563, India',
    googleMapsUri: 'https://maps.google.com/?q=Kumarakom+Kerala'
  },
  {
    id: 'amalfi-lemon-grove-pasta-atelier',
    name: 'Cliffside Lemon Grove Atelier & Handcrafted Pasta',
    category: 'Food',
    location: 'Ravello & Amalfi Coast, Italy',
    country: 'Italy',
    region: 'Europe',
    destinationId: 'amalfi-coast',
    shortDescription: 'Gather organic Sfusato lemons in a panoramic cliffside terrace, press Limoncello, and knead fresh hand-rolled scialatielli pasta with sea views.',
    description: 'Ascend the terraced slopes of Ravello overlooking the azure Tyrrhenian Sea. Stroll through fragrant groves of giant Sfusato Amalfitano lemons that have grown here since the Maritime Republic era. Under the shade of pergolas, learn the timeless method of rolling handmade scialatielli pasta from scratch and creating delicate lemon-infused cacio e pepe.',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1200&q=80',
    cinematicImage: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=2400&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80'
    ],
    estimatedPrice: '₹16,500 per guest',
    duration: '4 Hours',
    highlights: [
      'Private harvest in historic terraced lemon groves suspended over the sea',
      'Hands-on pasta masterclass with a generational local Italian nonna and chef',
      'Limoncello distillation and tasting of 3 vintage batches',
      'Al fresco cliffside dining with panoramic coastal views and DOC Campania wines'
    ],
    included: [
      'Cooking class instruction, aprons, and recipe folios',
      'Full 4-course lunch prepared during class',
      'Sommelier selected local wines and handcrafted Limoncello',
      'Bottled artisan organic Limoncello keepsake'
    ],
    bestTime: 'April – October',
    physicalLevel: 'Relaxed',
    groupType: 'Private / Intimate (Max 6)',
    rating: 4.99,
    reviewsCount: 204,
    coordinates: { lat: 40.6491, lng: 14.6114 },
    formattedAddress: 'Via Santa Chiara, 84010 Ravello, Salerno, Amalfi Coast, Italy',
    googleMapsUri: 'https://maps.google.com/?q=Ravello+Amalfi+Coast'
  },
  {
    id: 'kyoto-michelin-kaiseki',
    name: 'Private Kamo River Kaiseki & Rare Sake Pairing',
    category: 'Food',
    location: 'Gion & Kamo River, Kyoto, Japan',
    country: 'Japan',
    region: 'Asia',
    destinationId: 'kyoto',
    shortDescription: 'Seasonal 9-course Michelin-starred kaiseki dinner overlooking the Kamo River paired with ultra-rare Junmai Daiginjo sakes.',
    description: 'Experience the pinnacle of Japanese culinary philosophy at an exclusive multi-generation ryotei. Each dish is an exquisite seasonal canvas celebrating the micro-seasons of Japan—featuring grilled sweetfish (Ayu), Kyoto heirloom vegetables (Kyo-yasai), and A5 Wagyu beef. Every course is paired with rare craft sakes hand-selected by an in-house Master of Sake.',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1200&q=80',
    cinematicImage: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=2400&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80'
    ],
    estimatedPrice: '₹24,000 per guest',
    duration: '3 Hours',
    highlights: [
      'Private tatami room overlooking a serene stone garden and the Kamo River',
      'Nine-course kaiseki menu curated by a third-generation master chef',
      'Curated flight of 5 rare single-brewery Junmai Daiginjo sakes',
      'Culinary explanation of the Buddhist washoku concept'
    ],
    included: [
      'Complete 9-course Kaiseki tasting menu',
      'Curated premium sake pairing flight',
      'Private dining room reservation fees',
      'Personal bilingual culinary concierge'
    ],
    bestTime: 'Year-round',
    physicalLevel: 'Relaxed',
    groupType: 'Private Dining (2-6 guests)',
    rating: 4.99,
    reviewsCount: 128,
    coordinates: { lat: 35.0037, lng: 135.7725 },
    formattedAddress: 'Kamo River, Nakagyo Ward, Kyoto 604-8001, Japan',
    googleMapsUri: 'https://maps.google.com/?q=Kamo+River+Kyoto'
  },

  // ================= SIGHTSEEING & AIR =================
  {
    id: 'swiss-alps-heli-flight-glacier',
    name: 'Private Golden Hour Heli-Flight over Alpine Peaks',
    category: 'Sightseeing',
    location: 'Interlaken & Zermatt, Switzerland',
    country: 'Switzerland',
    region: 'Europe',
    destinationId: 'swiss-alps',
    shortDescription: 'Soar past the north face of the Eiger, Mönch, and Matterhorn before a private champagne landing on a high alpine glacier.',
    description: 'Take to the skies in an Airbus H130 helicopter for an unforgettable aerial voyage above the crowned jewels of the Swiss Alps. Fly within arm reach of the sheer Eiger North Face and the turquoise glacial ribbons of Aletsch Glacier—the largest glacier in Europe. Touch down on an untouched high-altitude snowfield for a private champagne toast.',
    image: 'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=1200&q=80',
    cinematicImage: 'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=2400&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80'
    ],
    estimatedPrice: '₹56,000 per guest',
    duration: '1.5 Hours (45 min flight time)',
    highlights: [
      'Close aerial circuits around the Matterhorn and Jungfrau summits',
      'Glacier landing at 3,200m with mountain safety certified alpine pilot',
      'Private Dom Pérignon champagne toast on pristine snow',
      'Bespoke 4K cinematic in-flight video capture'
    ],
    included: [
      'Helicopter charter & certified commercial mountain pilot',
      'Glacier landing permits and eco-offset certificate',
      'Vintage champagne & Swiss artisan chocolates on the glacier',
      'Luxury door-to-helipad transfers'
    ],
    bestTime: 'Year-round (Clear blue winter or golden summer days)',
    physicalLevel: 'Gentle',
    groupType: 'Private Helicopter (Up to 5 guests)',
    rating: 4.99,
    reviewsCount: 118,
    coordinates: { lat: 46.5475, lng: 7.9828 },
    formattedAddress: 'Jungfraujoch Glacier, 3801 Interlaken, Switzerland',
    googleMapsUri: 'https://maps.google.com/?q=Jungfrau+Glacier+Switzerland'
  },
  {
    id: 'santorini-caldera-sunset-cruise',
    name: 'Santorini Caldera Sunset Cruise & Volcanic Springs',
    category: 'Sightseeing',
    location: 'Oia & Caldera, Santorini, Greece',
    country: 'Greece',
    region: 'Europe',
    destinationId: 'santorini',
    shortDescription: 'Sail through the submerged volcano caldera on a luxury catamaran, swim in thermal sulfur springs, and watch the famed Oia sunset.',
    description: 'Set sail from the historic port of Ammoudi aboard a luxury Lagoon catamaran. Cruise past the volcanic Red and White beaches, swimming in the warm, healing sulfur mud baths of Palea Kameni volcano. As dusk approaches, drift into prime position beneath the white-washed cliffside village of Oia.',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
    cinematicImage: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=2400&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80'
    ],
    estimatedPrice: '₹19,500 per guest',
    duration: '5 Hours (Afternoon to Sunset)',
    highlights: [
      'Front-row vantage point for the iconic Oia cliffside sunset',
      'Thermal swim in natural volcanic hot springs of Nea Kameni',
      'Snorkeling around the vibrant underwater reefs of Indian Rock',
      'Freshly grilled Greek seafood and steak buffet prepared on board'
    ],
    included: [
      'Catamaran cruise, skipper and full crew',
      'Fresh gourmet dinner buffet with unlimited Santorini wines',
      'Snorkeling gear & floating aids',
      'Round-trip luxury hotel transfers across Santorini'
    ],
    bestTime: 'April – November',
    physicalLevel: 'Gentle',
    groupType: 'Semi-Private / Private Option (Max 14)',
    rating: 4.97,
    reviewsCount: 310,
    coordinates: { lat: 36.4618, lng: 25.3753 },
    formattedAddress: 'Ammoudi Bay, Oia, Santorini 847 02, Greece',
    googleMapsUri: 'https://maps.google.com/?q=Oia+Caldera+Santorini'
  },

  // ================= WELLNESS =================
  {
    id: 'coorg-ayurveda-sound-sanctuary',
    name: 'Ayurvedic Abhyanga & Western Ghats Sound Healing',
    category: 'Wellness',
    location: 'Coorg, Karnataka, India',
    country: 'India',
    region: 'India',
    destinationId: 'coorg',
    shortDescription: 'A 3-hour holistic rejuvenation ritual featuring four-hand warm herbal oil Abhyanga, Shirodhara, and Tibetan singing bowl sound therapy.',
    description: 'Surrender to the ancient healing traditions of Ayurveda in an open-air forest pavilion overlooking mist-draped coffee hills. Begin with a pulse diagnosis by an Ayurvedic Vaidya doctor, followed by a warm herbal oil Abhyanga synchronized massage performed by two therapists.',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
    cinematicImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=2400&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512290900672-1f03f3922374?auto=format&fit=crop&w=1200&q=80'
    ],
    estimatedPrice: '₹6,800 per guest',
    duration: '3 Hours',
    highlights: [
      'Personal Ayurvedic pulse diagnosis (Nadi Pariksha) by an experienced Vaidya',
      'Synchronized 4-hand warm medicated herbal oil Abhyanga therapy',
      'Authentic Shirodhara stream therapy for deep nervous system relaxation',
      'Acoustic sound bath using 7-metal hand-hammered singing bowls and chimes'
    ],
    included: [
      'Complete 180-minute customized Ayurvedic treatment session',
      'Organic herbal body scrubs and fresh botanical steam bath',
      'Nourishing warm herbal detox concoction & dried fruit platter',
      'Personalized Dosha lifestyle and diet recommendation chart'
    ],
    bestTime: 'Year-round',
    physicalLevel: 'Meditative',
    groupType: 'Individual / Couple Private Suite',
    rating: 4.98,
    reviewsCount: 165,
    coordinates: { lat: 12.4244, lng: 75.7382 },
    formattedAddress: 'Madikeri, Coorg, Karnataka 571201, India',
    googleMapsUri: 'https://maps.google.com/?q=Madikeri+Coorg+Karnataka'
  },
  {
    id: 'gokarna-cliffside-pranic-yoga',
    name: 'Om Beach Cliffside Sunset Yoga & Pranic Breathwork',
    category: 'Wellness',
    location: 'Om Beach, Gokarna, Karnataka, India',
    country: 'India',
    region: 'India',
    destinationId: 'gokarna',
    shortDescription: 'Practice Hatha and Vinyasa yoga on a private clifftop deck overlooking the Om-shaped coastline, guided by a Himalayan master.',
    description: 'Unite breath, body, and ocean rhythm on a secluded clifftop yoga deck in Gokarna. Guided by an experienced yogic master, practice mindful asanas designed to release tension and align energy centers. Conclude as the golden sun sinks into the Arabian Sea with calming Pranayama breathwork.',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
    cinematicImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=2400&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
    ],
    estimatedPrice: '₹2,400 per guest',
    duration: '2 Hours (Sunset)',
    highlights: [
      'Private panoramic clifftop deck with 180-degree Arabian Sea views',
      'Accessible for both beginners and advanced yoga practitioners',
      'Deep calming Pranayama and guided mindfulness meditation',
      'Freshly harvested tender coconuts and organic Ayurvedic herbal infusions'
    ],
    included: [
      'Premium organic cork yoga mats, bolsters, and blocks',
      'Instruction by certified Himalayan yoga master',
      'Sunset herbal tea and fresh coconut refreshment',
      'Complimentary beach meditation audio guide'
    ],
    bestTime: 'October – April',
    physicalLevel: 'Meditative',
    groupType: 'Private / Intimate Group (Max 10)',
    rating: 4.94,
    reviewsCount: 121,
    coordinates: { lat: 14.5173, lng: 74.3168 },
    formattedAddress: 'Om Beach Clifftop, Gokarna, Karnataka 581326, India',
    googleMapsUri: 'https://maps.google.com/?q=Om+Beach+Gokarna'
  },
  {
    id: 'kyoto-forest-bathing-onsen',
    name: 'Kyoto Sacred Forest Bathing (Shinrin-yoku) & Mineral Onsen',
    category: 'Wellness',
    location: 'Kurama & Mount Hiei, Kyoto, Japan',
    country: 'Japan',
    region: 'Asia',
    destinationId: 'kyoto',
    shortDescription: 'Mindful sensory immersion in ancient cedar forests of Kurama mountain followed by private mineral hot spring soaking in cedar baths.',
    description: 'Reclaim inner balance through the scientifically proven art of Shinrin-yoku (forest bathing). Walk mindfully among towering 800-year-old Japanese cedar and cypress trees in the sacred mountains of Kurama. Follow sensory mindfulness invitations that lower cortisol and boost vitality.',
    image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=80',
    cinematicImage: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=2400&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80'
    ],
    estimatedPrice: '₹13,500 per guest',
    duration: '4 Hours',
    highlights: [
      'Guided Shinrin-yoku session led by a certified Japanese Forest Therapy Guide',
      'Private outdoor cedar rotemburo (hot spring onsen) reservation',
      'Mindful tea ceremony among mountain streams',
      'Cedarwood essential oil aromatherapy mist gift'
    ],
    included: [
      'Certified Forest Therapy Guide instruction',
      'Private onsen rental and traditional yukata robes',
      'Forest herb tea and seasonal organic bento snack',
      'Private mountain transit from Central Kyoto'
    ],
    bestTime: 'Year-round',
    physicalLevel: 'Meditative',
    groupType: 'Private (1-4 guests)',
    rating: 4.99,
    reviewsCount: 104,
    coordinates: { lat: 35.1167, lng: 135.7797 },
    formattedAddress: 'Kurama Mountain Sanctuary, Sakyo Ward, Kyoto 601-1111, Japan',
    googleMapsUri: 'https://maps.google.com/?q=Kurama+Kyoto+Japan'
  },

  // ================= NATURE & BENGALURU HIGHLIGHTS =================
  {
    id: 'bengaluru-lalbagh-botanical-dawn',
    name: 'Lalbagh Botanical Heritage & Glass House Floriculture Walk',
    category: 'Nature',
    location: 'Lalbagh Botanical Garden, Bengaluru, Karnataka, India',
    country: 'India',
    region: 'India',
    destinationId: 'bengaluru',
    shortDescription: 'Sunrise walking tour through 240 acres of century-old tropical trees, lotus lagoons, and the iconic Victorian Glass House with an expert botanist.',
    description: 'Breathe in the crisp morning air of the Garden City. Guided by an eminent botanist and landscape historian, wander through 240 acres of rare centuries-old trees commissioned by Hyder Ali and Tipu Sultan. Explore the London Crystal Palace-inspired Glass House, climb the 3,000-million-year-old Lalbagh Rock monolith, and enjoy fresh coconut water under towering silk cotton canopies.',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80',
    cinematicImage: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=2400&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80'
    ],
    estimatedPrice: '₹3,500 per guest',
    duration: '3 Hours (Sunrise)',
    highlights: [
      'Private botanist-led walk through historical flora and ancient bonsai collection',
      'Exclusive morning photography inside the Victorian Glass House',
      'Panoramic 360-degree Bengaluru skyline views from the geological Lalbagh Rock',
      'Traditional South Indian filter coffee & steamed idli breakfast at nearby MTR'
    ],
    included: [
      'VIP garden permits and morning entry',
      'Senior botanist and cultural guide',
      'Botanical field guidebook & macro photo assistance',
      'Authentic heritage South Indian breakfast'
    ],
    bestTime: 'Year-round (Best October – March)',
    physicalLevel: 'Gentle',
    groupType: 'Small Group / Private (Max 8)',
    rating: 4.97,
    reviewsCount: 168,
    coordinates: { lat: 12.9507, lng: 77.5848 },
    formattedAddress: 'Lalbagh Botanical Garden, Mavalli, Bengaluru, Karnataka 560004, India',
    googleMapsUri: 'https://maps.google.com/?q=Lalbagh+Botanical+Garden+Bengaluru'
  },
  {
    id: 'bengaluru-palace-royal-curator',
    name: 'Bangalore Palace Royal Tudor Quarters & Art Archives',
    category: 'Culture',
    location: 'Bangalore Palace, Bengaluru, Karnataka, India',
    country: 'India',
    region: 'India',
    destinationId: 'bengaluru',
    shortDescription: 'Curator-led VIP tour of the 19th-century Tudor-style royal palace, wooden floral carvings, and original Raja Ravi Varma oil paintings.',
    description: 'Explore the grand Tudor and Scottish Gothic castle built by the Wadiyar Maharajas in 1878. Walk through fortified towers, the magnificent Durbar Hall with stained glass, the open Moroccan courtyard with hand-painted ceramic tiles, and private galleries showcasing historic weapons, ceremonial costumes, and rare Ravi Varma canvases.',
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80',
    cinematicImage: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=2400&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80'
    ],
    estimatedPrice: '₹5,800 per guest',
    duration: '3.5 Hours',
    highlights: [
      'Curator-led access into private royal corridors and ballroom galleries',
      'Viewing of rare 19th-century royal portrait collections and crystal chandeliers',
      'Stroll through sprawling royal grounds and equestrian stables',
      'Palace veranda high tea with artisanal Karnataka tea selections'
    ],
    included: [
      'VIP palace skip-the-line entrance tickets',
      'Personal art historian curator guide',
      'Afternoon royal high tea service',
      'Chauffeured luxury city transit'
    ],
    bestTime: 'October – April',
    physicalLevel: 'Gentle',
    groupType: 'Private Tour (1-6 guests)',
    rating: 4.96,
    reviewsCount: 142,
    coordinates: { lat: 12.9988, lng: 77.5921 },
    formattedAddress: 'Bengaluru Palace, Vasanth Nagar, Bengaluru, Karnataka 560052, India',
    googleMapsUri: 'https://maps.google.com/?q=Bangalore+Palace+Bengaluru'
  },
  {
    id: 'bengaluru-heritage-coffee-food-trail',
    name: 'Old Bengaluru Heritage Tiffin & Filter Kaapi Tasting',
    category: 'Food',
    location: 'Basavanagudi & Malleshwaram, Bengaluru, Karnataka, India',
    country: 'India',
    region: 'India',
    destinationId: 'bengaluru',
    shortDescription: 'A guided morning culinary journey tasting iconic crispy Benne Dosas, Kesari Bath, and slow-dripped degree filter coffee at legendary institutions.',
    description: 'Immerse your palate in the authentic culinary legends of Old Bengaluru. Stroll along the tree-lined avenues of Gandhi Bazaar and Basavanagudi, visiting generational eateries operating since the 1920s. Learn the art of frothing filter coffee in brass davarahs, savor crisp golden butter dosas served on plantain leaves, and taste fragrant sandalwood and Mysore pak treats.',
    image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=1200&q=80',
    cinematicImage: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=2400&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80'
    ],
    estimatedPrice: '₹3,200 per guest',
    duration: '3.5 Hours',
    highlights: [
      'Taste authentic Bengaluru Benne Masala Dosa, Rava Idli, and Chow-Chow Bath',
      'Filter coffee brewing demonstration and single-origin Chikmagalur bean tasting',
      'Walk through the flower and spice lanes of historic Gandhi Bazaar',
      'Visit the 16th-century monolithic Bull Temple (Nandi)'
    ],
    included: [
      'All food and specialty beverage tastings at 5 iconic eateries',
      'Expert culinary storyteller & neighborhood guide',
      'Artisanal Chikmagalur ground coffee beans keepsake pack',
      'Private air-conditioned neighborhood transfers'
    ],
    bestTime: 'Year-round',
    physicalLevel: 'Relaxed',
    groupType: 'Small Group / Intimate (Max 8)',
    rating: 4.98,
    reviewsCount: 220,
    coordinates: { lat: 12.9416, lng: 77.5736 },
    formattedAddress: 'Gandhi Bazaar, Basavanagudi, Bengaluru, Karnataka 560004, India',
    googleMapsUri: 'https://maps.google.com/?q=Gandhi+Bazaar+Basavanagudi+Bengaluru'
  },
  {
    id: 'bengaluru-nandi-hills-sunrise-vineyard',
    name: 'Nandi Hills Sea-of-Clouds Dawn & Valley Vineyard Tour',
    category: 'Adventure',
    location: 'Nandi Hills & Chikkaballapur, Greater Bengaluru, Karnataka, India',
    country: 'India',
    region: 'India',
    destinationId: 'bengaluru',
    shortDescription: 'Private dawn excursion to the 4,851-ft fortress peak to witness the morning sea-of-clouds, followed by artisanal wine tasting in the valley.',
    description: 'Depart Bengaluru in the pre-dawn quiet for the scenic granite fortress of Nandi Hills. Watch the crimson sun emerge over rolling blankets of mist from Tipu’s Drop. Descend into the fertile Nandi Valley for a private tour of pioneering Karnataka vineyards, sampling Cabernet Sauvignon and Shiraz alongside artisanal cheese boards.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    cinematicImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2400&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80'
    ],
    estimatedPrice: '₹7,500 per guest',
    duration: '6 Hours (Dawn to Lunch)',
    highlights: [
      'Private sunrise vantage point above the cloud layer at 4,851 ft',
      'Tour of the 1,000-year-old Bhoga Nandeeshwara temple with Dravidian stone carvings',
      'Guided vineyard barrel room tasting of 4 estate reserve wines',
      'Farm-to-table lunch served in the vineyard olive orchard'
    ],
    included: [
      'Chauffeured luxury SUV round-trip from Bengaluru',
      'Hilltop entry & special sunrise permits',
      'Vineyard tour, barrel tasting & 3-course wine-paired lunch',
      'Experienced outdoor naturalist & sommelier'
    ],
    bestTime: 'October – May',
    physicalLevel: 'Moderate',
    groupType: 'Private Vehicle / Small Group (Max 6)',
    rating: 4.99,
    reviewsCount: 178,
    coordinates: { lat: 13.3702, lng: 77.6835 },
    formattedAddress: 'Nandi Hills, Chikkaballapur, Greater Bengaluru, Karnataka 562101, India',
    googleMapsUri: 'https://maps.google.com/?q=Nandi+Hills+Bengaluru'
  },
  {
    id: 'bengaluru-craft-brewery-chef-table',
    name: 'Indiranagar Craft Gastronomy & Microbrewery Trail',
    category: 'Food',
    location: 'Indiranagar & Lavelle Road, Bengaluru, Karnataka, India',
    country: 'India',
    region: 'India',
    destinationId: 'bengaluru',
    shortDescription: 'Explore India’s craft beer capital with a certified cicerone and savor modern South Indian culinary masterclasses at top chef tables.',
    description: 'Discover why Bengaluru is renowned as the craft brewing hub of Asia. Tour bespoke microbreweries with a master brewer tasting Belgian Witbiers, mango IPAs, and stout infused with local Coorg cacao. Conclude with a private 6-course modern South Indian tasting menu crafted by celebrated avant-garde chefs.',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80',
    cinematicImage: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=2400&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80'
    ],
    estimatedPrice: '₹5,500 per guest',
    duration: '4 Hours (Evening)',
    highlights: [
      'Behind-the-scenes brewery fermentation room tour with master brewer',
      'Flight of 5 craft beers paired with artisanal cheeses and bites',
      '6-course modern South Indian dinner at a reserved chef’s table',
      'Boutique cocktail concoctions infused with cardamom and betel leaf'
    ],
    included: [
      'All craft beer flights, pairing bites, and 6-course dinner',
      'Master cicerone culinary host',
      'Reserved VIP seating at premier venues',
      'Private evening chauffeur ride'
    ],
    bestTime: 'Year-round',
    physicalLevel: 'Relaxed',
    groupType: 'Private / Intimate Group (Max 8)',
    rating: 4.97,
    reviewsCount: 156,
    coordinates: { lat: 12.9719, lng: 77.6412 },
    formattedAddress: '100 Feet Road, Indiranagar, Bengaluru, Karnataka 560038, India',
    googleMapsUri: 'https://maps.google.com/?q=Indiranagar+Bengaluru'
  }
];

export const getExperiencesByDestinationId = (destId: string): ExperienceItem[] => {
  return EXPERIENCES.filter(e => e.destinationId === destId);
};
