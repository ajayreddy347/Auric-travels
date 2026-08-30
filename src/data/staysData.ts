import { LuxuryStayItem } from '../types';

export const LUXURY_STAYS: LuxuryStayItem[] = [
  // ================= INDIA SANCTUARIES =================
  {
    id: 'taj-lake-palace-udaipur',
    name: 'Taj Lake Palace, Udaipur',
    tagline: 'Floating 18th-century white marble island palace on shimmering Lake Pichola',
    location: 'Lake Pichola, Udaipur, Rajasthan, India',
    destinationId: 'udaipur',
    destinationName: 'Udaipur & Lake Pichola',
    region: 'India',
    country: 'India',
    rating: 4.99,
    reviewsCount: 520,
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'
    ],
    pricePerNightINR: 1499,
    pricePerNightUSD: 18,
    startingPriceDisplay: '₹1,499 / $18 per night',
    badge: 'Royal Island Palace',
    roomTypes: [
      {
        name: 'Grand Royal Lake Suite',
        description: 'Historic Mewar suite featuring stained-glass archways, antique frescoes, private jharokha balcony over water, and 24-hr royal butler.',
        priceMultiplier: 1.35,
        image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Palace Lake View Chamber',
        description: 'Regal room with direct panoramic view of the City Palace complex illuminated across calm lake waters.',
        priceMultiplier: 1.18,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Luxury Garden Suite',
        description: 'Peaceful marble sanctuary opening directly to Lily Pond courtyards and fragrant jasmine gardens.',
        priceMultiplier: 1.0,
        image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80'
      }
    ],
    amenities: [
      'Private Royal Solar Boat Transfers',
      'Jiva Spa Boat on Lake Pichola',
      'Heritage Historian Palace Tours',
      'Bhairon Rooftop Fine Dining',
      '24-Hour Dedicated Royal Butler Service',
      'High-Speed Wi-Fi'
    ],
    curatedHighlights: [
      'Arrival by royal canopied boat with shower of fresh rose petals',
      'Private twilight candlelit dining at the Mewar Terrace',
      'Exclusive astrological readings and classical santoor recitals in courtyard'
    ]
  },
  {
    id: 'kumarakom-lake-resort',
    name: 'Kumarakom Lake Resort & Heritage Houseboats',
    tagline: 'Manor heritage villas and bespoke solar luxury houseboats on Vembanad Lake',
    location: 'Kumarakom, Backwaters, Kerala, India',
    destinationId: 'kerala',
    destinationName: 'Kerala Backwaters & Wayanad',
    region: 'India',
    country: 'India',
    rating: 4.97,
    reviewsCount: 410,
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80'
    ],
    pricePerNightINR: 1199,
    pricePerNightUSD: 14,
    startingPriceDisplay: '₹1,199 / $14 per night',
    badge: 'Ayurvedic Sanctuary',
    roomTypes: [
      {
        name: 'Private Luxury Kettuvallam Suite',
        description: 'Traditional thatched wooden houseboat with private captain, personal chef, AC bedroom, and open sun deck.',
        priceMultiplier: 1.3,
        image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Heritage Lake Villa with Private Pool',
        description: 'Reconstructed 200-year-old traditional Illam villa with open-to-sky courtyard and plunge pool.',
        priceMultiplier: 1.15,
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Meandering Pool Villa',
        description: 'Direct duplex access to a 250-meter emerald meandering pool weaving past lotus gardens.',
        priceMultiplier: 1.0,
        image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80'
      }
    ],
    amenities: [
      'Ayurmana 200-Year-Old Ayurvedic Center',
      '250-Meter Meandering Pool',
      'Sunset Backwater Cruises with Tea',
      'Ettukettu Multi-Cuisine Restaurant',
      'Traditional Kerala Pottery Workshops'
    ],
    curatedHighlights: [
      'Daily morning yoga on wooden lakeside jetties with mountain breeze',
      'Authentic 5-course Sadya banana leaf lunch with private culinary master',
      'Overnight backwater drift under palm tree constellations'
    ]
  },
  {
    id: 'chamba-camp-thiksey',
    name: 'The Ultimate Travelling Camp - Chamba Camp',
    tagline: 'Glamping under Himalayan peaks with heated luxury canvas suites',
    location: 'Thiksey, Leh-Ladakh, India',
    destinationId: 'ladakh',
    destinationName: 'Ladakh & Pangong Tso',
    region: 'India',
    country: 'India',
    rating: 4.99,
    reviewsCount: 230,
    image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
    ],
    pricePerNightINR: 1299,
    pricePerNightUSD: 16,
    startingPriceDisplay: '₹1,299 / $16 per night',
    badge: 'Himalayan Luxury Glamping',
    roomTypes: [
      {
        name: 'Presidential Tented Suite',
        description: 'Triple-canopied canvas suite with central heating, private dining deck, teak four-poster bed, and personal butler.',
        priceMultiplier: 1.35,
        image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Luxury Tented Suite',
        description: 'Custom-designed colonial expedition tent overlooking Thiksey Monastery and snow-capped Stok Kangri range.',
        priceMultiplier: 1.0,
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
      }
    ],
    amenities: [
      'High-Altitude Acclimatization Oxygen Concierge',
      'Private Monastery Curators & Guides',
      'Fireside Campfire Dining & Astronomy',
      'Organic Farm-to-Table Dining Pavilion',
      'Heated En-Suite Bathrooms'
    ],
    curatedHighlights: [
      'Witness dawn prayer chanting at Thiksey Monastery with senior lamas',
      'Polo matches and archery demonstrations on private polo grounds',
      'Stargazing with high-powered telescopes under crystal Himalayan skies'
    ]
  },
  {
    id: 'evolve-back-kamalapura',
    name: 'Evolve Back, Kamalapura Palace',
    tagline: 'Imperial Vijayanagara architecture with private palace pool villas',
    location: 'Hampi, Karnataka, India',
    destinationId: 'hampi',
    destinationName: 'Hampi & Vijayanagara',
    region: 'India',
    country: 'India',
    rating: 4.98,
    reviewsCount: 312,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80'
    ],
    pricePerNightINR: 1099,
    pricePerNightUSD: 13,
    startingPriceDisplay: '₹1,099 / $13 per night',
    badge: 'Palace Heritage',
    roomTypes: [
      {
        name: 'Jal Mahal (Private Pool Villa)',
        description: 'Exclusive water palace pavilion with a private heated plunge pool, personal dining sala, and royal stone courtyard.',
        priceMultiplier: 1.35,
        image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Zenana (Palace Suite)',
        description: 'Inspired by Queen Zenana quarters with ornate arched corridors, hand-carved stone bath, and regal balcony.',
        priceMultiplier: 1.15,
        image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Nivasa (Deluxe Chamber)',
        description: 'Spacious stone suite featuring classic Vijayanagara motifs, four-poster bed, and private sit-out.',
        priceMultiplier: 1.0,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
      }
    ],
    amenities: [
      'Private Butler Service',
      'Ayurvedic Vaidya Spa',
      'Archaeologist-Guided Tours',
      'Infinity Royal Pool',
      'Gourmet Multi-Cuisine Restaurants',
      'High-Speed Satellite Wi-Fi'
    ],
    curatedHighlights: [
      'Step-well inspired architecture echoing Vijayanagara royal courts',
      'Private sunset dining under 500-year-old stone pavilion replicas',
      'Exclusive permit access to restricted heritage corridors'
    ]
  },
  {
    id: 'tamara-coorg',
    name: 'The Tamara Coorg',
    tagline: 'Elevated luxury wooden stilt cottages nestled inside 180-acre mist coffee estate',
    location: 'Coorg (Kodagu), Karnataka, India',
    destinationId: 'coorg',
    destinationName: 'Coorg (Kodagu)',
    region: 'India',
    country: 'India',
    rating: 4.95,
    reviewsCount: 420,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80'
    ],
    pricePerNightINR: 899,
    pricePerNightUSD: 11,
    startingPriceDisplay: '₹899 / $11 per night',
    badge: 'Rainforest Sanctuary',
    roomTypes: [
      {
        name: 'Eden Lotus Villa (Private Jacuzzi)',
        description: 'Private clifftop cottage with an outdoor heated cedar jacuzzi overlooking cascading mountain waterfalls.',
        priceMultiplier: 1.35,
        image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Luxury Suite Cottage',
        description: 'Two-tier hardwood cottage floating above plantation canopy with panoramic mist-shrouded valley sundeck.',
        priceMultiplier: 1.18,
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Superior Plantation Cottage',
        description: 'Elevated stilt chalet surrounded by cardamom bushes and ancient evergreen forest canopy.',
        priceMultiplier: 1.0,
        image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80'
      }
    ],
    amenities: [
      'Elevation Spa with Forest Treatments',
      'Coffee Cupping Laboratory',
      'Waterfall Deck Dining',
      'Yoga & Meditation Pavilion',
      'Private Naturalist Treks',
      'Heated Hydrotherapy Lounge'
    ],
    curatedHighlights: [
      'Zero-noise ecological reserve perched at 3,500 ft elevation',
      'Custom blend coffee roasting sessions with estate master roasters',
      'Direct forest stream bathing and private candlelit timber bridge dinners'
    ]
  },
  {
    id: 'evolve-back-kabini',
    name: 'Evolve Back, Kuruba Safari Lodge',
    tagline: 'Wildlife luxury inspired by indigenous tribal architecture along Kabini riverfront',
    location: 'Kabini / Nagarhole, Karnataka, India',
    destinationId: 'kabini',
    destinationName: 'Kabini & Nagarhole Reserve',
    region: 'India',
    country: 'India',
    rating: 4.97,
    reviewsCount: 289,
    image: 'https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80'
    ],
    pricePerNightINR: 1149,
    pricePerNightUSD: 14,
    startingPriceDisplay: '₹1,149 / $14 per night',
    badge: 'Jungle Reserve',
    roomTypes: [
      {
        name: 'Pool Reserve Villa',
        description: 'Palatial thatched villa featuring an internal courtyard, heated swimming pool, and riverside sit-out.',
        priceMultiplier: 1.3,
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Jacuzzi Hut',
        description: 'Traditional tribal-crafted thatched sanctuary with private open-air temperature-controlled jacuzzi.',
        priceMultiplier: 1.15,
        image: 'https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Safari Hut',
        description: 'Intimate living area crafted with indigenous mud and thatch textures and modern luxury fittings.',
        priceMultiplier: 1.0,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
      }
    ],
    amenities: [
      'Private 4x4 Predator Safaris',
      'Sunset Boat Cruise on Kabini',
      'Infinity Pool Overlooking River',
      'Vaidyasala Ayurvedic Center',
      'Riverside Starlight Dining',
      'Tribal Storytelling Evenings'
    ],
    curatedHighlights: [
      'Front-row viewing of Asiatic elephant herds crossing the riverbanks',
      'Silent eco-boat patrols with veteran national park trackers',
      'Five-course candlelit boat dinner floating on calm backwaters'
    ]
  },
  {
    id: 'kahani-paradise-gokarna',
    name: 'Kahani Paradise',
    tagline: 'Secluded clifftop estate overlooking virgin Arabian sea beaches and sacred headlands',
    location: 'Gokarna, Karnataka, India',
    destinationId: 'gokarna',
    destinationName: 'Gokarna & Om Beach',
    region: 'India',
    country: 'India',
    rating: 4.96,
    reviewsCount: 198,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512353087810-25dfcd100962?auto=format&fit=crop&w=1200&q=80'
    ],
    pricePerNightINR: 799,
    pricePerNightUSD: 10,
    startingPriceDisplay: '₹799 / $10 per night',
    badge: 'Coastal Clifftop',
    roomTypes: [
      {
        name: 'Grand Ocean Panorama Suite',
        description: 'Top-tier cliff suite with wrap-around balconies offering 270-degree Arabian Sea sunsets.',
        priceMultiplier: 1.3,
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Cliff Garden Suite',
        description: 'Direct access to tropical gardens with private daybed pavilion overlooking Om Beach cove.',
        priceMultiplier: 1.0,
        image: 'https://images.unsplash.com/photo-1512353087810-25dfcd100962?auto=format&fit=crop&w=800&q=80'
      }
    ],
    amenities: [
      'Infinity Pool Carved in Bedrock',
      'Private Trail to Paradise Beach',
      'Ayurvedic Massage Terrace',
      'Organic Orchard Dining',
      'Private Yacht Charters'
    ],
    curatedHighlights: [
      'Secluded 20-acre estate with private access to hidden coastal bays',
      'Sunset yoga sessions on cantilevered oceanfront timber decks',
      'Personal chef crafting coastal seafood and organic garden meals'
    ]
  },
  {
    id: 'lalitha-mahal-palace',
    name: 'Lalitha Mahal Palace Hotel',
    tagline: 'Pure white Italianate royal palace commissioned by the Maharaja of Mysore',
    location: 'Mysuru, Karnataka, India',
    destinationId: 'mysore',
    destinationName: 'Mysuru & Royal Palaces',
    region: 'India',
    country: 'India',
    rating: 4.93,
    reviewsCount: 350,
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80'
    ],
    pricePerNightINR: 849,
    pricePerNightUSD: 10,
    startingPriceDisplay: '₹849 / $10 per night',
    badge: 'Maharaja Residence',
    roomTypes: [
      {
        name: 'Viceroy Presidential Suite',
        description: 'Ornate multi-room royal suite with original Belgian chandeliers, carved four-poster beds, and heritage furnishings.',
        priceMultiplier: 1.35,
        image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Heritage Royal Chamber',
        description: 'High-ceilinged chamber with marble fireplace and private terrace looking towards Chamundi Hill.',
        priceMultiplier: 1.0,
        image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80'
      }
    ],
    amenities: [
      'Original Royal Ballrooms',
      'High Tea on Royal Verandahs',
      'Billiards Room with Vintage Tables',
      'Heritage Palace Architecture Tours',
      'Chauffeured Vintage Car City Rides'
    ],
    curatedHighlights: [
      'Dine in the historic domed Banquet Hall with authentic royal silver service',
      'Exclusive pass for illuminated evening palace viewing',
      'Private sandalwood aromatherapy oil massage'
    ]
  },

  // ================= GLOBAL SANCTUARIES =================
  {
    id: 'le-sirenuse-positano',
    name: 'Le Sirenuse Positano',
    tagline: 'Iconic clifftop luxury family-run hotel overlooking the sapphire Mediterranean and pastel village',
    location: 'Positano, Amalfi Coast, Italy',
    destinationId: 'amalfi-coast',
    destinationName: 'Amalfi Coast & Positano',
    region: 'Europe',
    country: 'Italy',
    rating: 4.99,
    reviewsCount: 480,
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80'
    ],
    pricePerNightINR: 2199,
    pricePerNightUSD: 26,
    startingPriceDisplay: '₹2,199 / $26 per night',
    badge: 'Mediterranean Icon',
    roomTypes: [
      {
        name: 'Sea View Suite with Private Balcony',
        description: 'Handmade Vietri tile floors, antique furnishings, and private balcony overlooking Positano bay.',
        priceMultiplier: 1.35,
        image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Deluxe Sea View Room',
        description: 'Bright vaulted ceilings, marble bathroom, and expansive Mediterranean vistas.',
        priceMultiplier: 1.0,
        image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80'
      }
    ],
    amenities: [
      'La Sponda Michelin-Starred Dining (400 Candles)',
      'Private Riva Speedboat Charters',
      'Heated Pool Surrounded by Lemon Trees',
      'Aveda Spa with Granite Steam Bath',
      'Franco’s Clifftop Sunset Bar'
    ],
    curatedHighlights: [
      'Dinner illuminated by 400 wax candles with mandolin serenades at La Sponda',
      'Private Riva wooden speedboat cruise to hidden Capri sea caves',
      'Sunset Bellini cocktails on the iconic red terrace'
    ]
  },
  {
    id: 'hoshinoya-kyoto',
    name: 'Hoshinoya Kyoto',
    tagline: 'Centuries-old riverside ryokan accessible only by private wooden boat along the Oi River',
    location: 'Arashiyama, Kyoto, Japan',
    destinationId: 'kyoto',
    destinationName: 'Kyoto & Historic Kansai',
    region: 'Asia',
    country: 'Japan',
    rating: 4.98,
    reviewsCount: 360,
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80'
    ],
    pricePerNightINR: 1899,
    pricePerNightUSD: 23,
    startingPriceDisplay: '₹1,899 / $23 per night',
    badge: 'Zen Ryokan',
    roomTypes: [
      {
        name: 'Pavilion Tsukikusa (Riverside Tatami)',
        description: 'Traditional tatami pavilion with woodblock-printed Karakami wallpaper and cedar river views.',
        priceMultiplier: 1.3,
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Mizu Room (Oi River View)',
        description: 'Modern Japanese minimalism with floor-to-ceiling river windows and cypress wood onsen tub.',
        priceMultiplier: 1.0,
        image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80'
      }
    ],
    amenities: [
      'Private Wooden Boat Arrival',
      'Michelin Kaiseki Multi-Course Dining',
      'Morning Zen Temple Meditation',
      'Private Tea Master Ceremonies',
      'Riverside Woodcraft Workshop'
    ],
    curatedHighlights: [
      'Private wooden boat glide up the tranquil Oi river gorges to your secluded entrance',
      'Bespoke morning Buddhist meditation session with a local temple abbot',
      'Seasonal Kaiseki dinners prepared by award-winning Japanese masters'
    ]
  },
  {
    id: 'the-chedi-andermatt',
    name: 'The Chedi Andermatt',
    tagline: 'Alpine luxury blending Swiss warmth with Asian design in the high Ursern Valley',
    location: 'Andermatt / Zermatt, Switzerland',
    destinationId: 'swiss-alps',
    destinationName: 'Swiss Alps & Zermatt',
    region: 'Europe',
    country: 'Switzerland',
    rating: 4.97,
    reviewsCount: 310,
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80'
    ],
    pricePerNightINR: 2399,
    pricePerNightUSD: 29,
    startingPriceDisplay: '₹2,399 / $29 per night',
    badge: 'Alpine Grand Luxury',
    roomTypes: [
      {
        name: 'Gemsstock Suite with Matterhorn Balcony',
        description: 'Fireplace suite with freestanding stone bathtub, Hästens bed, and panoramic snow summits.',
        priceMultiplier: 1.35,
        image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Deluxe Alpine Room',
        description: 'Warm timber interiors with bronze fireplace and cashmere furnishings.',
        priceMultiplier: 1.0,
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
      }
    ],
    amenities: [
      '2,400 sq.m Hydrothermal Alpine Spa',
      'The Japanese Restaurant (2 Michelin Stars)',
      'Ski Butler Service & Equipment Lounge',
      'Wine & Cheese Cellar Cave',
      'Heated Outdoor Glass Pool'
    ],
    curatedHighlights: [
      'Direct ski-in / ski-out access with private mountain guide concierge',
      'Relaxation in 35-meter indoor glass-roof pool surrounded by alpine snow',
      'Exclusive tasting inside the five-meter high glass Cheese Tower'
    ]
  },
  {
    id: 'singita-sasakwa-lodge',
    name: 'Singita Sasakwa Lodge',
    tagline: 'Edwardian manor perched on Sasakwa Hill overlooking the endless Serengeti plains',
    location: 'Grumeti / Serengeti, Tanzania',
    destinationId: 'serengeti',
    destinationName: 'Serengeti & Great Migration',
    region: 'Africa',
    country: 'Tanzania',
    rating: 4.99,
    reviewsCount: 220,
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80'
    ],
    pricePerNightINR: 2499,
    pricePerNightUSD: 30,
    startingPriceDisplay: '₹2,499 / $30 per night',
    badge: 'Ultra-Luxe Safari Manor',
    roomTypes: [
      {
        name: 'Hilltop Cottage with Private Pool',
        description: 'Stone manor suite with wraparound veranda, heated infinity plunge pool, and telescopes.',
        priceMultiplier: 1.3,
        image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Sasakwa Manor Suite',
        description: 'Classic grand manor suite with crystal chandeliers, four-poster bed, and endless savanna views.',
        priceMultiplier: 1.0,
        image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=800&q=80'
      }
    ],
    amenities: [
      'Private Airstrip & Bush Planes',
      'Private 4x4 Game Cruisers with Trackers',
      'Singita Premier Wine Cellar',
      'Bush Spa & Starlight Massages',
      'Equestrian Safari Center'
    ],
    curatedHighlights: [
      'Panoramic front-row views of millions of migrating herds crossing the plains',
      'Sunset champagne picnics on high Sasakwa cliffs',
      'Private game tracking with senior anti-poaching wildlife scouts'
    ]
  },
  {
    id: 'canaves-oia-epitome',
    name: 'Canaves Oia Epitome',
    tagline: 'Perched above Ammoudi Bay with sunset infinity pools and volcanic stone architecture',
    location: 'Oia, Santorini, Greece',
    destinationId: 'santorini',
    destinationName: 'Santorini & Cyclades',
    region: 'Europe',
    country: 'Greece',
    rating: 4.96,
    reviewsCount: 380,
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80'
    ],
    pricePerNightINR: 1999,
    pricePerNightUSD: 24,
    startingPriceDisplay: '₹1,999 / $24 per night',
    badge: 'Caldera Sunset Suites',
    roomTypes: [
      {
        name: 'Epitome 2-Bedroom Villa with Pool',
        description: 'Spacious stone villa with private infinity pool, outdoor lounge, and unobstructed Aegean sunset.',
        priceMultiplier: 1.35,
        image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Hideaway Villa with Private Pool',
        description: 'Minimalist volcanic stone architecture featuring outdoor daybed and heated plunge pool.',
        priceMultiplier: 1.18,
        image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Deluxe Suite with Sunset View',
        description: 'Private balcony framing panoramic caldera and twilight skies.',
        priceMultiplier: 1.0,
        image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80'
      }
    ],
    amenities: [
      'Elements Restaurant by Chef Tasos Stefatos',
      'Private Catamaran Sunset Cruises',
      'Infinity Main Pool with Floating Daybeds',
      'Holistic Wellness Spa',
      'Sommelier Wine Tastings'
    ],
    curatedHighlights: [
      'Front-row seating for the world-famous Oia sunset away from tourist crowds',
      'Private helicopter transfers to Mykonos and Crete',
      'Degustation seafood menu paired with rare volcanic Assyrtiko wines'
    ]
  },
  {
    id: 'mandapa-ritz-carlton-bali',
    name: 'Mandapa, a Ritz-Carlton Reserve',
    tagline: 'Spiritual sanctuary along Ayung River surrounded by sacred rice terraces and temples',
    location: 'Ubud, Bali, Indonesia',
    destinationId: 'bali',
    destinationName: 'Bali & Spiritual Ubud',
    region: 'Asia',
    country: 'Indonesia',
    rating: 4.98,
    reviewsCount: 395,
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80'
    ],
    pricePerNightINR: 1599,
    pricePerNightUSD: 19,
    startingPriceDisplay: '₹1,599 / $19 per night',
    badge: 'River Reserve',
    roomTypes: [
      {
        name: 'Mandapa 3-Bedroom Pool Villa',
        description: 'Massive private estate villa on the riverbank with private 30-meter pool and Patih butler service.',
        priceMultiplier: 1.4,
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Riverfront Pool Villa',
        description: 'Private walled sanctuary with personal pool directly listening to rushing Ayung waters.',
        priceMultiplier: 1.2,
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Reserve Suite',
        description: 'Balinese carved teak wood interiors with spacious balcony framing rice paddy valleys.',
        priceMultiplier: 1.0,
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80'
      }
    ],
    amenities: [
      'Kubu Restaurant in Bamboo Cocoons',
      'Ayung River Floating Breakfast',
      'Private Healer & Astrologer Sessions',
      'Mandapa Holistic Spa',
      'Vintage VW Convertible Tours'
    ],
    curatedHighlights: [
      'Dinner inside private bamboo cocoon overlooking Ayung river rapids',
      'Sacred water purification blessing with local High Priest',
      'Harvesting organic herbs in Mandapa Farm with the Executive Chef'
    ]
  }
];

export const getStaysByDestinationId = (destId: string): LuxuryStayItem[] => {
  return LUXURY_STAYS.filter(s => s.destinationId === destId);
};
