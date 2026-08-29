-- ==========================================================
-- Auric Travel: Complete Master Data-Only Dump
-- File: auric_travel_data.sql
-- Encoded: UTF-8 (Preserving ₹ and special characters)
-- Notes: Pure DML Insert statements with ON CONFLICT DO NOTHING
-- ==========================================================

-- ----------------------------------------------------------
-- 1. DESTINATIONS (Total: 16 sanctuaries)
-- ----------------------------------------------------------
INSERT INTO destinations (
  id, name, city, country, region, state, description, tagline, category, additional_categories,
  image_url, gallery_urls, latitude, longitude, estimated_budget, starting_price,
  rating, reviews_count, best_time_to_visit, average_temperature, vibe
) VALUES (
  'udaipur',
  'Udaipur & Lake Pichola',
  'Udaipur',
  'India',
  'India',
  'Rajasthan',
  'Surrounded by the ancient Aravalli hills, Udaipur is an imperial jewel of marble courtyards, glistening lakes, and royal Mewar heritage. Cruise Lake Pichola in vintage royal barges and dine in starlit rooftop courtyards.',
  'The Venice of the East: Floating marble palaces, Mewar royal dynasty & romantic lake sunsets',
  'Heritage',
  ARRAY['Culture'],
  'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1600&q=80',
  ARRAY['https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'],
  24.5854,
  73.7125,
  '₹55,000 / $660 (Luxury)',
  '₹55,000 / $660',
  4.98,
  460,
  'October – March',
  '24°C / 75°F',
  ARRAY['Royal Rajputana', 'Floating Palaces', 'Romantic Lakes', 'Mewar Heritage']
) ON CONFLICT (id) DO NOTHING;

INSERT INTO destinations (
  id, name, city, country, region, state, description, tagline, category, additional_categories,
  image_url, gallery_urls, latitude, longitude, estimated_budget, starting_price,
  rating, reviews_count, best_time_to_visit, average_temperature, vibe
) VALUES (
  'kerala',
  'Kerala Backwaters & Wayanad',
  'Kerala Backwaters',
  'India',
  'India',
  'Kerala',
  'Drift along serene palm-fringed canals in a bespoke wooden Kettuvallam houseboat, breathe in mountain spice plantations of Wayanad, and experience ancient 5,000-year-old Ayurvedic rejuvenation.',
  'Emerald backwaters, luxury thatched houseboats & authentic Ayurvedic healing',
  'Nature',
  ARRAY['Beach', 'Culture'],
  'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1600&q=80',
  ARRAY['https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'],
  9.4981,
  76.3388,
  '₹48,000 / $580 (Luxury)',
  '₹48,000 / $580',
  4.97,
  390,
  'September – March',
  '27°C / 81°F',
  ARRAY['Emerald Backwaters', 'Ayurvedic Wellness', 'Spice Valleys', 'Serene Houseboats']
) ON CONFLICT (id) DO NOTHING;

INSERT INTO destinations (
  id, name, city, country, region, state, description, tagline, category, additional_categories,
  image_url, gallery_urls, latitude, longitude, estimated_budget, starting_price,
  rating, reviews_count, best_time_to_visit, average_temperature, vibe
) VALUES (
  'ladakh',
  'Ladakh & Pangong Tso',
  'Ladakh',
  'India',
  'India',
  'Ladakh',
  'Ascend to the rooftop of India. Traverse world-famous Khardung La at 18,380 ft, gaze upon the color-shifting turquoise waters of Pangong Tso, and listen to morning chants at ancient cliff-perched monasteries.',
  'The Land of High Mountain Passes: Cobalt alpine lakes, Buddhist gompas & stark moonscapes',
  'Adventure',
  ARRAY['Nature', 'Culture'],
  'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1600&q=80',
  ARRAY['https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80'],
  34.1526,
  77.5771,
  '₹62,000 / $750 (Luxury)',
  '₹62,000 / $750',
  4.99,
  320,
  'May – October',
  '18°C / 64°F (Summer)',
  ARRAY['High Altitude', 'Cobalt Lakes', 'Ancient Monasteries', 'Pure Adventure']
) ON CONFLICT (id) DO NOTHING;

INSERT INTO destinations (
  id, name, city, country, region, state, description, tagline, category, additional_categories,
  image_url, gallery_urls, latitude, longitude, estimated_budget, starting_price,
  rating, reviews_count, best_time_to_visit, average_temperature, vibe
) VALUES (
  'hampi',
  'Hampi & Vijayanagara',
  'Hampi',
  'India',
  'India',
  'Karnataka',
  'Walk amongst monumental 14th-century royal palaces, sacred monoliths, and the world-famous Stone Chariot of Vittala Temple. Watch the sun dip over the emerald Tungabhadra river from surreal granite boulder peaks.',
  'UNESCO World Heritage boulder kingdom & timeless Vijayanagara glory',
  'Heritage',
  ARRAY['Culture', 'Adventure'],
  'https://images.unsplash.com/photo-1600100397608-f010f443b718?auto=format&fit=crop&w=1600&q=80',
  ARRAY['https://images.unsplash.com/photo-1600100397608-f010f443b718?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80'],
  15.335,
  76.46,
  '₹45,000 / $540 (Luxury)',
  '₹45,000 / $540',
  4.98,
  382,
  'October – March',
  '26°C / 79°F',
  ARRAY['UNESCO Heritage', 'Mystical Boulders', 'Royal History', 'Riverside Serenity']
) ON CONFLICT (id) DO NOTHING;

INSERT INTO destinations (
  id, name, city, country, region, state, description, tagline, category, additional_categories,
  image_url, gallery_urls, latitude, longitude, estimated_budget, starting_price,
  rating, reviews_count, best_time_to_visit, average_temperature, vibe
) VALUES (
  'coorg',
  'Coorg (Kodagu)',
  'Coorg',
  'India',
  'India',
  'Karnataka',
  'Dubbed the Scotland of India, Kodagu offers undulating emerald valleys blanketed in Arabica and Robusta plantations, sparkling mountain waterfalls, and authentic warrior Kodava culinary traditions.',
  'Mist-clad Western Ghats hills, spice trails, and heirloom Arabica coffee estates',
  'Nature',
  ARRAY['Adventure', 'Culture'],
  'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1600&q=80',
  ARRAY['https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=80'],
  12.4244,
  75.7382,
  '₹38,000 / $460 (Luxury)',
  '₹38,000 / $460',
  4.96,
  450,
  'September – May',
  '20°C / 68°F',
  ARRAY['Coffee Plantation', 'Misty Hills', 'Ayurvedic Spa', 'Gastronomy']
) ON CONFLICT (id) DO NOTHING;

INSERT INTO destinations (
  id, name, city, country, region, state, description, tagline, category, additional_categories,
  image_url, gallery_urls, latitude, longitude, estimated_budget, starting_price,
  rating, reviews_count, best_time_to_visit, average_temperature, vibe
) VALUES (
  'kabini',
  'Kabini & Nagarhole Reserve',
  'Kabini',
  'India',
  'India',
  'Karnataka',
  'Kabini is one of Asia’s premier wildlife sanctuaries. Glide along peaceful backwaters watching herds of Asiatic elephants swim at dusk, and venture deep into the teak forests of Nagarhole tracking tigers and elusive black leopards.',
  'The royal wildlife frontier: Bengal tigers, black panthers & river elephant herds',
  'Adventure',
  ARRAY['Nature'],
  'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1600&q=80',
  ARRAY['https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80'],
  11.9167,
  76.35,
  '₹52,000 / $625 (Ultra-Luxe)',
  '₹52,000 / $625',
  4.99,
  310,
  'October – June',
  '25°C / 77°F',
  ARRAY['Royal Safari', 'Bengal Tigers', 'Backwater Luxury', 'Wild Wilderness']
) ON CONFLICT (id) DO NOTHING;

INSERT INTO destinations (
  id, name, city, country, region, state, description, tagline, category, additional_categories,
  image_url, gallery_urls, latitude, longitude, estimated_budget, starting_price,
  rating, reviews_count, best_time_to_visit, average_temperature, vibe
) VALUES (
  'gokarna',
  'Gokarna & Om Beach',
  'Gokarna',
  'India',
  'India',
  'Karnataka',
  'Where the Western Ghats meet the Arabian Sea in dramatic red cliffs and crescent-shaped sandy bays. Gokarna combines ancient spiritual serenity with secluded barefoot beach luxury at Om, Kudle, and Half Moon beaches.',
  'Pristine Arabian Sea coves, sacred cliffs, and barefoot coastal luxury',
  'Beach',
  ARRAY['Nature', 'Heritage'],
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
  ARRAY['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80'],
  14.5479,
  74.3188,
  '₹32,000 / $385 (Luxury)',
  '₹32,000 / $385',
  4.92,
  290,
  'October – April',
  '28°C / 82°F',
  ARRAY['Barefoot Luxury', 'Arabian Sea', 'Cliffside Sunsets', 'Yoga & Wellness']
) ON CONFLICT (id) DO NOTHING;

INSERT INTO destinations (
  id, name, city, country, region, state, description, tagline, category, additional_categories,
  image_url, gallery_urls, latitude, longitude, estimated_budget, starting_price,
  rating, reviews_count, best_time_to_visit, average_temperature, vibe
) VALUES (
  'mysore',
  'Mysuru & Royal Palaces',
  'Mysuru',
  'India',
  'India',
  'Karnataka',
  'Immerse in the regal grandeur of the Wadiyar dynasty. Gaze at nearly 100,000 glowing bulbs illuminating Mysore Palace, smell fragrant pure Mysore sandalwood, and savor royal culinary delicacies.',
  'The City of Palaces, royal silk heritage & incandescent Dasara splendor',
  'Heritage',
  ARRAY['Culture'],
  'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1600&q=80',
  ARRAY['https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80'],
  12.3051,
  76.6551,
  '₹30,000 / $360 (Luxury)',
  '₹30,000 / $360',
  4.93,
  375,
  'September – March',
  '24°C / 75°F',
  ARRAY['Royal Palaces', 'Heritage Luxury', 'Silk & Sandalwood', 'Art & Culture']
) ON CONFLICT (id) DO NOTHING;

INSERT INTO destinations (
  id, name, city, country, region, state, description, tagline, category, additional_categories,
  image_url, gallery_urls, latitude, longitude, estimated_budget, starting_price,
  rating, reviews_count, best_time_to_visit, average_temperature, vibe
) VALUES (
  'bengaluru',
  'Bengaluru & Garden City Heritage',
  'Bengaluru',
  'India',
  'India',
  'Karnataka',
  'A cosmopolitan cultural capital blending centuries-old regal royal heritage, lush 240-acre botanical gardens, legendary filter coffee trails, and cutting-edge craft gastronomy.',
  'The Garden City: Tudor royal palaces, botanical glass houses & artisanal gastronomy',
  'Culture',
  ARRAY['Heritage', 'Nature', 'Food'],
  'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1600&q=80',
  ARRAY['https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80'],
  12.9716,
  77.5946,
  '₹32,000 / $385 (Luxury)',
  '₹32,000 / $385',
  4.95,
  410,
  'September – March',
  '23°C / 73°F',
  ARRAY['Garden City', 'Tudor Palace', 'Culinary Craft', 'Heritage & Innovation']
) ON CONFLICT (id) DO NOTHING;

INSERT INTO destinations (
  id, name, city, country, region, state, description, tagline, category, additional_categories,
  image_url, gallery_urls, latitude, longitude, estimated_budget, starting_price,
  rating, reviews_count, best_time_to_visit, average_temperature, vibe
) VALUES (
  'chikmagalur',
  'Chikmagalur & Coffee Highlands',
  'Chikmagalur',
  'India',
  'India',
  'Karnataka',
  'Nestled in the Western Ghats, Chikmagalur is a verdant highland retreat of emerald Arabica coffee plantations, cascading mountain waterfalls, and the highest peak in Karnataka.',
  'The birthplace of Indian coffee: misty peaks, shola rainforests & colonial estates',
  'Nature',
  ARRAY['Adventure', 'Heritage', 'Food'],
  'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80',
  ARRAY['https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1512290900672-1f03f3922374?auto=format&fit=crop&w=1200&q=80'],
  13.3153,
  75.7754,
  '₹28,000 / $335 (Luxury)',
  '₹28,000 / $335',
  4.96,
  320,
  'September – April',
  '21°C / 70°F',
  ARRAY['Coffee Plantation', 'Misty Highlands', 'Western Ghats', 'Colonial Serenity']
) ON CONFLICT (id) DO NOTHING;

INSERT INTO destinations (
  id, name, city, country, region, state, description, tagline, category, additional_categories,
  image_url, gallery_urls, latitude, longitude, estimated_budget, starting_price,
  rating, reviews_count, best_time_to_visit, average_temperature, vibe
) VALUES (
  'amalfi-coast',
  'Amalfi Coast & Positano',
  'Amalfi Coast',
  'Italy',
  'Europe',
  NULL,
  'Dramatic pastel villages cling to towering cliffs above turquoise seas, surrounded by fragrant lemon groves, legendary clifftop villas, and Michelin-starred coastal dining.',
  'Cliffside Mediterranean glamour, private wooden yachts & sun-drenched lemon terraces',
  'Beach',
  ARRAY['Culture', 'Adventure'],
  'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1600&q=80',
  ARRAY['https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=1200&q=80'],
  40.634,
  14.6027,
  '₹2,85,000 / $3,400 (Ultra-Luxe)',
  '₹2,85,000 / $3,400',
  4.98,
  342,
  'May – October',
  '24°C / 75°F',
  ARRAY['Coastal Luxury', 'Romance', 'Gastronomy']
) ON CONFLICT (id) DO NOTHING;

INSERT INTO destinations (
  id, name, city, country, region, state, description, tagline, category, additional_categories,
  image_url, gallery_urls, latitude, longitude, estimated_budget, starting_price,
  rating, reviews_count, best_time_to_visit, average_temperature, vibe
) VALUES (
  'kyoto',
  'Kyoto & Historic Kansai',
  'Kyoto',
  'Japan',
  'Asia',
  NULL,
  'Immerse yourself in Japan’s cultural heart with moss-carpeted temples, whispering Arashiyama bamboo groves, traditional Ryokan retreats, and private tea master ceremonies.',
  'Centuries of Zen harmony, sacred shrines, and timeless artisanal craft',
  'Culture',
  ARRAY['Heritage', 'Nature'],
  'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80',
  ARRAY['https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?auto=format&fit=crop&w=1200&q=80'],
  35.0116,
  135.7681,
  '₹2,45,000 / $2,950 (Luxury)',
  '₹2,45,000 / $2,950',
  4.96,
  428,
  'March – May & Oct – Nov',
  '19°C / 66°F',
  ARRAY['Ancient Culture', 'Zen & Wellness', 'Culinary Arts']
) ON CONFLICT (id) DO NOTHING;

INSERT INTO destinations (
  id, name, city, country, region, state, description, tagline, category, additional_categories,
  image_url, gallery_urls, latitude, longitude, estimated_budget, starting_price,
  rating, reviews_count, best_time_to_visit, average_temperature, vibe
) VALUES (
  'swiss-alps',
  'Swiss Alps & Zermatt',
  'Swiss Alps',
  'Switzerland',
  'Europe',
  NULL,
  'Breathe in pure mountain air amidst snow-crowned peaks, ride the Glacier Express across scenic gorges, and relax in world-class alpine thermal spas with heated infinity pools.',
  'Iconic Matterhorn vistas, pristine glaciers, and alpine luxury',
  'Nature',
  ARRAY['Adventure'],
  'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1600&q=80',
  ARRAY['https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80'],
  45.9763,
  7.7491,
  '₹3,40,000 / $4,100 (Ultra-Luxe)',
  '₹3,40,000 / $4,100',
  4.97,
  289,
  'Dec – Apr (Snow) / Jun – Sep (Hiking)',
  '16°C / 61°F (Summer)',
  ARRAY['Alpine Serenity', 'Ski & Adventure', 'Luxury Wellness']
) ON CONFLICT (id) DO NOTHING;

INSERT INTO destinations (
  id, name, city, country, region, state, description, tagline, category, additional_categories,
  image_url, gallery_urls, latitude, longitude, estimated_budget, starting_price,
  rating, reviews_count, best_time_to_visit, average_temperature, vibe
) VALUES (
  'serengeti',
  'Serengeti & Great Migration',
  'Serengeti',
  'Tanzania',
  'Africa',
  NULL,
  'Witness the planet’s greatest wildlife spectacle from luxury tented canvas suites. Drift over the golden savanna at sunrise in a hot-air balloon and track the Big Five with expert Maasai guides.',
  'The timeless rhythm of the Great Migration under endless golden skies',
  'Adventure',
  ARRAY['Nature'],
  'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1600&q=80',
  ARRAY['https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=1200&q=80'],
  -2.3333,
  34.8333,
  '₹4,30,000 / $5,200 (Ultra-Luxe)',
  '₹4,30,000 / $5,200',
  4.99,
  215,
  'June – October',
  '26°C / 79°F',
  ARRAY['Wild Safari', 'Raw Nature', 'Eco-Luxury']
) ON CONFLICT (id) DO NOTHING;

INSERT INTO destinations (
  id, name, city, country, region, state, description, tagline, category, additional_categories,
  image_url, gallery_urls, latitude, longitude, estimated_budget, starting_price,
  rating, reviews_count, best_time_to_visit, average_temperature, vibe
) VALUES (
  'santorini',
  'Santorini & Cyclades',
  'Santorini',
  'Greece',
  'Europe',
  NULL,
  'Iconic sapphire domes, sun-drenched cave suites, volcanic black sand beaches, and crisp Assyrtiko wines produced from Aegean volcanic soils.',
  'Whitewashed caldera villages illuminated by golden Aegean sunsets',
  'Beach',
  ARRAY['Culture', 'Heritage'],
  'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1600&q=80',
  ARRAY['https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'],
  36.4618,
  25.3753,
  '₹2,60,000 / $3,100 (Luxury)',
  '₹2,60,000 / $3,100',
  4.95,
  388,
  'April – November',
  '27°C / 81°F',
  ARRAY['Sun & Sea', 'Cycladic Romance', 'Wine & Dine']
) ON CONFLICT (id) DO NOTHING;

INSERT INTO destinations (
  id, name, city, country, region, state, description, tagline, category, additional_categories,
  image_url, gallery_urls, latitude, longitude, estimated_budget, starting_price,
  rating, reviews_count, best_time_to_visit, average_temperature, vibe
) VALUES (
  'bali',
  'Bali & Spiritual Ubud',
  'Bali',
  'Indonesia',
  'Asia',
  NULL,
  'Find inner balance in the Island of the Gods. Walk through cascading Tegallalang rice paddies, receive private temple blessings, and retreat to private river valley pool villas in Ubud.',
  'Emerald rice terraces, sacred water temples & holistic rainforest luxury',
  'Culture',
  ARRAY['Nature', 'Beach'],
  'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1600&q=80',
  ARRAY['https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80'],
  -8.5069,
  115.2625,
  '₹1,95,000 / $2,350 (Luxury)',
  '₹1,95,000 / $2,350',
  4.96,
  395,
  'April – October',
  '28°C / 82°F',
  ARRAY['Spiritual Sanctuary', 'Rainforest Pools', 'Holistic Wellness', 'Art & Craft']
) ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------
-- 2. EXPERIENCES (Total: 23 bespoke encounters)
-- ----------------------------------------------------------
INSERT INTO experiences (
  id, title, description, short_description, destination_id, category,
  image_url, gallery_urls, location, duration, price, rating, reviews_count,
  latitude, longitude, highlights, included, best_time, group_type, physical_level
) VALUES (
  'udaipur-vintage-boat-sunset',
  'Royal Mewar Solar Yacht & Island Sunset Cruise',
  'Drift along the shimmering waters of Lake Pichola in a handcrafted royal solar yacht. Glide past the majestic facade of City Palace, Jag Niwas (Lake Palace), and Mohan Mandir as the sun sets behind the rugged Aravalli ranges. Step ashore on Jag Mandir Island for a private torchlit cocktail reception and live classical sitar melodies.',
  'Sail along the mirrored waters of Lake Pichola past Jag Mandir on a private royal solar yacht with bespoke Mewari hors d’oeuvres.',
  'udaipur',
  'Adventure',
  'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
  ARRAY['https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80'],
  'Lake Pichola, Udaipur, Rajasthan, India',
  '3 Hours (Sunset)',
  '₹7,500 per guest',
  4.98,
  194,
  24.5854,
  73.7125,
  ARRAY['Private eco-solar yacht cruise across Lake Pichola', 'Champagne and artisanal Mewari treats served on board', 'Front-row photography views of the illuminated City Palace', 'Exclusive private landing at the historic Jag Mandir island palace'],
  ARRAY['Private yacht charter & personal boat captain', 'Chilled champagne & canapés', 'Heritage island palace entry', 'Classical live musician accompaniment'],
  'October – March',
  'Private Cruise (Up to 6 guests)',
  'Gentle'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO experiences (
  id, title, description, short_description, destination_id, category,
  image_url, gallery_urls, location, duration, price, rating, reviews_count,
  latitude, longitude, highlights, included, best_time, group_type, physical_level
) VALUES (
  'kerala-backwaters-kayak-drift',
  'Vembanad Backwaters Kayak & Village Canal Trail',
  'Venture deep into the serene labyrinth of Kerala’s backwaters beyond where large houseboats can reach. Glide quietly through canopied palm canals in precision touring kayaks. Meet local village artisans making coir rope from coconut husks, observe migratory kingfishers, and enjoy fresh tender coconut water right from village farms.',
  'Navigate narrow emerald canal networks and lotus lagoons in sea kayaks, engaging with generational coir weavers and toddy tappers.',
  'kerala',
  'Adventure',
  'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
  ARRAY['https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80'],
  'Alleppey & Kumarakom, Kerala, India',
  '4 Hours (Dawn or Afternoon)',
  '₹4,200 per guest',
  4.97,
  165,
  9.4981,
  76.3388,
  ARRAY['Access secluded village waterways impassable to motorboats', 'Guided by a local naturalist & water rescue expert', 'Visit heritage coir and boat-making cottage workshops', 'Traditional spiced chai & steamed banana snacks at canal-side shacks'],
  ARRAY['Touring kayak, lightweight carbon paddle & life vest', 'Certified kayak guide', 'Waterproof dry bags & hydration kit', 'Organic village breakfast or tea'],
  'September – March',
  'Small Group (Max 8)',
  'Moderate'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO experiences (
  id, title, description, short_description, destination_id, category,
  image_url, gallery_urls, location, duration, price, rating, reviews_count,
  latitude, longitude, highlights, included, best_time, group_type, physical_level
) VALUES (
  'ladakh-khardungla-cycle-descent',
  'Khardung La to Nubra Valley Mountain Bike Descent',
  'Begin at the dizzying summit of Khardung La Pass surrounded by prayer flags and glacier peaks. Gear up with top-tier hydraulic dual-suspension downhill bikes and descend 40 kilometers of winding tarmac through the heart of the Karakoram and Ladakh ranges, terminating in the fertile high-altitude valley of Nubra.',
  'Descend from one of the highest motorable mountain passes in the world (17,982 ft) through dramatic Himalayan gorges.',
  'ladakh',
  'Adventure',
  'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80',
  ARRAY['https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'],
  'Leh & Nubra Valley, Ladakh, India',
  '6 Hours',
  '₹8,900 per guest',
  4.99,
  142,
  34.1526,
  77.5771,
  ARRAY['Exhilarating 40km downhill gravity descent from 17,982 ft', 'Backup support vehicle with oxygen cylinders & spare equipment', 'Scenic stop at ancient Diskit Monastery and cold desert sand dunes', 'Warm butter tea & Ladakhi momos lunch at riverside camp'],
  ARRAY['Trek / Specialized dual-suspension mountain bike & helmet', 'Certified Himalayan cycling marshal', '4x4 chase vehicle with oxygen support', 'Gourmet trail lunch & permits'],
  'June – September',
  'Small Group (Max 6)',
  'High Energy'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO experiences (
  id, title, description, short_description, destination_id, category,
  image_url, gallery_urls, location, duration, price, rating, reviews_count,
  latitude, longitude, highlights, included, best_time, group_type, physical_level
) VALUES (
  'hampi-boulder-coracle',
  'Coracle Navigation & Ancient Boulder Trek',
  'Experience the raw, prehistoric energy of Hampi from two unique perspectives. Begin at sunrise in an artisanal circular coracle boat, gliding gently along the sacred Tungabhadra River beneath towering medieval stone ghats and submerged monoliths. Next, join a certified bouldering expert to traverse the dramatic granite outcrops of Hemakuta and Matanga Hill.',
  'Navigate swirling Tungabhadra waters in a handwoven wicker coracle, followed by an archaeologist-guided granite bouldering expedition.',
  'hampi',
  'Adventure',
  'https://images.unsplash.com/photo-1600100397608-f010f443b718?auto=format&fit=crop&w=1200&q=80',
  ARRAY['https://images.unsplash.com/photo-1600100397608-f010f443b718?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80'],
  'Hampi, Karnataka, India',
  '4.5 Hours (Dawn or Dusk)',
  '₹4,800 per guest',
  4.96,
  148,
  15.335,
  76.46,
  ARRAY['Authentic circular coracle boat cruise along the sacred Tungabhadra River', 'Private safety-equipped boulder scrambling with certified outdoor naturalists', 'Exclusive access to unmapped 14th-century cave shrines & stone carvings', 'Chilled tender coconut refreshments and traditional spiced tea at Matanga summit'],
  ARRAY['Private coracle craft & certified boatman', 'High-grade bouldering & safety gear', 'Licensed archaeologist naturalist guide', 'Gourmet hydration pack & artisanal snacks', 'All monument and forest transit permits'],
  'October – March',
  'Private / Small Group (Max 6)',
  'Moderate'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO experiences (
  id, title, description, short_description, destination_id, category,
  image_url, gallery_urls, location, duration, price, rating, reviews_count,
  latitude, longitude, highlights, included, best_time, group_type, physical_level
) VALUES (
  'kabini-predator-safari',
  'Nagarhole Deep Jungle Safari & River Patrol',
  'Venture into the heart of Nagarhole National Park, legendary home of Asiatic wild elephants, stealthy leopards, and royal Bengal tigers. Accompanied by a veteran wildlife tracker, explore secret jungle corridors in a custom open safari jeep. Conclude with a twilight boat expedition along the Kabini backwaters.',
  'Traverse prime Bengal tiger and black panther territory in an open bespoke 4x4, followed by a silent solar-powered river safari.',
  'kabini',
  'Adventure',
  'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1200&q=80',
  ARRAY['https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1200&q=80'],
  'Kabini, Karnataka, India',
  '6 Hours (Split Dawn & Twilight Drives)',
  '₹14,500 per guest',
  4.99,
  230,
  11.9167,
  76.35,
  ARRAY['Exclusive 4x4 open-top vehicle permitted in core wilderness zones', 'Master naturalist tracker tracking apex predator pugmarks and alarm calls', 'Sunset solar boat navigation alongside wild elephant herds and marsh crocodiles', 'Bush breakfast served beside tranquil jungle waterholes'],
  ARRAY['Reserved VIP forest department permits', 'Dedicated expert naturalist & veteran driver', 'High-resolution Swarovski spotting scopes', 'Champagne bush breakfast & sundowner refreshments'],
  'November – May',
  'Private Bespoke Vehicle',
  'Moderate'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO experiences (
  id, title, description, short_description, destination_id, category,
  image_url, gallery_urls, location, duration, price, rating, reviews_count,
  latitude, longitude, highlights, included, best_time, group_type, physical_level
) VALUES (
  'zermatt-glacier-ski-traverse',
  'Matterhorn Glacier Ski & Crevasse Traverse',
  'Ascend to Europe highest cable car station at 3,883 meters on Matterhorn Glacier Paradise. Bound onto pristine eternal powder with an IFMGA-certified Swiss mountain guide. Navigate through dramatic blue ice seracs, carve down 25 kilometers of uninterrupted alpine slopes, and cross the Italian border into Cervinia for an authentic high-altitude lunch.',
  'High-altitude ski mountaineering and glacier traversal under the imposing granite pyramid of the Matterhorn.',
  'swiss-alps',
  'Adventure',
  'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80',
  ARRAY['https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=1200&q=80'],
  'Zermatt, Valais, Switzerland',
  '7 Hours (Full Day Alpine)',
  '₹35,000 per guest',
  4.97,
  89,
  45.9763,
  7.7491,
  ARRAY['Ski from Switzerland to Italy on the world longest uninterrupted descent', 'Certified IFMGA guide with safety beacon and crevasses rescue equipment', 'Private access to untracked glacier powder fields', 'Alpine fondue & Valais wine stop at an exclusive mountain rifugio'],
  ARRAY['International Zermatt-Cervinia ski pass', 'Certified UIAGM / IFMGA Swiss Mountain Guide', 'Full avalanche safety gear kit (Mammut Barryvox)', 'Four-course alpine lunch with wine pairing'],
  'December – April',
  'Private (1-4 skiers)',
  'High Energy'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO experiences (
  id, title, description, short_description, destination_id, category,
  image_url, gallery_urls, location, duration, price, rating, reviews_count,
  latitude, longitude, highlights, included, best_time, group_type, physical_level
) VALUES (
  'amalfi-private-yacht-faraglioni',
  'Private Riva Yacht Sail & Secret Sea Caves',
  'Board a handcrafted Riva Aquarama yacht in Positano for an exhilarating private voyage across the Gulf of Salerno to Capri. Slice through cobalt Mediterranean waves, drop anchor in secluded coves accessible only by sea, and snorkel inside the White and Green Grottos.',
  'Speed along dramatic vertical cliffs in a vintage Italian mahogany yacht, diving into emerald sea grottos and swimming through the Faraglioni arch.',
  'amalfi-coast',
  'Adventure',
  'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
  ARRAY['https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80'],
  'Positano & Capri, Amalfi Coast, Italy',
  '5 Hours',
  '₹43,000 per guest',
  4.98,
  164,
  40.634,
  14.6027,
  ARRAY['Private Riva motor yacht with experienced captain & steward', 'Anchor in hidden coves for secluded Mediterranean swimming and seabob gliding', 'Passage through the legendary Faraglioni rock passage of Capri', 'Complimentary Franciacorta sparkling wine, fresh figs, and mozzarella'],
  ARRAY['Private charter yacht & fuel', 'Skipper, steward, and snorkeling gear', 'Gourmet aperitivo & chilled Italian wines', 'Capri port docking taxes'],
  'May – October',
  'Private Yacht (Up to 6 guests)',
  'Moderate'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO experiences (
  id, title, description, short_description, destination_id, category,
  image_url, gallery_urls, location, duration, price, rating, reviews_count,
  latitude, longitude, highlights, included, best_time, group_type, physical_level
) VALUES (
  'udaipur-city-palace-curator',
  'Exclusive City Palace Royal Vaults & Fresco Tour',
  'Unlock 450 years of Mewar royal history with direct access to private halls of the Udaipur City Palace. Walk through Mor Chowk (Peacock Courtyard) with its 5,000 glass mosaic tiles, study priceless 17th-century miniature paintings, and explore the legendary Crystal Gallery commissioned by Maharana Sajjan Singh.',
  'Step through private Mewar dynasty royal quarters, crystal gallery, and historic armor vaults with an official palace curator.',
  'udaipur',
  'Culture',
  'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
  ARRAY['https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80'],
  'City Palace, Udaipur, Rajasthan, India',
  '3.5 Hours',
  '₹6,200 per guest',
  4.99,
  210,
  24.5854,
  73.7125,
  ARRAY['Private curator-guided access through royal residential wings', 'Exclusive viewing of the world-famous F. & C. Osler Crystal collection', 'Miniature painting masterclass with master artisan in palace atelier', 'High tea at the Shiv Niwas Palace royal terrace'],
  ARRAY['VIP all-access palace and crystal gallery entry', 'Personal art historian curator guide', 'Royal high tea with sparkling refreshments', 'Chauffeured luxury vintage car transit'],
  'October – March',
  'Private Tour (1-4 guests)',
  'Gentle'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO experiences (
  id, title, description, short_description, destination_id, category,
  image_url, gallery_urls, location, duration, price, rating, reviews_count,
  latitude, longitude, highlights, included, best_time, group_type, physical_level
) VALUES (
  'mysore-palace-durbar-illumination',
  'Private Mysore Royal Heritage & Durbar Illumination',
  'Step into the gilded era of South India most legendary royal kingdom. Accompanied by a court historian, explore the private corridors, ivory-inlaid doors, and stained glass ceilings of Amba Vilas Palace. Stroll through the royal carriage stables and witness the awe-inspiring spectacle as 100,000 golden incandescent bulbs illuminate the grand palace facade against the dark sky.',
  'An aristocratic journey through the Indo-Saracenic royal halls of the Wadiyar dynasty with private historian access and 100,000 bulb illumination.',
  'mysore',
  'Culture',
  'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80',
  ARRAY['https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80'],
  'Mysore, Karnataka, India',
  '4 Hours (Afternoon to Evening)',
  '₹6,500 per guest',
  4.97,
  182,
  12.3051,
  76.6551,
  ARRAY['VIP historian-led tour through restricted residential wings of Mysore Palace', 'Private seating for the magnificent 100,000-bulb palace light-up spectacle', 'Visit to traditional sandalwood oil distilleries and rosewood inlay ateliers', 'Royal Mysore Pak tasting prepared with pure ghee at origin sweetmakers'],
  ARRAY['VIP skip-the-line palace permits & shoe storage concierge', 'Dedicated court historian and cultural guide', 'Royal palace illumination reserved seating', 'Private air-conditioned chauffeur vehicle'],
  'October – March',
  'Private Guided Experience',
  'Gentle'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO experiences (
  id, title, description, short_description, destination_id, category,
  image_url, gallery_urls, location, duration, price, rating, reviews_count,
  latitude, longitude, highlights, included, best_time, group_type, physical_level
) VALUES (
  'kyoto-geisha-tea-ceremony',
  'Gion Ochaya Private Tea Ceremony & Geiko Arts',
  'Enter the secretive, discreet world of Gion karyū (the flower and willow world). Hosted in a heritage 200-year-old machiya teahouse, participate in a formal Chanoyu tea ceremony led by an authentic Grand Master. Learn the delicate choreography of whisking ceremonial Uji matcha before enjoying a private classical dance and shamisen musical performance.',
  'Step beyond closed traditional sliding doors into a historic 200-year-old teahouse for an exclusive chado tea ritual and shamisen performance.',
  'kyoto',
  'Culture',
  'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
  ARRAY['https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80'],
  'Gion District, Kyoto, Japan',
  '2.5 Hours',
  '₹21,500 per guest',
  4.99,
  94,
  35.0116,
  135.7681,
  ARRAY['Exclusive access to an invitation-only traditional Gion Ochaya (teahouse)', 'Formal Chanoyu matcha preparation with a licensed Urasenke Tea Master', 'Private classical performance and seasonal dance by a Geiko & Maiko', 'Cultural etiquette dialogue translated by a bilingual Kyoto cultural envoy'],
  ARRAY['Private teahouse booking & hostess fees', 'Bilingual expert cultural host', 'Ceremonial grade Uji matcha & seasonal handcrafted wagashi sweets', 'Maiko commemorative photography opportunity'],
  'Year-round',
  'Exclusive Private Reservation',
  'Gentle'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO experiences (
  id, title, description, short_description, destination_id, category,
  image_url, gallery_urls, location, duration, price, rating, reviews_count,
  latitude, longitude, highlights, included, best_time, group_type, physical_level
) VALUES (
  'kerala-spice-sadya-mastery',
  'Kumarakom Ancestral Spice Trail & 24-Dish Sadya',
  'Immerse in the aromatic culinary heartland of God’s Own Country. Walk through century-old spice plantations picking fresh nutmeg, cinnamon bark, and vanilla pods. Under the guidance of a celebrated Kerala master chef, prepare traditional Avial, Thoran, and Payasam in heavy bronze uruli vessels, enjoying the grand 24-item vegetarian Sadya.',
  'Forage green cardamom and Tellicherry pepper in ancestral spice orchards, followed by a grand traditional 24-course banana leaf feast.',
  'kerala',
  'Food',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
  ARRAY['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80'],
  'Kumarakom, Kerala, India',
  '4 Hours',
  '₹4,500 per guest',
  4.98,
  175,
  9.4981,
  76.3388,
  ARRAY['Guided spice foraging through organic backwater orchards', 'Hands-on cooking class with heritage brass Uruli cookware', 'Grand 24-course authentic banana leaf feast with payasam pairings', 'Take-home jar of fresh single-estate Tellicherry black peppercorns'],
  ARRAY['Master chef culinary class and printed recipe folios', 'Full 24-course Sadya luncheon', 'Estate spice gift hamper', 'Fresh tender coconut welcome drink'],
  'September – April',
  'Small Group (Max 8)',
  'Relaxed'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO experiences (
  id, title, description, short_description, destination_id, category,
  image_url, gallery_urls, location, duration, price, rating, reviews_count,
  latitude, longitude, highlights, included, best_time, group_type, physical_level
) VALUES (
  'amalfi-lemon-grove-pasta-atelier',
  'Cliffside Lemon Grove Atelier & Handcrafted Pasta',
  'Ascend the terraced slopes of Ravello overlooking the azure Tyrrhenian Sea. Stroll through fragrant groves of giant Sfusato Amalfitano lemons that have grown here since the Maritime Republic era. Under the shade of pergolas, learn the timeless method of rolling handmade scialatielli pasta from scratch and creating delicate lemon-infused cacio e pepe.',
  'Gather organic Sfusato lemons in a panoramic cliffside terrace, press Limoncello, and knead fresh hand-rolled scialatielli pasta with sea views.',
  'amalfi-coast',
  'Food',
  'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1200&q=80',
  ARRAY['https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80'],
  'Ravello & Amalfi Coast, Italy',
  '4 Hours',
  '₹16,500 per guest',
  4.99,
  204,
  40.634,
  14.6027,
  ARRAY['Private harvest in historic terraced lemon groves suspended over the sea', 'Hands-on pasta masterclass with a generational local Italian nonna and chef', 'Limoncello distillation and tasting of 3 vintage batches', 'Al fresco cliffside dining with panoramic coastal views and DOC Campania wines'],
  ARRAY['Cooking class instruction, aprons, and recipe folios', 'Full 4-course lunch prepared during class', 'Sommelier selected local wines and handcrafted Limoncello', 'Bottled artisan organic Limoncello keepsake'],
  'April – October',
  'Private / Intimate (Max 6)',
  'Relaxed'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO experiences (
  id, title, description, short_description, destination_id, category,
  image_url, gallery_urls, location, duration, price, rating, reviews_count,
  latitude, longitude, highlights, included, best_time, group_type, physical_level
) VALUES (
  'kyoto-michelin-kaiseki',
  'Private Kamo River Kaiseki & Rare Sake Pairing',
  'Experience the pinnacle of Japanese culinary philosophy at an exclusive multi-generation ryotei. Each dish is an exquisite seasonal canvas celebrating the micro-seasons of Japan—featuring grilled sweetfish (Ayu), Kyoto heirloom vegetables (Kyo-yasai), and A5 Wagyu beef. Every course is paired with rare craft sakes hand-selected by an in-house Master of Sake.',
  'Seasonal 9-course Michelin-starred kaiseki dinner overlooking the Kamo River paired with ultra-rare Junmai Daiginjo sakes.',
  'kyoto',
  'Food',
  'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1200&q=80',
  ARRAY['https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80'],
  'Gion & Kamo River, Kyoto, Japan',
  '3 Hours',
  '₹24,000 per guest',
  4.99,
  128,
  35.0116,
  135.7681,
  ARRAY['Private tatami room overlooking a serene stone garden and the Kamo River', 'Nine-course kaiseki menu curated by a third-generation master chef', 'Curated flight of 5 rare single-brewery Junmai Daiginjo sakes', 'Culinary explanation of the Buddhist washoku concept'],
  ARRAY['Complete 9-course Kaiseki tasting menu', 'Curated premium sake pairing flight', 'Private dining room reservation fees', 'Personal bilingual culinary concierge'],
  'Year-round',
  'Private Dining (2-6 guests)',
  'Relaxed'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO experiences (
  id, title, description, short_description, destination_id, category,
  image_url, gallery_urls, location, duration, price, rating, reviews_count,
  latitude, longitude, highlights, included, best_time, group_type, physical_level
) VALUES (
  'swiss-alps-heli-flight-glacier',
  'Private Golden Hour Heli-Flight over Alpine Peaks',
  'Take to the skies in an Airbus H130 helicopter for an unforgettable aerial voyage above the crowned jewels of the Swiss Alps. Fly within arm reach of the sheer Eiger North Face and the turquoise glacial ribbons of Aletsch Glacier—the largest glacier in Europe. Touch down on an untouched high-altitude snowfield for a private champagne toast.',
  'Soar past the north face of the Eiger, Mönch, and Matterhorn before a private champagne landing on a high alpine glacier.',
  'swiss-alps',
  'Sightseeing',
  'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=1200&q=80',
  ARRAY['https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80'],
  'Interlaken & Zermatt, Switzerland',
  '1.5 Hours (45 min flight time)',
  '₹56,000 per guest',
  4.99,
  118,
  45.9763,
  7.7491,
  ARRAY['Close aerial circuits around the Matterhorn and Jungfrau summits', 'Glacier landing at 3,200m with mountain safety certified alpine pilot', 'Private Dom Pérignon champagne toast on pristine snow', 'Bespoke 4K cinematic in-flight video capture'],
  ARRAY['Helicopter charter & certified commercial mountain pilot', 'Glacier landing permits and eco-offset certificate', 'Vintage champagne & Swiss artisan chocolates on the glacier', 'Luxury door-to-helipad transfers'],
  'Year-round (Clear blue winter or golden summer days)',
  'Private Helicopter (Up to 5 guests)',
  'Gentle'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO experiences (
  id, title, description, short_description, destination_id, category,
  image_url, gallery_urls, location, duration, price, rating, reviews_count,
  latitude, longitude, highlights, included, best_time, group_type, physical_level
) VALUES (
  'santorini-caldera-sunset-cruise',
  'Santorini Caldera Sunset Cruise & Volcanic Springs',
  'Set sail from the historic port of Ammoudi aboard a luxury Lagoon catamaran. Cruise past the volcanic Red and White beaches, swimming in the warm, healing sulfur mud baths of Palea Kameni volcano. As dusk approaches, drift into prime position beneath the white-washed cliffside village of Oia.',
  'Sail through the submerged volcano caldera on a luxury catamaran, swim in thermal sulfur springs, and watch the famed Oia sunset.',
  'santorini',
  'Sightseeing',
  'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
  ARRAY['https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80'],
  'Oia & Caldera, Santorini, Greece',
  '5 Hours (Afternoon to Sunset)',
  '₹19,500 per guest',
  4.97,
  310,
  36.4618,
  25.3753,
  ARRAY['Front-row vantage point for the iconic Oia cliffside sunset', 'Thermal swim in natural volcanic hot springs of Nea Kameni', 'Snorkeling around the vibrant underwater reefs of Indian Rock', 'Freshly grilled Greek seafood and steak buffet prepared on board'],
  ARRAY['Catamaran cruise, skipper and full crew', 'Fresh gourmet dinner buffet with unlimited Santorini wines', 'Snorkeling gear & floating aids', 'Round-trip luxury hotel transfers across Santorini'],
  'April – November',
  'Semi-Private / Private Option (Max 14)',
  'Gentle'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO experiences (
  id, title, description, short_description, destination_id, category,
  image_url, gallery_urls, location, duration, price, rating, reviews_count,
  latitude, longitude, highlights, included, best_time, group_type, physical_level
) VALUES (
  'coorg-ayurveda-sound-sanctuary',
  'Ayurvedic Abhyanga & Western Ghats Sound Healing',
  'Surrender to the ancient healing traditions of Ayurveda in an open-air forest pavilion overlooking mist-draped coffee hills. Begin with a pulse diagnosis by an Ayurvedic Vaidya doctor, followed by a warm herbal oil Abhyanga synchronized massage performed by two therapists.',
  'A 3-hour holistic rejuvenation ritual featuring four-hand warm herbal oil Abhyanga, Shirodhara, and Tibetan singing bowl sound therapy.',
  'coorg',
  'Wellness',
  'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
  ARRAY['https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1512290900672-1f03f3922374?auto=format&fit=crop&w=1200&q=80'],
  'Coorg, Karnataka, India',
  '3 Hours',
  '₹6,800 per guest',
  4.98,
  165,
  12.4244,
  75.7382,
  ARRAY['Personal Ayurvedic pulse diagnosis (Nadi Pariksha) by an experienced Vaidya', 'Synchronized 4-hand warm medicated herbal oil Abhyanga therapy', 'Authentic Shirodhara stream therapy for deep nervous system relaxation', 'Acoustic sound bath using 7-metal hand-hammered singing bowls and chimes'],
  ARRAY['Complete 180-minute customized Ayurvedic treatment session', 'Organic herbal body scrubs and fresh botanical steam bath', 'Nourishing warm herbal detox concoction & dried fruit platter', 'Personalized Dosha lifestyle and diet recommendation chart'],
  'Year-round',
  'Individual / Couple Private Suite',
  'Meditative'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO experiences (
  id, title, description, short_description, destination_id, category,
  image_url, gallery_urls, location, duration, price, rating, reviews_count,
  latitude, longitude, highlights, included, best_time, group_type, physical_level
) VALUES (
  'gokarna-cliffside-pranic-yoga',
  'Om Beach Cliffside Sunset Yoga & Pranic Breathwork',
  'Unite breath, body, and ocean rhythm on a secluded clifftop yoga deck in Gokarna. Guided by an experienced yogic master, practice mindful asanas designed to release tension and align energy centers. Conclude as the golden sun sinks into the Arabian Sea with calming Pranayama breathwork.',
  'Practice Hatha and Vinyasa yoga on a private clifftop deck overlooking the Om-shaped coastline, guided by a Himalayan master.',
  'gokarna',
  'Wellness',
  'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
  ARRAY['https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'],
  'Om Beach, Gokarna, Karnataka, India',
  '2 Hours (Sunset)',
  '₹2,400 per guest',
  4.94,
  121,
  14.5479,
  74.3188,
  ARRAY['Private panoramic clifftop deck with 180-degree Arabian Sea views', 'Accessible for both beginners and advanced yoga practitioners', 'Deep calming Pranayama and guided mindfulness meditation', 'Freshly harvested tender coconuts and organic Ayurvedic herbal infusions'],
  ARRAY['Premium organic cork yoga mats, bolsters, and blocks', 'Instruction by certified Himalayan yoga master', 'Sunset herbal tea and fresh coconut refreshment', 'Complimentary beach meditation audio guide'],
  'October – April',
  'Private / Intimate Group (Max 10)',
  'Meditative'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO experiences (
  id, title, description, short_description, destination_id, category,
  image_url, gallery_urls, location, duration, price, rating, reviews_count,
  latitude, longitude, highlights, included, best_time, group_type, physical_level
) VALUES (
  'kyoto-forest-bathing-onsen',
  'Kyoto Sacred Forest Bathing (Shinrin-yoku) & Mineral Onsen',
  'Reclaim inner balance through the scientifically proven art of Shinrin-yoku (forest bathing). Walk mindfully among towering 800-year-old Japanese cedar and cypress trees in the sacred mountains of Kurama. Follow sensory mindfulness invitations that lower cortisol and boost vitality.',
  'Mindful sensory immersion in ancient cedar forests of Kurama mountain followed by private mineral hot spring soaking in cedar baths.',
  'kyoto',
  'Wellness',
  'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=80',
  ARRAY['https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80'],
  'Kurama & Mount Hiei, Kyoto, Japan',
  '4 Hours',
  '₹13,500 per guest',
  4.99,
  104,
  35.0116,
  135.7681,
  ARRAY['Guided Shinrin-yoku session led by a certified Japanese Forest Therapy Guide', 'Private outdoor cedar rotemburo (hot spring onsen) reservation', 'Mindful tea ceremony among mountain streams', 'Cedarwood essential oil aromatherapy mist gift'],
  ARRAY['Certified Forest Therapy Guide instruction', 'Private onsen rental and traditional yukata robes', 'Forest herb tea and seasonal organic bento snack', 'Private mountain transit from Central Kyoto'],
  'Year-round',
  'Private (1-4 guests)',
  'Meditative'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO experiences (
  id, title, description, short_description, destination_id, category,
  image_url, gallery_urls, location, duration, price, rating, reviews_count,
  latitude, longitude, highlights, included, best_time, group_type, physical_level
) VALUES (
  'bengaluru-lalbagh-botanical-dawn',
  'Lalbagh Botanical Heritage & Glass House Floriculture Walk',
  'Breathe in the crisp morning air of the Garden City. Guided by an eminent botanist and landscape historian, wander through 240 acres of rare centuries-old trees commissioned by Hyder Ali and Tipu Sultan. Explore the London Crystal Palace-inspired Glass House, climb the 3,000-million-year-old Lalbagh Rock monolith, and enjoy fresh coconut water under towering silk cotton canopies.',
  'Sunrise walking tour through 240 acres of century-old tropical trees, lotus lagoons, and the iconic Victorian Glass House with an expert botanist.',
  'bengaluru',
  'Nature',
  'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
  ARRAY['https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80'],
  'Lalbagh Botanical Garden, Bengaluru, Karnataka, India',
  '3 Hours (Sunrise)',
  '₹3,500 per guest',
  4.97,
  168,
  12.9716,
  77.5946,
  ARRAY['Private botanist-led walk through historical flora and ancient bonsai collection', 'Exclusive morning photography inside the Victorian Glass House', 'Panoramic 360-degree Bengaluru skyline views from the geological Lalbagh Rock', 'Traditional South Indian filter coffee & steamed idli breakfast at nearby MTR'],
  ARRAY['VIP garden permits and morning entry', 'Senior botanist and cultural guide', 'Botanical field guidebook & macro photo assistance', 'Authentic heritage South Indian breakfast'],
  'Year-round (Best October – March)',
  'Small Group / Private (Max 8)',
  'Gentle'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO experiences (
  id, title, description, short_description, destination_id, category,
  image_url, gallery_urls, location, duration, price, rating, reviews_count,
  latitude, longitude, highlights, included, best_time, group_type, physical_level
) VALUES (
  'bengaluru-palace-royal-curator',
  'Bangalore Palace Royal Tudor Quarters & Art Archives',
  'Explore the grand Tudor and Scottish Gothic castle built by the Wadiyar Maharajas in 1878. Walk through fortified towers, the magnificent Durbar Hall with stained glass, the open Moroccan courtyard with hand-painted ceramic tiles, and private galleries showcasing historic weapons, ceremonial costumes, and rare Ravi Varma canvases.',
  'Curator-led VIP tour of the 19th-century Tudor-style royal palace, wooden floral carvings, and original Raja Ravi Varma oil paintings.',
  'bengaluru',
  'Culture',
  'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80',
  ARRAY['https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80'],
  'Bangalore Palace, Bengaluru, Karnataka, India',
  '3.5 Hours',
  '₹5,800 per guest',
  4.96,
  142,
  12.9716,
  77.5946,
  ARRAY['Curator-led access into private royal corridors and ballroom galleries', 'Viewing of rare 19th-century royal portrait collections and crystal chandeliers', 'Stroll through sprawling royal grounds and equestrian stables', 'Palace veranda high tea with artisanal Karnataka tea selections'],
  ARRAY['VIP palace skip-the-line entrance tickets', 'Personal art historian curator guide', 'Afternoon royal high tea service', 'Chauffeured luxury city transit'],
  'October – April',
  'Private Tour (1-6 guests)',
  'Gentle'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO experiences (
  id, title, description, short_description, destination_id, category,
  image_url, gallery_urls, location, duration, price, rating, reviews_count,
  latitude, longitude, highlights, included, best_time, group_type, physical_level
) VALUES (
  'bengaluru-heritage-coffee-food-trail',
  'Old Bengaluru Heritage Tiffin & Filter Kaapi Tasting',
  'Immerse your palate in the authentic culinary legends of Old Bengaluru. Stroll along the tree-lined avenues of Gandhi Bazaar and Basavanagudi, visiting generational eateries operating since the 1920s. Learn the art of frothing filter coffee in brass davarahs, savor crisp golden butter dosas served on plantain leaves, and taste fragrant sandalwood and Mysore pak treats.',
  'A guided morning culinary journey tasting iconic crispy Benne Dosas, Kesari Bath, and slow-dripped degree filter coffee at legendary institutions.',
  'bengaluru',
  'Food',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
  ARRAY['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80'],
  'Basavanagudi & Malleshwaram, Bengaluru, Karnataka, India',
  '3.5 Hours',
  '₹3,200 per guest',
  4.98,
  220,
  12.9716,
  77.5946,
  ARRAY['Taste authentic Bengaluru Benne Masala Dosa, Rava Idli, and Chow-Chow Bath', 'Filter coffee brewing demonstration and single-origin Chikmagalur bean tasting', 'Walk through the flower and spice lanes of historic Gandhi Bazaar', 'Visit the 16th-century monolithic Bull Temple (Nandi)'],
  ARRAY['All food and specialty beverage tastings at 5 iconic eateries', 'Expert culinary storyteller & neighborhood guide', 'Artisanal Chikmagalur ground coffee beans keepsake pack', 'Private air-conditioned neighborhood transfers'],
  'Year-round',
  'Small Group / Intimate (Max 8)',
  'Relaxed'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO experiences (
  id, title, description, short_description, destination_id, category,
  image_url, gallery_urls, location, duration, price, rating, reviews_count,
  latitude, longitude, highlights, included, best_time, group_type, physical_level
) VALUES (
  'bengaluru-nandi-hills-sunrise-vineyard',
  'Nandi Hills Sea-of-Clouds Dawn & Valley Vineyard Tour',
  'Depart Bengaluru in the pre-dawn quiet for the scenic granite fortress of Nandi Hills. Watch the crimson sun emerge over rolling blankets of mist from Tipu’s Drop. Descend into the fertile Nandi Valley for a private tour of pioneering Karnataka vineyards, sampling Cabernet Sauvignon and Shiraz alongside artisanal cheese boards.',
  'Private dawn excursion to the 4,851-ft fortress peak to witness the morning sea-of-clouds, followed by artisanal wine tasting in the valley.',
  'bengaluru',
  'Adventure',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
  ARRAY['https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80'],
  'Nandi Hills & Chikkaballapur, Greater Bengaluru, Karnataka, India',
  '6 Hours (Dawn to Lunch)',
  '₹7,500 per guest',
  4.99,
  178,
  12.9716,
  77.5946,
  ARRAY['Private sunrise vantage point above the cloud layer at 4,851 ft', 'Tour of the 1,000-year-old Bhoga Nandeeshwara temple with Dravidian stone carvings', 'Guided vineyard barrel room tasting of 4 estate reserve wines', 'Farm-to-table lunch served in the vineyard olive orchard'],
  ARRAY['Chauffeured luxury SUV round-trip from Bengaluru', 'Hilltop entry & special sunrise permits', 'Vineyard tour, barrel tasting & 3-course wine-paired lunch', 'Experienced outdoor naturalist & sommelier'],
  'October – May',
  'Private Vehicle / Small Group (Max 6)',
  'Moderate'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO experiences (
  id, title, description, short_description, destination_id, category,
  image_url, gallery_urls, location, duration, price, rating, reviews_count,
  latitude, longitude, highlights, included, best_time, group_type, physical_level
) VALUES (
  'bengaluru-craft-brewery-chef-table',
  'Indiranagar Craft Gastronomy & Microbrewery Trail',
  'Discover why Bengaluru is renowned as the craft brewing hub of Asia. Tour bespoke microbreweries with a master brewer tasting Belgian Witbiers, mango IPAs, and stout infused with local Coorg cacao. Conclude with a private 6-course modern South Indian tasting menu crafted by celebrated avant-garde chefs.',
  'Explore India’s craft beer capital with a certified cicerone and savor modern South Indian culinary masterclasses at top chef tables.',
  'bengaluru',
  'Food',
  'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1200&q=80',
  ARRAY['https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80'],
  'Indiranagar & Lavelle Road, Bengaluru, Karnataka, India',
  '4 Hours (Evening)',
  '₹5,500 per guest',
  4.97,
  156,
  12.9716,
  77.5946,
  ARRAY['Behind-the-scenes brewery fermentation room tour with master brewer', 'Flight of 5 craft beers paired with artisanal cheeses and bites', '6-course modern South Indian dinner at a reserved chef’s table', 'Boutique cocktail concoctions infused with cardamom and betel leaf'],
  ARRAY['All craft beer flights, pairing bites, and 6-course dinner', 'Master cicerone culinary host', 'Reserved VIP seating at premier venues', 'Private evening chauffeur ride'],
  'Year-round',
  'Private / Intimate Group (Max 8)',
  'Relaxed'
) ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------
-- 3. USERS
-- ----------------------------------------------------------
INSERT INTO users (id, name, email, password_hash)
VALUES (
  'user-demo-voyager-1',
  'Alexander Sterling',
  'alexander@aurictravel.com',
  '$2a$10$T80j3sDqA3eP9s8rQ6cE..gJqLqV9aQZgN7v81u7R0Lg3pW1yZ5xU'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, name, email, password_hash)
VALUES (
  'usr_auric_demo_01',
  'Ajay Reddy',
  'ajayreddy9164@gmail.com',
  '$2a$10$T80j3sDqA3eP9s8rQ6cE..gJqLqV9aQZgN7v81u7R0Lg3pW1yZ5xU'
) ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------
-- 4. TRIPS
-- ----------------------------------------------------------
INSERT INTO trips (
  id, user_id, destination_id, title, number_of_days, budget,
  travel_style, interests, total_estimated_cost
) VALUES (
  'trip-hampi-royal-heritage-4d',
  'usr_auric_demo_01',
  'hampi',
  'Royal Vijayanagara & Boulder Sanctuary 4-Day Journey',
  4,
  'Signature Luxury',
  'Deep Cultural Immersion',
  ARRAY['Heritage Architecture', 'Riverside Bouldering', 'Private Coracle Drift', 'Royal Gastronomy'],
  '₹56,000 ($680)'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO trips (
  id, user_id, destination_id, title, number_of_days, budget,
  travel_style, interests, total_estimated_cost
) VALUES (
  'trip-coorg-coffee-wellness-3d',
  'usr_auric_demo_01',
  'coorg',
  'Cloud-Forest Coffee Estates & Ayurvedic Sanctuary 3-Day Retreat',
  3,
  'Ultra-Luxury Bespoke',
  'Relaxed & Unhurried',
  ARRAY['Private Estate Villas', 'Cupping Masterclass', 'Ayurvedic Sound Sanctuary', 'Spice Trails'],
  '₹42,500 ($515)'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO trips (
  id, user_id, destination_id, title, number_of_days, budget,
  travel_style, interests, total_estimated_cost
) VALUES (
  'trip-udaipur-royal-mewar-4d',
  'usr_auric_demo_01',
  'udaipur',
  'Imperial Mewar & Lake Pichola Starlit Sojourn',
  4,
  'Signature Luxury',
  'Royal Rajputana',
  ARRAY['Palace Architecture', 'Private Yachting', 'Mewari Banquets', 'Miniature Painting'],
  '₹1,20,000 ($1,450)'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO trips (
  id, user_id, destination_id, title, number_of_days, budget,
  travel_style, interests, total_estimated_cost
) VALUES (
  'trip-kerala-backwaters-ayurveda-5d',
  'usr_auric_demo_01',
  'kerala',
  'Emerald Palm Canopy & Ayurvedic Backwaters Voyage',
  5,
  'Wellness Bespoke',
  'Slow Luxury',
  ARRAY['Private Houseboat', 'Ayurveda', 'Spice Harvest', 'Sadya Feasts'],
  '₹85,000 ($1,020)'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO trips (
  id, user_id, destination_id, title, number_of_days, budget,
  travel_style, interests, total_estimated_cost
) VALUES (
  'trip-kabini-wildlife-sanctuary-3d',
  'usr_auric_demo_01',
  'kabini',
  'Nagarhole Wilderness & Black Panther River Patrol',
  3,
  'Wildlife Luxury',
  'Active Expedition',
  ARRAY['Predator Tracking', 'River Safari', 'Forest Glamping', 'Birding'],
  '₹68,000 ($820)'
) ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------
-- 5. TRIP ITEMS
-- ----------------------------------------------------------
INSERT INTO trip_items (
  id, trip_id, experience_id, destination_id, day_number,
  title, description, start_time, estimated_cost, latitude, longitude
) VALUES (
  'item-hampi-d1-1',
  'trip-hampi-royal-heritage-4d',
  NULL,
  'hampi',
  1,
  'Arrival & Kamalapura Royal Welcome',
  'Private luxury check-in to heritage palace suite followed by sunset tea overlooking royal ruins.',
  '14:00',
  'Included in Stay',
  15.335,
  76.46
) ON CONFLICT (id) DO NOTHING;

INSERT INTO trip_items (
  id, trip_id, experience_id, destination_id, day_number,
  title, description, start_time, estimated_cost, latitude, longitude
) VALUES (
  'item-hampi-d1-2',
  'trip-hampi-royal-heritage-4d',
  'hampi-boulder-coracle',
  'hampi',
  1,
  'Tungabhadra Sacred Coracle & Bouldering Sunset Glide',
  'Glide in traditional wicker boats past ancient granite boulder canyons as evening temple bells echo.',
  '16:30',
  '₹4,500 ($55)',
  15.335,
  76.46
) ON CONFLICT (id) DO NOTHING;

INSERT INTO trip_items (
  id, trip_id, experience_id, destination_id, day_number,
  title, description, start_time, estimated_cost, latitude, longitude
) VALUES (
  'item-hampi-d2-1',
  'trip-hampi-royal-heritage-4d',
  NULL,
  'hampi',
  2,
  'Vijaya Vittala Temple & Stone Chariot Dawn Walk',
  'Private historian-guided exploration of the 15th-century musical pillars before public entry.',
  '06:30',
  '₹2,800 ($34)',
  15.335,
  76.46
) ON CONFLICT (id) DO NOTHING;

INSERT INTO trip_items (
  id, trip_id, experience_id, destination_id, day_number,
  title, description, start_time, estimated_cost, latitude, longitude
) VALUES (
  'item-hampi-d3-1',
  'trip-hampi-royal-heritage-4d',
  NULL,
  'hampi',
  3,
  'Virupaksha Temple Aarti & River Ghats',
  'Witness morning spiritual ceremonies and explore the vibrant ancient temple market.',
  '08:00',
  '₹1,500 ($18)',
  15.335,
  76.46
) ON CONFLICT (id) DO NOTHING;

INSERT INTO trip_items (
  id, trip_id, experience_id, destination_id, day_number,
  title, description, start_time, estimated_cost, latitude, longitude
) VALUES (
  'item-coorg-d1-1',
  'trip-coorg-coffee-wellness-3d',
  'coorg-ayurveda-sound-sanctuary',
  'coorg',
  1,
  'Ayurvedic Sound Sanctuary & Plantation Arrival',
  'Private check-in to estate villa and herbal sound bath in rainforest canopy.',
  '15:00',
  '₹3,500 ($42)',
  12.3375,
  75.8069
) ON CONFLICT (id) DO NOTHING;

INSERT INTO trip_items (
  id, trip_id, experience_id, destination_id, day_number,
  title, description, start_time, estimated_cost, latitude, longitude
) VALUES (
  'item-udaipur-d1-1',
  'trip-udaipur-royal-mewar-4d',
  'udaipur-vintage-boat-sunset',
  'udaipur',
  1,
  'Royal Mewar Solar Yacht Sunset Cruise',
  'Private solar yacht navigation past illuminated Lake Palace and Jag Mandir.',
  '17:00',
  '₹7,500 ($90)',
  24.5854,
  73.7125
) ON CONFLICT (id) DO NOTHING;

INSERT INTO trip_items (
  id, trip_id, experience_id, destination_id, day_number,
  title, description, start_time, estimated_cost, latitude, longitude
) VALUES (
  'item-udaipur-d2-1',
  'trip-udaipur-royal-mewar-4d',
  'udaipur-city-palace-curator',
  'udaipur',
  2,
  'Private Curator Walk: Mewar Royal Quarters',
  'Exclusive access to private royal chambers, crystal gallery, and armor collection.',
  '10:00',
  '₹6,000 ($72)',
  24.5764,
  73.6835
) ON CONFLICT (id) DO NOTHING;

INSERT INTO trip_items (
  id, trip_id, experience_id, destination_id, day_number,
  title, description, start_time, estimated_cost, latitude, longitude
) VALUES (
  'item-kerala-d1-1',
  'trip-kerala-backwaters-ayurveda-5d',
  'kerala-backwaters-kayak-drift',
  'kerala',
  1,
  'Vembanad Lake Dawn Kayak Drift',
  'Paddle through narrow canal waterways as village life awakens along the palm banks.',
  '06:00',
  '₹3,200 ($38)',
  9.6,
  76.4
) ON CONFLICT (id) DO NOTHING;

INSERT INTO trip_items (
  id, trip_id, experience_id, destination_id, day_number,
  title, description, start_time, estimated_cost, latitude, longitude
) VALUES (
  'item-kabini-d1-1',
  'trip-kabini-wildlife-sanctuary-3d',
  'kabini-predator-safari',
  'kabini',
  1,
  'Nagarhole Deep Jungle Safari & River Patrol',
  'Track elusive leopards and majestic wild elephant herds in private 4x4 open safari.',
  '05:45',
  '₹14,500 ($175)',
  11.95,
  76.25
) ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------
-- 6. BOOKINGS (Currency: INR, UTF-8 formatted)
-- ----------------------------------------------------------
INSERT INTO bookings (
  id, user_id, destination_id, experience_id, trip_id,
  booking_date, booking_status, number_of_people, total_amount, currency
) VALUES (
  'book-demo-aur-1',
  'user-demo-voyager-1',
  'hampi',
  'hampi-boulder-coracle',
  'trip-hampi-royal-heritage-4d',
  '2026-10-15',
  'confirmed',
  2,
  32480.00,
  'INR'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO bookings (
  id, user_id, destination_id, experience_id, trip_id,
  booking_date, booking_status, number_of_people, total_amount, currency
) VALUES (
  'book-demo-aur-2',
  'user-demo-voyager-1',
  'coorg',
  'coorg-ayurveda-sound-sanctuary',
  'trip-coorg-coffee-wellness-3d',
  '2026-11-20',
  'confirmed',
  2,
  19500.00,
  'INR'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO bookings (
  id, user_id, destination_id, experience_id, trip_id,
  booking_date, booking_status, number_of_people, total_amount, currency
) VALUES (
  'book-sample-1',
  'usr_auric_demo_01',
  'hampi',
  'hampi-boulder-coracle',
  'trip-hampi-royal-heritage-4d',
  '2026-10-14',
  'confirmed',
  2,
  187572.00,
  'INR'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO bookings (
  id, user_id, destination_id, experience_id, trip_id,
  booking_date, booking_status, number_of_people, total_amount, currency
) VALUES (
  'book-sample-2',
  'usr_auric_demo_01',
  'kabini',
  'kabini-predator-safari',
  'trip-kabini-wildlife-sanctuary-3d',
  '2026-11-05',
  'confirmed',
  2,
  32480.00,
  'INR'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO bookings (
  id, user_id, destination_id, experience_id, trip_id,
  booking_date, booking_status, number_of_people, total_amount, currency
) VALUES (
  'book-udaipur-mewar-1',
  'usr_auric_demo_01',
  'udaipur',
  'udaipur-vintage-boat-sunset',
  'trip-udaipur-royal-mewar-4d',
  '2026-12-10',
  'confirmed',
  2,
  116000.00,
  'INR'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO bookings (
  id, user_id, destination_id, experience_id, trip_id,
  booking_date, booking_status, number_of_people, total_amount, currency
) VALUES (
  'book-kerala-drift-1',
  'usr_auric_demo_01',
  'kerala',
  'kerala-backwaters-kayak-drift',
  'trip-kerala-backwaters-ayurveda-5d',
  '2027-01-08',
  'confirmed',
  2,
  48000.00,
  'INR'
) ON CONFLICT (id) DO NOTHING;

