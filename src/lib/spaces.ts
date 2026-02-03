import type { CoordinateT, SpaceT } from './types';
import { SupportedCity } from './types';

const coords = (lat: number, lng: number): CoordinateT => ({ lat: lat, lng: lng });

type MapperSpaceT = (space: SpaceT) => SpaceT;
const prepareSpaces = (citySlug: SupportedCity): MapperSpaceT => {
	return (space: SpaceT) => {
		space.city = citySlug;
		return space;
	};
};

export const sanFranciscoSpaces: Array<SpaceT> = [
	// Reveille
	{
		name: 'Cafe Réveille',
		type: 'Cafe',
		description:
			'Coffeehouse for new american breakfast & lunch plus coffee drinks in a contemporary setting.',
		location: [
			{
				address: '201 steiner st, san francisco, ca 94117',
				coordinates: coords(37.770987, -122.431942)
			},
			{
				address: '1998 polk st, san francisco, ca 94109',
				coordinates: coords(37.79496, -122.421605)
			}
		],
		openingHours: {
			MoTuWeThFrSaSu: [7, 19]
		},
		vetted: true,
		tags: [
			'food',
			'good coffee',
			'no plugs',
			{
				label: 'wifi',
				detail: "Can be either 'espress0' or 'paradise'"
			},
			'ample seating'
		],
		images: []
	},
	// Kowloon
	{
		name: 'Kowloon Tong Cafe',
		type: 'Cafe',
		description:
			'Homey cafe serving sweet and savory Hong Kong-style snacks. Welcoming and open late, relax here with a crossword and mango sago.',
		location: [
			{
				address: '393 7th Ave, San Francisco, CA 94118',
				coordinates: coords(37.78150079175221, -122.46555062136345)
			}
		],
		openingHours: {
			MoTuWeThFrSa: [17, 24],
			Su: [15, 24]
		},
		tags: [
			'dessert',
			'asian',
			{
				label: 'website',
				url: 'http://www.kowloontongsf.com/'
			}
		],
		images: ['kowloon_001.webp'],
		vetted: true
	},
	// Velvet Raven
	{
		name: 'The Velvet Raven',
		type: 'Cafe',
		description:
			'A cute coffee shop located in a quaint part of South Park. Get away from the hustle of the city and enjoy coffee, chocolate, scones, and more!',
		location: [
			{
				address: '155 S Park St A, San Francisco, CA 94107',
				coordinates: coords(37.78093327276581, -122.39425942308144)
			}
		],
		openingHours: {
			TuWeThFrSa: [11, 21],
			Su: [11, 18]
		},
		vetted: true,
		rating: 5,
		tags: ['coffee', 'pastries', 'quiet'],
		images: ['velvet-raven_002.webp']
	},
	// 235 2nd Street
	{
		name: '235 2nd Street',
		type: 'POPO',
		description:
			'A small sunny outdoor space on the corner of 2nd and Clementina. Has some seating, good for relaxing but not really for working.',
		location: [
			{
				address: '235 2nd St, San Francisco, CA 94105',
				coordinates: coords(37.786128, -122.397315)
			}
		],
		openingHours: {
			MoTuWeThFr: [8, 18]
		},
		vetted: true,
		images: ['235-2nd_001.webp', '235-2nd_002.webp'],
		rating: 3,
		tags: ['outdoor', 'not work friendly', 'no wifi', 'no power plugs']
	},
	// 222 2nd Street (LinkedIn)
	{
		name: '222 2nd Street',
		description:
			'A large indoor hall with AC, plenty of seating, power plugs in one area, etc. The lobby of LinkedIn.',
		type: 'POPO',
		location: [
			{
				address: '222 2nd St, San Francisco, CA 94105',
				coordinates: coords(37.786539, -122.398474)
			}
		],
		rating: 4,
		vetted: true,
		tags: [
			'indoor',
			'power plugs',
			{ label: 'wifi', detail: 'SSID: 222 2nd Wifi by Meter\nPassword: 222MeterWifi' }
		],
		openingHours: {
			MoTuWeThFr: [8, 18]
		},
		images: ['222-2nd_001.webp']
	},
	// 525 Market Street
	{
		name: '525 Market Street',
		description:
			'A small outdoor plaza area with a fountain, some seating, and few restaurants nearby.',
		type: 'POPO',
		location: [
			{
				address: '525 Market St, San Francisco, CA 94105',
				coordinates: coords(37.790327, -122.399611)
			}
		],
		vetted: true,
		rating: 3,
		tags: ['outdoor', 'plaza', 'some seating'],
		openingHours: 'always open',
		images: ['525-market_001.webp']
	},
	// Delah
	{
		name: 'Delah Coffee',
		description:
			'A newly opened coffee shop serving Turkish coffee and desserts till late in the night',
		type: 'Cafe',
		images: ['delah_01.webp'],
		location: [
			{
				address: '370 4th St, San Francisco, CA 94107',
				coordinates: coords(37.7809968, -122.400205)
			}
		],
		vetted: true,
		rating: 4,
		tags: ['open late', 'work friendly', 'coffee', 'paid', 'desserts'],
		openingHours: {
			MoTuWeTh: [6, 22],
			Fr: [6, 23],
			Sa: [7, 23],
			Su: [7, 22]
		}
	},
	// 55 2nd Street
	{
		name: '55 2nd Street',
		type: 'POPO',
		rating: 4,
		description:
			'A large indoor hall with tons of indoor seating, wifi, and power plugs. WeWork vibes.',
		images: ['552nd_001.webp', '552nd_002.webp', '552nd_003.webp'],
		location: [
			{
				address: '55 2nd St, San Francisco, CA 94105',
				coordinates: coords(37.788676, -122.40049)
			}
		],
		vetted: true,
		tags: [
			{ label: 'wifi', detail: 'SSID: Public Atrium Wifi\nPassword: 552ndSTART' },
			'power plugs',
			'ample seating',
			'quiet',
			'work friendly'
		],
		openingHours: {
			MoTuWeThFr: [8, 18]
		}
	},
	// Salesforce Park
	{
		name: 'Salesforce Park',
		type: 'Rooftop',
		images: ['salesforce_park.webp'],
		openingHours: {
			MoTuWeThFrSaSu: [6, 18]
		},
		description:
			'Gondola access to an urban rooftop garden with trees, flowers & play equipment, plus a cafe terrace.',
		location: [
			{
				address: 'Salesforce Park, 425 Mission St, San Francisco, CA 94105',
				coordinates: coords(37.7897395, -122.3961656)
			}
		],
		vetted: true,
		featured: true,
		tags: ['plants', 'ample seating', 'quiet', 'eating friendly', 'cafe'],
		authorNote: 'The best park in Downtown SF! Come around sunset.',
		rating: 5
	},
	// Page & Laguna Mini Park
	{
		name: 'Page & Laguna Mini Park',
		description:
			'A tiny park with two benches for a brief repreive from the city, right in the city.',
		openingHours: 'always open',
		images: ['pgmini_01.webp'],
		rating: 4,
		location: [
			{
				address: '281 Page St, San Francisco, CA 94102',
				coordinates: coords(37.773494, -122.425274)
			}
		],
		type: 'Park',
		vetted: true,
		authorNote: 'A tiny mini park close to Hayes Valley!',
		tags: ['tiny', 'mini park', 'quiet', 'trees']
	},
	// Transamerica Redwood Park
	{
		name: 'Transamerica Redwood Park',
		type: 'POPO',
		images: ['transamerica-pyramid.jpg'],
		openingHours: 'temporarily closed',
		description:
			'Serene Downtown park with redwood trees, lots of benches & a fountain honoring Mark Twain.',
		location: [
			{
				address: 'Transamerica Redwood Park, 600 Montgomery St, San Francisco, CA 94111',
				coordinates: coords(37.795222, -122.402332)
			}
		],
		vetted: true,
		rating: 3,
		tags: ['fountain', 'statues', 'some seating'],
		authorNote: 'Currently closed for renovation.'
	},
	// 101 Second
	{
		name: '101 Second',
		type: 'POPO',
		images: ['101-second-001.webp', '101-second-002.webp', '101-second-003.webp'],
		location: [
			{
				address: '595 mission st, san francisco, ca 94105',
				coordinates: coords(37.78808, -122.399144)
			}
		],
		openingHours: {
			MoTuWeThFr: [6, 18]
		},
		description:
			'A two-story open indoor public space with seating and plants. Second floor accessible via elevator.',
		authorNote: 'Usually not too crowded. Indoor space but no air conditioning.',
		vetted: true,
		tags: ['quiet', 'ample seating', 'power plugs', 'accessible'],
		rating: 4
	},
	// 560 Mission
	{
		name: '560 Mission',
		type: 'POPO',
		images: ['560-mission-001.webp'],
		openingHours: {
			MoTuWeThFrSaSu: [8, 17]
		},
		description:
			'Outdoor space between two buildings with some healthy food options and shaded seating and statues.',
		authorNote: 'Space outside offices where finance folks eat lunch.',
		vetted: true,
		tags: ['shaded', 'statues', 'ample seating', 'outside'],
		rating: 2.5,
		location: [
			{
				address: '560 mission st, san francisco, ca 94105',
				coordinates: coords(37.788709, -122.399154)
			}
		]
	},
	// Crocker Galleria
	{
		name: 'Crocker Galleria',
		type: 'POPO',
		vetted: true,
		rating: 3,
		location: [
			{
				address: '50 Post St, San Francisco, CA 94104',
				coordinates: coords(37.789531, -122.403041)
			}
		],
		description:
			'An open air shopping complex with many empty stores. Some seating spread across the complex with a hidden rooftop accessible from one end of the top floor.',
		openingHours: {
			MoTuWeThFr: [6, 19],
			Sa: [7, 19]
		},
		images: ['crocker.webp', 'crocker_roof_entrance.webp']
	},
	// Embarcadero Center
	{
		name: 'Embarcadero Center',
		type: 'POPO',
		rating: 3,
		images: ['embarcadero_center_p.jpeg'],
		vetted: true,
		openingHours: {
			MoTuWeThFr: [10, 19],
			Sa: [10, 18],
			Su: [12, 17]
		},
		description:
			'A complex with a shopping center with more than 125 stores, bars, and restaurants, and a fitness center..',
		location: [
			{
				address: '2 embarcadero ctr, san francisco, ca 94111',
				coordinates: {
					lat: 37.7948471,
					lng: -122.4029645
				}
			}
		]
	},
	// San Francisco Main Library
	{
		name: 'San Francisco Main Library',
		type: 'Library',
		description:
			'Six-story public library with study rooms, computer training center, and specialized cultural centers. Free WiFi on all floors.',
		location: [
			{
				address: '100 Larkin Street, San Francisco, CA 94102',
				coordinates: coords(37.7793, -122.4158)
			}
		],
		openingHours: {
			Mo: [9, 18],
			Tu: [9, 20],
			We: [9, 20],
			Th: [9, 20],
			Fr: [12, 18],
			Sa: [10, 18],
			Su: [12, 18]
		},
		vetted: true,
		rating: 5,
		tags: [
			'free wifi',
			'study rooms',
			'quiet',
			'work friendly',
			'power plugs',
			'indoor',
			'accessible'
		],
		images: []
	},
	// Yerba Buena Gardens
	{
		name: 'Yerba Buena Gardens',
		type: 'Park',
		description:
			'Five-acre downtown gardens with free WiFi, waterfall, public art, butterfly garden, and the Main Lawn. Perfect for outdoor work or relaxation.',
		location: [
			{
				address: 'Mission St between 3rd and 4th, San Francisco, CA 94103',
				coordinates: coords(37.785, -122.4024)
			}
		],
		openingHours: 'always open',
		vetted: true,
		rating: 4,
		tags: [
			'free wifi',
			'outdoor',
			'public art',
			'gardens',
			'waterfall',
			'eating friendly',
			'accessible'
		],
		images: []
	},
	// 343 Sansome Rooftop
	{
		name: '343 Sansome Rooftop Deck',
		type: 'Rooftop',
		description:
			'15th floor rooftop deck with panoramic city skyline views. Two open spaces including this hidden rooftop.',
		location: [
			{
				address: '343 Sansome St, San Francisco, CA 94104',
				coordinates: coords(37.7936, -122.4016)
			}
		],
		openingHours: {
			MoTuWeThFr: [10, 17]
		},
		vetted: true,
		rating: 4,
		tags: ['rooftop', 'views', 'outdoor', 'hidden gem'],
		images: []
	},
	// 555 California
	{
		name: '555 California',
		type: 'POPO',
		description:
			'Public open space at the base of the red granite building. Always open for a quick rest or outdoor seating.',
		location: [
			{
				address: '555 California St, San Francisco, CA 94104',
				coordinates: coords(37.7926, -122.4035)
			}
		],
		openingHours: 'always open',
		vetted: true,
		rating: 3,
		tags: ['always open', 'outdoor', 'quick rest'],
		images: []
	},
	// Mission Dolores Park
	{
		name: 'Mission Dolores Park',
		type: 'Park',
		description:
			'Popular hilltop park with city views, free WiFi, grassy areas, and a lively atmosphere. Great for socializing or reading.',
		location: [
			{
				address: 'Dolores St & 19th St, San Francisco, CA 94114',
				coordinates: coords(37.7605, -122.4271)
			}
		],
		openingHours: 'always open',
		vetted: true,
		rating: 4,
		tags: ['free wifi', 'views', 'outdoor', 'lively', 'eating friendly'],
		images: []
	},
	// The Interval at Long Now
	{
		name: 'The Interval at Long Now',
		type: 'Cafe',
		description:
			'Part cocktail bar, part museum with floor-to-ceiling library, 8-foot mechanical orrery, and Brian Eno artwork. Unique workspace atmosphere.',
		location: [
			{
				address: 'Fort Mason Center for Arts & Culture, San Francisco, CA',
				coordinates: coords(37.8052, -122.4321)
			}
		],
		openingHours: {
			MoTuWeThFr: [12, 24],
			Sa: [12, 24],
			Su: [12, 24]
		},
		vetted: true,
		rating: 5,
		tags: ['wifi', 'unique', 'library', 'museum', 'work friendly', 'indoor'],
		images: []
	},
	// Anza Branch Library
	{
		name: 'Anza Branch Library',
		type: 'Library',
		description:
			'Neighborhood branch library with free WiFi, quiet study areas, and community programs.',
		location: [
			{
				address: '550 37th Avenue, San Francisco, CA 94121',
				coordinates: coords(37.7798, -122.4975)
			}
		],
		openingHours: {
			Su: [13, 17],
			Mo: [10, 18],
			Tu: [10, 20],
			We: [13, 20],
			Th: [10, 18],
			Fr: [13, 18],
			Sa: [10, 18]
		},
		vetted: true,
		rating: 4,
		tags: ['free wifi', 'quiet', 'work friendly', 'power plugs', 'indoor', 'accessible'],
		images: []
	},
	// Bayview Branch Library
	{
		name: 'Bayview Branch Library',
		type: 'Library',
		description:
			'Neighborhood branch library serving the Bayview community with free WiFi and study spaces.',
		location: [
			{
				address: '5075 3rd Street, San Francisco, CA 94124',
				coordinates: coords(37.7328, -122.3915)
			}
		],
		openingHours: {
			Su: [13, 17],
			Mo: [10, 18],
			Tu: [10, 20],
			We: [10, 20],
			Th: [10, 20],
			Fr: [13, 18],
			Sa: [10, 18]
		},
		vetted: true,
		rating: 4,
		tags: ['free wifi', 'quiet', 'work friendly', 'power plugs', 'indoor', 'accessible'],
		images: []
	},
	// The Booksmith
	{
		name: 'The Booksmith',
		type: 'Bookstore',
		description: 'Independent bookstore in Haight-Ashbury with literary events and reading areas.',
		location: [
			{
				address: '1727 Haight St, San Francisco, CA 94117',
				coordinates: coords(37.7694, -122.4524)
			}
		],
		openingHours: {
			MoTuWeThFrSaSu: [11, 19]
		},
		vetted: true,
		rating: 4,
		tags: ['books', 'reading', 'events', 'indoor', 'quiet'],
		images: []
	},
	// Books Inc. Opera Plaza
	{
		name: 'Books Inc. Opera Plaza',
		type: 'Bookstore',
		description: 'Local bookstore chain location with reading areas and events.',
		location: [
			{
				address: '601 Van Ness Ave, San Francisco, CA 94102',
				coordinates: coords(37.7849, -122.4208)
			}
		],
		openingHours: {
			MoTuWeThFrSaSu: [9, 19]
		},
		vetted: true,
		rating: 4,
		tags: ['books', 'reading', 'indoor', 'quiet'],
		images: []
	},
	// Books Inc. Marina
	{
		name: 'Books Inc. Marina',
		type: 'Bookstore',
		description: 'Neighborhood bookstore with late hours and reading areas.',
		location: [
			{
				address: '2251 Chestnut St, San Francisco, CA 94123',
				coordinates: coords(37.8006, -122.4382)
			}
		],
		openingHours: {
			MoTuWeThFrSa: [9, 22],
			Su: [9, 21]
		},
		vetted: true,
		rating: 4,
		tags: ['books', 'reading', 'late hours', 'indoor', 'quiet'],
		images: []
	},
	// citizenM San Francisco
	{
		name: 'citizenM San Francisco',
		type: 'Hotel',
		description:
			'Modern hotel with 24/7 living room concept open to public. Designer furniture, free WiFi, and canteenM bar.',
		location: [
			{
				address: "250 O'Farrell St, San Francisco, CA 94102",
				coordinates: coords(37.7869, -122.4084)
			}
		],
		openingHours: 'always open',
		vetted: true,
		rating: 4,
		tags: ['free wifi', '24/7', 'work friendly', 'indoor', 'modern'],
		images: []
	},
	// Capital One Cafe Union Square
	{
		name: 'Capital One Cafe Union Square',
		type: 'Cafe',
		description:
			'Cafe/workspace hybrid with free WiFi, coffee shop atmosphere, and financial services.',
		location: [
			{
				address: '101 Post St, San Francisco, CA 94108',
				coordinates: coords(37.7889, -122.4041)
			}
		],
		openingHours: {
			MoTuWeThFr: [9, 18],
			Sa: [10, 17],
			Su: [11, 17]
		},
		vetted: true,
		rating: 4,
		tags: ['free wifi', 'work friendly', 'coffee', 'indoor', 'power plugs'],
		images: []
	},
	// Washington Square Park
	{
		name: 'Washington Square Park',
		type: 'Park',
		description:
			'Neighborhood park in North Beach with grassy areas, benches, and views of Coit Tower.',
		location: [
			{
				address: '600 Columbus Ave, San Francisco, CA 94133',
				coordinates: coords(37.8008, -122.4103)
			}
		],
		openingHours: 'always open',
		vetted: true,
		rating: 4,
		tags: ['outdoor', 'views', 'grassy', 'benches', 'eating friendly'],
		images: []
	},
	// Alamo Square
	{
		name: 'Alamo Square',
		type: 'Park',
		description: 'Park with famous Painted Ladies view, grassy areas, and free WiFi.',
		location: [
			{
				address: 'Steiner St & Hayes St, San Francisco, CA 94117',
				coordinates: coords(37.7763, -122.4342)
			}
		],
		openingHours: 'always open',
		vetted: true,
		rating: 4,
		tags: ['free wifi', 'outdoor', 'views', 'grassy', 'famous'],
		images: []
	},
	// Union Square
	{
		name: 'Union Square',
		type: 'Plaza',
		description: 'Busy urban plaza in shopping district with free WiFi. Good for people watching.',
		location: [
			{
				address: '333 Post St, San Francisco, CA 94108',
				coordinates: coords(37.788, -122.4075)
			}
		],
		openingHours: 'always open',
		vetted: true,
		rating: 3,
		tags: ['free wifi', 'outdoor', 'plaza', 'busy', 'shopping'],
		images: []
	},
	// Portsmouth Square
	{
		name: 'Portsmouth Square',
		type: 'Park',
		description: 'Urban park in Chinatown with free WiFi, popular for tai chi and people watching.',
		location: [
			{
				address: '733 Kearny St, San Francisco, CA 94108',
				coordinates: coords(37.7946, -122.4051)
			}
		],
		openingHours: 'always open',
		vetted: true,
		rating: 3,
		tags: ['free wifi', 'outdoor', 'chinatown', 'people watching'],
		images: []
	},
	// Justin Herman Plaza
	{
		name: 'Justin Herman Plaza',
		type: 'Plaza',
		description: 'Plaza near Ferry Building with waterfront views and free WiFi.',
		location: [
			{
				address: '1 Market St, San Francisco, CA 94105',
				coordinates: coords(37.7945, -122.3954)
			}
		],
		openingHours: 'always open',
		vetted: true,
		rating: 3,
		tags: ['free wifi', 'outdoor', 'waterfront', 'ferry building'],
		images: []
	},
	// Empire Park
	{
		name: 'Empire Park',
		type: 'POPO',
		description: 'Commercial Street lunchtime mall with seating and outdoor space.',
		location: [
			{
				address: '648 Commercial St, San Francisco, CA 94111',
				coordinates: coords(37.7943, -122.4037)
			}
		],
		openingHours: {
			MoTuWeThFr: [7, 17.5]
		},
		vetted: true,
		rating: 3,
		tags: ['outdoor', 'lunch', 'seating', 'financial district'],
		images: []
	},
	// 150 California
	{
		name: '150 California',
		type: 'POPO',
		description: 'Public open space with seating in Financial District.',
		location: [
			{
				address: '150 California St, San Francisco, CA 94111',
				coordinates: coords(37.7937, -122.3985)
			}
		],
		openingHours: {
			MoTuWeThFr: [9, 18]
		},
		vetted: true,
		rating: 3,
		tags: ['outdoor', 'seating', 'financial district'],
		images: []
	},
	// 101 California
	{
		name: '101 California',
		type: 'POPO',
		description: 'Public open space always accessible in Financial District.',
		location: [
			{
				address: '101 California St, San Francisco, CA 94111',
				coordinates: coords(37.793, -122.398)
			}
		],
		openingHours: 'always open',
		vetted: true,
		rating: 3,
		tags: ['always open', 'outdoor', 'financial district'],
		images: []
	},
	// One Bush Plaza
	{
		name: 'One Bush Plaza',
		type: 'POPO',
		description: 'Always-open public plaza in Financial District.',
		location: [
			{
				address: '1 Bush St, San Francisco, CA 94104',
				coordinates: coords(37.7911, -122.4001)
			}
		],
		openingHours: 'always open',
		vetted: true,
		rating: 3,
		tags: ['always open', 'outdoor', 'plaza', 'financial district'],
		images: []
	},
	// Foundry Square I
	{
		name: 'Foundry Square I',
		type: 'Plaza',
		description: 'Public plaza at corner of 1st and Howard, always open.',
		location: [
			{
				address: '400 Howard St, San Francisco, CA 94105',
				coordinates: coords(37.7891, -122.3958)
			}
		],
		openingHours: 'always open',
		vetted: true,
		rating: 3,
		tags: ['always open', 'outdoor', 'plaza', 'soma'],
		images: []
	},
	// Foundry Square III
	{
		name: 'Foundry Square III',
		type: 'POPO',
		description: 'Plaza with indoor park at 505 Howard St.',
		location: [
			{
				address: '505 Howard St, San Francisco, CA 94105',
				coordinates: coords(37.7883, -122.3961)
			}
		],
		openingHours: {
			MoTuWeThFr: [8, 18]
		},
		vetted: true,
		rating: 3,
		tags: ['indoor park', 'plaza', 'soma'],
		images: []
	},
	// Southeast Community Center
	{
		name: 'Southeast Community Center',
		type: 'Community Center',
		description:
			'State-of-the-art community center with free WiFi, public workspaces, cafe, and greenspaces.',
		location: [
			{
				address: '1550 Evans Ave, San Francisco, CA 94124',
				coordinates: coords(37.7476, -122.3874)
			}
		],
		openingHours: {
			MoTuWeThFr: [9, 17]
		},
		vetted: true,
		rating: 4,
		tags: ['free wifi', 'workspaces', 'cafe', 'indoor', 'outdoor', 'accessible'],
		images: []
	}
	// Unvetted below
	// {
	//     name: "Empire Park",
	//     type: "POPO",
	//     openingHours: "Mon - Fri 7am - 5:30pm",
	//     description: "648 Commercial St.",
	//     coordinates: {
	//         lat: 37.794269,
	//         lng: -122.403713
	//     }
	// },
	// {
	//     name: "343 Sansome",
	//     type: "POPO",
	//     openingHours: "Mon - Fri 10am - 5pm",
	//     description: "343 Sansome St.",
	//     coordinates: {
	//         lat: 37.793616,
	//         lng: -122.401572
	//     }
	// },
	// {
	//     name: "555 California",
	//     type: "POPO",
	//     openingHours: "Open at all times.",
	//     description: "555 California St.",
	//     coordinates: {
	//         lat: 37.79258,
	//         lng: -122.403518
	//     }
	// },
	// {
	//     name: "150 California",
	//     type: "POPO",
	//     openingHours: "Mon - Fri 9am - 6pm",
	//     description: "150 California St.",
	//     coordinates: {
	//         lat: 37.793673,
	//         lng: -122.398464
	//     }
	// },
	// {
	//     name: "101 California",
	//     type: "POPO",
	//     openingHours: "Open at all times.",
	//     description: "101 California St.",
	//     coordinates: {
	//         lat: 37.79304,
	//         lng: -122.398032
	//     }
	// },
	// {
	//     name: "100 Pine",
	//     type: "POPO",
	//     openingHours: "10am - 6pm",
	//     description: "100 Pine St.",
	//     coordinates: {
	//         lat: 37.792641,
	//         lng: -122.39897
	//     }
	// },
	// {
	//     name: "One Bush Plaza",
	//     type: "POPO",
	//     openingHours: "Open at all times.",
	//     description: "1 Bush St.",
	//     coordinates: {
	//         lat: 37.791092,
	//         lng: -122.400122
	//     }
	// },
	// {
	//     name: "Citigroup Center",
	//     type: "POPO",
	//     openingHours: "Open during business hours.",
	//     description: "1 Sansome St.",
	//     coordinates: {
	//         lat: 37.790485,
	//         lng: -122.40094
	//     }
	// },
	// {
	//     name: "Market Center",
	//     type: "POPO",
	//     openingHours: "The beautifully landscaped urban garden takes up t...",
	//     description: "555–575 Market St.",
	//     coordinates: {
	//         lat: 37.790066,
	//         lng: -122.399944
	//     }
	// },
	// {
	//     name: "One Kearny",
	//     type: "POPO",
	//     openingHours: "Mon - Fri 10am -5pm",
	//     description: "23 Geary St.",
	//     coordinates: {
	//         lat: 37.787707,
	//         lng: -122.403853
	//     }
	// },
	// {
	//     name: "456 Montgomery",
	//     type: "POPO",
	//     openingHours: "Some seating has been provided at the sidewalk lev...",
	//     description: "456 Montgomery St.",
	//     coordinates: {
	//         lat: 37.793473,
	//         lng: -122.402667
	//     }
	// },
	// {
	//     name: "425 Market",
	//     type: "POPO",
	//     openingHours: "Open at all times.",
	//     description: "425 Market St.",
	//     coordinates: {
	//         lat: 37.791121,
	//         lng: -122.398125
	//     }
	// },
	// {
	//     name: "50 Beale",
	//     type: "POPO",
	//     openingHours: "Open at all times.",
	//     description: "50 Beale St.",
	//     coordinates: {
	//         lat: 37.791239,
	//         lng: -122.396457
	//     }
	// },
	// {
	//     name: "201 Mission",
	//     type: "POPO",
	//     openingHours: "Open at all times.",
	//     description: "201 Mission St.",
	//     coordinates: {
	//         lat: 37.791034,
	//         lng: -122.394768
	//     }
	// },
	// {
	//     name: "123 Mission",
	//     type: "POPO",
	//     openingHours: "Open at all times.",
	//     description: "123 Mission St.",
	//     coordinates: {
	//         lat: 37.791882,
	//         lng: -122.394339
	//     }
	// },
	// {
	//     name: "135 Main",
	//     type: "POPO",
	//     openingHours: "Open during office hours.",
	//     description: "135 Main St.",
	//     coordinates: {
	//         lat: 37.791459,
	//         lng: -122.394241
	//     }
	// },
	// {
	//     name: "100 First",
	//     type: "POPO",
	//     openingHours: "Open during daylight hours.",
	//     description: "100 First St.",
	//     coordinates: {
	//         lat: 37.789488,
	//         lng: -122.397593
	//     }
	// },
	// {
	//     name: "Ecker Square",
	//     type: "POPO",
	//     openingHours: "Open at all times.",
	//     description: "25 Jessie St.",
	//     coordinates: {
	//         lat: 37.789658,
	//         lng: -122.3987
	//     }
	// },
	// {
	//     name: "555 Mission",
	//     type: "POPO",
	//     openingHours: "Open at all times.",
	//     description: "555 Mission St.",
	//     coordinates: {
	//         lat: 37.788601,
	//         lng: -122.398674
	//     }
	// },
	// {
	//     name: "Marathon Plaza",
	//     type: "POPO",
	//     openingHours: "Open at all times.",
	//     description: "303 2nd St.",
	//     coordinates: {
	//         lat: 37.785292,
	//         lng: -122.395566
	//     }
	// },
	// {
	//     name: "Millenium Tower Atrium",
	//     type: "POPO",
	//     openingHours: "8am - 6pm",
	//     description: "301 Mission St.",
	//     coordinates: {
	//         lat: 37.790582,
	//         lng: -122.396142
	//     }
	// },
	// {
	//     name: "222 Second",
	//     type: "POPO",
	//     openingHours: "Mon - Fri 8am - 6pm",
	//     description: "222 2nd St.",
	//     coordinates: {
	//         lat: 37.78632,
	//         lng: -122.398235
	//     }
	// },
	// {
	//     name: "Sky Terrace",
	//     type: "POPO",
	//     openingHours: "Open during business hours.",
	//     description: "825 Market St.",
	//     coordinates: {
	//         lat: 37.784803,
	//         lng: -122.406071
	//     }
	// },
	// {
	//     name: "543 Howard",
	//     type: "POPO",
	//     openingHours: "Mon - Fri 8am - 5pm",
	//     description: "543 Howard St.",
	//     coordinates: {
	//         lat: 37.787594,
	//         lng: -122.396631
	//     }
	// },
	// {
	//     name: "14 Fremont",
	//     type: "POPO",
	//     openingHours: "Open at all times.",
	//     description: "14 Fremont St.",
	//     coordinates: {
	//         lat: 37.791454,
	//         lng: -122.398215
	//     }
	// },
	// {
	//     name: "Foundry Square I",
	//     type: "POPO",
	//     openingHours: "Open at all times.",
	//     description: "400 Howard St.",
	//     coordinates: {
	//         lat: 37.789137,
	//         lng: -122.3958
	//     }
	// },
	// {
	//     name: "Foundry Square II",
	//     type: "POPO",
	//     openingHours: "Open at all times.",
	//     description: "405 Howard St.",
	//     coordinates: {
	//         lat: 37.788609,
	//         lng: -122.395376
	//     }
	// },
	// {
	//     name: "Foundry Square III",
	//     type: "POPO",
	//     openingHours: "Plaza is open at all times. Indoor Park, Mon - Fri 8am - 6pm",
	//     description: "505 Howard St.",
	//     coordinates: {
	//         lat: 37.788264,
	//         lng: -122.39608
	//     }
	// },
	// {
	//     name: "Foundry Square IV",
	//     type: "POPO",
	//     openingHours: "Open at all times.",
	//     description: "500 Howard St.",
	//     coordinates: {
	//         lat: 37.788433,
	//         lng: -122.396689
	//     }
	// },
	// {
	//     name: "160 Spear",
	//     type: "POPO",
	//     openingHours: "Open at all times.",
	//     description: "160 Spear St.",
	//     coordinates: {
	//         lat: 37.791575,
	//         lng: -122.39339
	//     }
	// },
	// {
	//     name: "201 Spear",
	//     type: "POPO",
	//     openingHours: "Open at all times.",
	//     description: "201 Spear St.",
	//     coordinates: {
	//         lat: 37.791185,
	//         lng: -122.391791
	//     }
	// },
	// {
	//     name: "2 Folsom",
	//     type: "POPO",
	//     openingHours: "Open at all times.",
	//     description: "2 Folsom St.",
	//     coordinates: {
	//         lat: 37.790663,
	//         lng: -122.390742
	//     }
	// },
	// {
	//     name: "235 Main",
	//     type: "POPO",
	//     openingHours: "Mon - Fri 8am - 6pm",
	//     description: "235 Main St.",
	//     coordinates: {
	//         lat: 37.790287,
	//         lng: -122.392876
	//     }
	// },
	// {
	//     name: "The Clancy",
	//     type: "POPO",
	//     openingHours: "Outdoor public sitting area is open at all times. Indoor garden, Mon - Fri 8am - 6pm.",
	//     description: "299 2nd St.",
	//     coordinates: {
	//         lat: 37.785961,
	//         lng: -122.396817
	//     }
	// },
	// {
	//     name: "Shaw Alley",
	//     type: "POPO",
	//     openingHours: "Mon - Fri 8am - 6pm",
	//     description: "535 Mission St.",
	//     coordinates: {
	//         lat: 37.788856,
	//         lng: -122.398106
	//     }
	// },
	// {
	//     name: "Golden Gate University",
	//     type: "POPO",
	//     openingHours: "Open at all times.",
	//     description: "536 Mission St.",
	//     coordinates: {
	//         lat: 37.789249,
	//         lng: -122.398893
	//     }
	// },
	// {
	//     name: "71 Stevenson",
	//     type: "POPO",
	//     openingHours: "Open at all times.",
	//     description: "71 Stevenson St.",
	//     coordinates: {
	//         lat: 37.789373,
	//         lng: -122.399666
	//     }
	// },
	// {
	//     name: "49 Stevenson",
	//     type: "POPO",
	//     openingHours: "Open at all times.",
	//     description: "49 Stevenson St.",
	//     coordinates: {
	//         lat: 37.789736,
	//         lng: -122.399352
	//     }
	// },
	// {
	//     name: "611 Folsom",
	//     type: "POPO",
	//     openingHours: "Open at all times.",
	//     description: "611 Folsom St.",
	//     coordinates: {
	//         lat: 37.78498,
	//         lng: -122.396536
	//     }
	// }
];

export default [...sanFranciscoSpaces.map(prepareSpaces(SupportedCity.SAN_FRANCISCO))];
