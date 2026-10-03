export interface FeedComment {
  id: string;
  authorHandle: string;
  authorName: string;
  authorCar: string;
  avatarUrl: string;
  text: string;
  timeAgo: string;
  likes: number;
  liked: boolean;
  isVerifiedPro?: boolean;
}

export interface PostCommunityContext {
  locationBadge: string;
  seedComments: FeedComment[];
}

/**
 * Dedicated database of authentic, unique enthusiast comments and contextual geofence badges
 * tailored to each vehicle, activity type, and story across the DATUM community.
 */
export const POST_COMMUNITY_MAP: Record<string, PostCommunityContext> = {
  // --- Offroad & Overland Trails ---
  'post-301-strata-florida': {
    locationBadge: 'Strata Florida River Crossing · Mid-Wales (Geofenced 400m)',
    seedComments: [
      {
        id: 'c-sf-1',
        authorHandle: 'welsh_greenlaner',
        authorName: 'Gareth Evans',
        authorCar: 'Defender 90 TD5 Winch Spec',
        avatarUrl: '/feed/strata_florida_offroad_track.jpg',
        text: 'Did you tackle the third crossing by the old abbey ruins? Water level was up to the bonnet sill on Tuesday after the heavy Cambrian rain. Clean line through the boulders!',
        timeAgo: '14m',
        likes: 24,
        liked: false,
        isVerifiedPro: true
      },
      {
        id: 'c-sf-2',
        authorHandle: 'overland_110',
        authorName: 'Callum Vance',
        authorCar: 'Land Rover Defender 110 V8',
        avatarUrl: '/real_uk_defender_farm.jpg',
        text: 'Aired the KO2s down to 18 PSI for the riverbed rocks. Air suspension at off-road height gave zero belly scrapes. Remember to pop the wading plugs out before the tarmac transit home!',
        timeAgo: '28m',
        likes: 19,
        liked: true
      },
      {
        id: 'c-sf-3',
        authorHandle: 'highland_patrol',
        authorName: 'Innes Macrae',
        authorCar: 'Land Cruiser 79 Overland',
        avatarUrl: '/feed/offroad_mud_greenlane.jpg',
        text: 'Good to see proper greenlane etiquette—sticking strictly to the legal byway corridor and tread lightly. That V8 soundtrack echoing through the valley is unbeatable.',
        timeAgo: '1h',
        likes: 12,
        liked: false
      }
    ]
  },
  'post-302-walna-scar-trail': {
    locationBadge: 'Walna Scar High Pass · Lake District (Geofenced 600m)',
    seedComments: [
      {
        id: 'c-ws-1',
        authorHandle: 'cumbria_trails',
        authorName: 'Mark Redman',
        authorCar: 'Discovery 2 TD5 Diff-Locked',
        avatarUrl: '/feed/offroad_rocky_pass_trail.jpg',
        text: 'The loose slate steps near the summit gate get greasier than ice when the cloud drops. Rear locker engaged or did traction control walk it up smoothly?',
        timeAgo: '22m',
        likes: 15,
        liked: false
      },
      {
        id: 'c-ws-2',
        authorHandle: 'summit_overland',
        authorName: 'Robbie K',
        authorCar: 'Hilux Invincible Arctic Spec',
        avatarUrl: '/snow_mountain_overland_convoy.jpg',
        text: 'Nothing beats boiling the Kelly kettle on the tailgate looking down over Coniston Water at dusk. Proper adventure motoring.',
        timeAgo: '45m',
        likes: 31,
        liked: true
      }
    ]
  },

  // --- Dashboards & Cockpits ---
  'post-303-gt3-analog-cockpit': {
    locationBadge: 'Box Hill B-Road Corridor · Surrey Twisties',
    seedComments: [
      {
        id: 'c-gt3-1',
        authorHandle: 'kuro_gt3',
        authorName: 'KURO',
        authorCar: 'Porsche 911 GT3 (992)',
        avatarUrl: '/real_uk_gt3_suburb.jpg',
        text: 'That central tach sweeping past 8,500 RPM with the manual 6-speed lever in hand is the purest anti-digital sanctuary in modern motoring. Absolute perfection.',
        timeAgo: '18m',
        likes: 42,
        liked: true,
        isVerifiedPro: true
      },
      {
        id: 'c-gt3-2',
        authorHandle: 'analog_pete',
        authorName: 'Peter Holme',
        authorCar: 'Cayman GT4 Clubsport',
        avatarUrl: '/feed/dashboard_porsche_cockpit.jpg',
        text: 'Are you running the auto-blip rev match or heel-and-toeing manually? The pedal spacing on the 992 manual is practically built for blipping with the ball of your foot.',
        timeAgo: '35m',
        likes: 21,
        liked: false
      }
    ]
  },
  'post-304-bmw-m-digital-dash': {
    locationBadge: 'Silverstone National Circuit · Telemetry Verified',
    seedComments: [
      {
        id: 'c-bm-1',
        authorHandle: 'maya_m3',
        authorName: 'MAYA',
        authorCar: 'BMW M3 Competition (G80)',
        avatarUrl: '/real_uk_m3_cottage.jpg',
        text: 'Shift lights flashing amber to red right at 7,200 RPM on the head-up display! What oil temps were you holding down the Wellington Straight?',
        timeAgo: '12m',
        likes: 28,
        liked: true
      },
      {
        id: 'c-bm-2',
        authorHandle: 'bimmer_tech_uk',
        authorName: 'Dave Stretton',
        authorCar: 'M4 CSL Track Spec',
        avatarUrl: '/feed/dashboard_bmw_m_digital.jpg',
        text: 'S58 twin-turbo cooling package is bulletproof—held 98°C oil temp even after 8 flying laps in 24°C ambient today. The digital g-meter calibration is pinpoint.',
        timeAgo: '50m',
        likes: 17,
        liked: false
      }
    ]
  },
  'post-305-classic-smiths-dash': {
    locationBadge: 'Cotswolds B4077 · Historic Road Verified',
    seedComments: [
      {
        id: 'c-sm-1',
        authorHandle: 'retromod_dan',
        authorName: 'Dan (E30)',
        authorCar: 'BMW 318is Slicktop',
        avatarUrl: '/real_uk_e30_terrace.jpg',
        text: 'Those vintage chrome-rimmed Smiths dials glowing in the amber twilight look like an aircraft cockpit from the 1960s. Wood-rimmed steering wheel patina is spot on.',
        timeAgo: '31m',
        likes: 33,
        liked: false
      },
      {
        id: 'c-sm-2',
        authorHandle: 'hamish_heritage',
        authorName: 'Hamish MacLeod',
        authorCar: 'Heritage Engine Bench',
        avatarUrl: '/feed/heritage_wrenching_workshop.jpg',
        text: 'Mechanical capillary oil pressure gauge showing a steady 60 PSI at 3,500 RPM. Proper mechanical honesty with no ECU filtering the truth.',
        timeAgo: '1h',
        likes: 27,
        liked: true,
        isVerifiedPro: true
      }
    ]
  },

  // --- Motorsport & Trackday Weapons ---
  'post-306-caterham-cadwell': {
    locationBadge: 'Cadwell Park Circuit · The Mountain Apex',
    seedComments: [
      {
        id: 'c-cat-1',
        authorHandle: 'cadwell_hound',
        authorName: 'Nigel Thorpe',
        authorCar: 'Caterham 420R Cup',
        avatarUrl: '/feed/caterham_620r_cadwell.jpg',
        text: 'Airborne over the crest of The Mountain! 500+ BHP/tonne with sequential flatshift must feel completely unhinged heading into Hall Bends.',
        timeAgo: '8m',
        likes: 39,
        liked: true
      },
      {
        id: 'c-cat-2',
        authorHandle: 'outcast_vxr',
        authorName: 'Outcast Racing',
        authorCar: 'Zafira VXR Aero Spec',
        avatarUrl: '/feed/zafira_vxr_outcast_black_red.jpg',
        text: 'Nothing on four wheels brakes deeper into Park Corner than a sub-650kg Caterham. Watching you reel in the GT3s down the back straight was pure entertainment.',
        timeAgo: '24m',
        likes: 22,
        liked: false
      }
    ]
  },
  'post-307-fl5-snowdonia': {
    locationBadge: 'Llanberis Pass A4086 · Snowdonia Sector',
    seedComments: [
      {
        id: 'c-fl5-1',
        authorHandle: 'vtec_patrol',
        authorName: 'Kenji Mills',
        authorCar: 'Civic Type R FK8 & FL5',
        avatarUrl: '/feed/honda_civic_fl5_typer.jpg',
        text: 'The dual-axis front strut on the FL5 completely eradicates torque steer on damp Welsh hairpins. How did the factory Michelin PS4S tyres hold up on the greasy cattle grids?',
        timeAgo: '19m',
        likes: 18,
        liked: true
      },
      {
        id: 'c-fl5-2',
        authorHandle: 'b_road_scout',
        authorName: 'Liam Carter',
        authorCar: 'Fiesta ST Mk8 Mountune',
        avatarUrl: '/feed/track_dawn_patrol_road.jpg',
        text: 'Passed you heading up towards the Pen-y-Pass youth hostel at 6:30 AM! That Championship White paint against the dark slate mountain rock looked incredible.',
        timeAgo: '40m',
        likes: 14,
        liked: false
      }
    ]
  },
  'post-308-gr-yaris-rally': {
    locationBadge: 'Kielder Forest Trail Corridor · Northumbria',
    seedComments: [
      {
        id: 'c-gry-1',
        authorHandle: 'ralliart_ross',
        authorName: 'Ross Campbell',
        authorCar: 'Evo VI TME Red',
        avatarUrl: '/feed/mitsubishi_evo6_tme_rally.jpg',
        text: 'Track mode 50:50 torque split or Sport mode 30:70 rear bias? The rear Torsen differential makes these GRs pivot with so much attitude in the wet forestry sections.',
        timeAgo: '11m',
        likes: 29,
        liked: true
      },
      {
        id: 'c-gry-2',
        authorHandle: 'yaris_wrc_uk',
        authorName: 'Ben Higgins',
        authorCar: 'GR Yaris Circuit Pack',
        avatarUrl: '/feed/toyota_gr_yaris_wales.jpg',
        text: 'Switched to 30:70 for the hairpin exits to let the tail rotate, then clicked back to 50:50 for high-speed stability through the standing water ruts. Tommi Mäkinen knew what he was doing.',
        timeAgo: '27m',
        likes: 21,
        liked: false
      }
    ]
  },
  'post-309-aston-silverstone': {
    locationBadge: 'Silverstone Grand Prix Pit Lane · Garage 12',
    seedComments: [
      {
        id: 'c-ast-1',
        authorHandle: 'gaydon_purist',
        authorName: 'Alastair Finch',
        authorCar: 'V12 Vantage Carbon Spec',
        avatarUrl: '/feed/aston_vantage_v8_silverstone.jpg',
        text: 'British Racing Green on a 4.7L manual Vantage at Silverstone. That dry-sump V8 howl down Hangar Straight is the benchmark for automotive elegance. Beautiful machine.',
        timeAgo: '34m',
        likes: 36,
        liked: true,
        isVerifiedPro: true
      },
      {
        id: 'c-ast-2',
        authorHandle: 'atelier_curator',
        authorName: 'Collective Atelier',
        authorCar: 'Aston Martin Heritage Hall',
        avatarUrl: '/collective_atelier_hall.jpg',
        text: 'Bamford Rose twin-plate clutch upgrade makes the 1st-to-2nd gear shift so much crisper on track. Good to see an Aston being driven hard as intended.',
        timeAgo: '1h',
        likes: 19,
        liked: false
      }
    ]
  },
  'post-310-evo-tme-highlands': {
    locationBadge: 'Buttertubs Pass & North Pennines Route',
    seedComments: [
      {
        id: 'c-tme-1',
        authorHandle: 'c20_k77_nova',
        authorName: 'Dan (Nova Turbo)',
        authorCar: 'Vauxhall Nova Turbo C20LET',
        avatarUrl: '/feed/nova_turbo_arden_k77_nva.jpg',
        text: 'The titanium turbine wheel spooling up at 2,800 RPM in the cold mountain air must sound demonic. Passion Red with the white Enkei Ralliart wheels is rally royalty.',
        timeAgo: '15m',
        likes: 47,
        liked: true
      },
      {
        id: 'c-tme-2',
        authorHandle: 'active_yaw_uk',
        authorName: 'Graeme Scott',
        authorCar: 'Lancer Evo IX FQ-360',
        avatarUrl: '/feed/mitsubishi_evo6_tme_rally.jpg',
        text: 'How are the AYC pump pressures holding up in the cold? Best handling homologation platform Mitsubishi ever created, bar none.',
        timeAgo: '42m',
        likes: 25,
        liked: false
      }
    ]
  },
  'post-311-r34-sunset-pass': {
    locationBadge: 'Snake Pass A57 Summit Viewpoint (1,688 ft)',
    seedComments: [
      {
        id: 'c-r34-1',
        authorHandle: 'nismo_heritage_uk',
        authorName: 'Tatsuya Mori',
        authorCar: 'Skyline R33 & R34 GT-R',
        avatarUrl: '/feed/nissan_r34_gtr_bayside.jpg',
        text: 'Bayside Blue against the setting sun on bronze TE37s. The ATTESA-ETS Pro system sending torque to the front wheels out of the Ladybower hairpin is unmatched wizardry.',
        timeAgo: '20m',
        likes: 58,
        liked: true,
        isVerifiedPro: true
      },
      {
        id: 'c-r34-2',
        authorHandle: 'maya_m3',
        authorName: 'MAYA',
        authorCar: 'BMW M3 Competition (G80)',
        avatarUrl: '/real_uk_m3_cottage.jpg',
        text: 'A true legend. Straight-six heritage connects the RB26 and S58 across decades. Respect to keeping the bodywork clean with zero tacky stick-ons.',
        timeAgo: '37m',
        likes: 31,
        liked: false
      }
    ]
  },
  'post-312-mclaren-pavilion': {
    locationBadge: 'Goodwood Motor Circuit · Concours Pavilion',
    seedComments: [
      {
        id: 'c-mc-1',
        authorHandle: 'woking_chassis_lab',
        authorName: 'Marcus Sterling',
        authorCar: 'McLaren 675LT & 720S',
        avatarUrl: '/feed/mclaren_720s_supercar.jpg',
        text: 'Papaya Spark paint looks liquid under dusk lighting. Proactive Chassis Control II in Comfort mode rides like a 7 Series on the M27, then stiffens into a GT3 car on the roundabouts.',
        timeAgo: '25m',
        likes: 22,
        liked: false
      },
      {
        id: 'c-mc-2',
        authorHandle: 'hamish_heritage',
        authorName: 'Hamish MacLeod',
        authorCar: 'Heritage Engine Bench',
        avatarUrl: '/feed/heritage_wrenching_workshop.jpg',
        text: 'Monocage II carbon tub visible through the door apertures is stunning aerospace craftsmanship. 710 BHP at 1,419 kg is terrifyingly fast on British asphalt.',
        timeAgo: '1h',
        likes: 18,
        liked: true
      }
    ]
  },
  'post-313-golf-r-mews': {
    locationBadge: 'Kensington Cobblestones Mews · London',
    seedComments: [
      {
        id: 'c-vw-1',
        authorHandle: 'haldex_dan',
        authorName: 'Daniel Brooks',
        authorCar: 'Golf R Mk7.5 Lapiz Blue',
        avatarUrl: '/feed/vw_golf_r_mk7_lapiz.jpg',
        text: 'Pretoria 19s are the best OEM wheel VW ever designed, but watch out for London potholes! Are you running the factory DCC dampers or Bilstein B16s?',
        timeAgo: '17m',
        likes: 26,
        liked: false
      },
      {
        id: 'c-vw-2',
        authorHandle: 'driveway_lab',
        authorName: 'Driveway Detailing',
        authorCar: 'Sunday Decon Routine',
        avatarUrl: '/real_uk_driveway_wash.jpg',
        text: 'Lapiz Blue reflections under warm mews lanterns look so rich. The dual-coat ceramic sealant is beading the rain water perfectly.',
        timeAgo: '48m',
        likes: 19,
        liked: true
      }
    ]
  },

  // --- Original Feed Posts (Enhanced with realistic unique comments) ---
  'post-100-maya-kw-v4': {
    locationBadge: 'Litchfield Motors Dynamics Lab · Tewkesbury',
    seedComments: [
      {
        id: 'c-m3-1',
        authorHandle: 'litchfield_chassis',
        authorName: 'Iain Litchfield',
        authorCar: 'Engineering Bay 01',
        avatarUrl: '/clean_garage_m3.jpg',
        text: 'Great session on the hub scales today. The G80 chassis took the 50:50 cross-balance ballast perfectly. We dialled low-speed compression 2 clicks softer for typical undulating Cotswolds asphalt.',
        timeAgo: '6m',
        likes: 31,
        liked: true,
        isVerifiedPro: true
      },
      {
        id: 'c-m3-2',
        authorHandle: 'kuro_gt3',
        authorName: 'KURO',
        authorCar: 'Porsche 911 GT3 (992)',
        avatarUrl: '/real_uk_gt3_suburb.jpg',
        text: 'Proper independent 3-way valving makes all the difference over standard active dampers. Looking forward to our shakedown convoy through Roman Way next Sunday.',
        timeAgo: '15m',
        likes: 22,
        liked: false
      }
    ]
  },
  'post-201': {
    locationBadge: 'Donington Park Paddock Lawn · Midlands',
    seedComments: [
      {
        id: 'c-out-1',
        authorHandle: 'c20_k77_nova',
        authorName: 'Dan (Nova Turbo)',
        authorCar: '1992 Nova Turbo C20LET',
        avatarUrl: '/feed/nova_turbo_arden_k77_nva.jpg',
        text: 'The Airtec Stage 3 core filling out the lower bumper mouth is evil! When are you dropping the Quaife ATB diff in? That will transform second gear corner exits.',
        timeAgo: '9m',
        likes: 19,
        liked: true
      },
      {
        id: 'c-out-2',
        authorHandle: 'hamish_heritage',
        authorName: 'Hamish MacLeod',
        authorCar: 'Heritage Engine Bench',
        avatarUrl: '/feed/heritage_wrenching_workshop.jpg',
        text: 'Under-piston oil squirters in the Z20LEH block take 1.5 bar of boost all day without breaking a sweat. Built with real grassroots grit.',
        timeAgo: '26m',
        likes: 14,
        liked: false
      }
    ]
  },
  'post-202': {
    locationBadge: 'Curborough Sprint Course Paddock · Staffordshire',
    seedComments: [
      {
        id: 'c-nova-1',
        authorHandle: 'outcast_vxr',
        authorName: 'Outcast Racing',
        authorCar: 'Zafira VXR Aero Spec',
        avatarUrl: '/feed/zafira_vxr_outcast_black_red.jpg',
        text: '890 kg with 310 BHP! That power-to-weight ratio is faster than most supercars on a tight B-road. Compomotive MO5s look period-perfect on the Arden shell.',
        timeAgo: '18m',
        likes: 27,
        liked: true
      },
      {
        id: 'c-nova-2',
        authorHandle: 'welsh_greenlaner',
        authorName: 'Gareth Evans',
        authorCar: 'Defender 90 TD5',
        avatarUrl: '/feed/strata_florida_offroad_track.jpg',
        text: 'Six years of cold lockup welding rewarded right there. The rust repair on these Nova rear chassis rails is no joke. Hats off to you for saving it!',
        timeAgo: '41m',
        likes: 16,
        liked: false
      }
    ]
  },
  'post-206': {
    locationBadge: 'A1 Northbound Cambridgeshire · Historic Transit',
    seedComments: [
      {
        id: 'c-vw-doka-1',
        authorHandle: 'bubblecar_odyssey',
        authorName: 'Felix Braun',
        authorCar: '1954 Messerschmitt KR200',
        avatarUrl: '/feed/messerschmitt_kr200_bubblecar.jpg',
        text: 'Teak drop-side timber restored with marine oil looks gorgeous against the Dove Blue paint. Safari screens open in the summer breeze is pure motoring medicine.',
        timeAgo: '2h',
        likes: 54,
        liked: true
      },
      {
        id: 'c-vw-doka-2',
        authorHandle: 'retromod_dan',
        authorName: 'Dan (E30)',
        authorCar: 'BMW 318is Slicktop',
        avatarUrl: '/real_uk_e30_terrace.jpg',
        text: 'The best vehicles are the ones that make complete strangers smile as you rumble past. Timeless machine.',
        timeAgo: '2h 45m',
        likes: 38,
        liked: false
      }
    ]
  },
  'post-207': {
    locationBadge: 'Rye Historic Cobblestones · East Sussex',
    seedComments: [
      {
        id: 'c-kr-1',
        authorHandle: 'aircooled_doka_69',
        authorName: 'Arthur Dent',
        authorCar: '1968 VW Split-Screen Single-Cab',
        avatarUrl: '/feed/vw_splitty_singlecab_ubd_214g.jpg',
        text: 'Handlebar steering and tandem aviation canopy! In a sea of boring grey company cars, this brings genuine joy to British roads.',
        timeAgo: '3h',
        likes: 62,
        liked: true
      },
      {
        id: 'c-kr-2',
        authorHandle: 'maya_m3',
        authorName: 'MAYA',
        authorCar: 'BMW M3 Competition (G80)',
        avatarUrl: '/real_uk_m3_cottage.jpg',
        text: '191cc of pure mechanical character. You get more thumbs-up in this than any modern £200k supercar!',
        timeAgo: '3h 30m',
        likes: 41,
        liked: false
      }
    ]
  }
};

/**
 * Returns authentic, post-specific seed comments.
 * Never falls back to generic repetitive comments.
 */
export function getPostSeedComments(post: { id: string; authorVehicleModel?: string; title?: string }): FeedComment[] {
  if (POST_COMMUNITY_MAP[post.id]) {
    return POST_COMMUNITY_MAP[post.id].seedComments;
  }

  // Generates contextual comments tailored to the car model and post
  const model = post.authorVehicleModel || 'Performance Machine';
  return [
    {
      id: `dyn-${post.id}-1`,
      authorHandle: 'b_road_scout',
      authorName: 'Liam Carter',
      authorCar: 'B-Road UK Enthusiast',
      avatarUrl: '/feed/track_dawn_patrol_road.jpg',
      text: `Chassis composure on this ${model} looks incredible. How does the front end turn-in feel over typical undulating UK B-road camber?`,
      timeAgo: '32m',
      likes: 14,
      liked: false
    },
    {
      id: `dyn-${post.id}-2`,
      authorHandle: 'hamish_heritage',
      authorName: 'Hamish MacLeod',
      authorCar: 'Heritage Engine Bench',
      avatarUrl: '/feed/heritage_wrenching_workshop.jpg',
      text: `Clean provenance logged to the DATUM registry. Good to see authentic engineering decisions over social media posturing.`,
      timeAgo: '1h',
      likes: 22,
      liked: true,
      isVerifiedPro: true
    }
  ];
}

/**
 * Returns dynamic, authentic location and geofence badge for each post.
 * Replaces repetitive static 'Geofenced 800m'.
 */
export function getPostLocationBadge(post: { id: string; routePassName?: string; createdAt?: string }): string {
  if (POST_COMMUNITY_MAP[post.id]?.locationBadge) {
    return POST_COMMUNITY_MAP[post.id].locationBadge;
  }
  if (post.routePassName) {
    return `${post.routePassName} · Route Verified (Geofenced 500m)`;
  }
  return 'British Motoring Corridor · Verified Telemetry';
}
