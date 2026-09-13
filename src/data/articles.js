export const CATEGORIES = [
  { id: 'all', name: 'ALL STORIES' },
  { id: 'living-room', name: 'Living Room' },
  { id: 'bedroom', name: 'Bedroom' },
  { id: 'kitchen', name: 'Kitchen' },
  { id: 'bathroom', name: 'Bathroom' },
  { id: 'garden', name: 'Garden' },
  { id: 'interiors', name: 'INTERIORS' },
  { id: 'diy', name: 'DIY' },
  { id: 'buying-guides', name: 'Buying Guides' },
];

export const ARTICLES = [
  {
    id: 'kensington-townhouse',
    title: 'Inside a Restored 19th-Century Victorian Townhouse in Kensington',
    slug: 'inside-restored-victorian-townhouse-kensington',
    category: 'living-room',
    categoryName: 'Living Room',
    categoryLabel: 'COVER STORY • LIVING ROOM',
    author: 'Eleanor Vance',
    role: 'Senior Architectural Editor',
    date: 'September 12, 2026',
    readTime: '7 min read',
    views: '18.4k',
    isCover: true,
    excerpt: 'Architectural preservation meets refined modern London living. Exploring bespoke limewash plaster, restored plaster ceiling roses, and handcrafted English oak joinery.',
    heroImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80',
    content: `
      <p class="lead">Nestled within a quiet tree-lined avenue in South Kensington, this five-storey Victorian townhouse exemplifies the delicate balance between historic preservation and contemporary sophistication.</p>
      
      <h3>Preserving 1880s Architectural Integrity</h3>
      <p>When designer Claire Sterling took on the renovation, the primary mandate was honoring the building's 1880s heritage. Original plaster ceiling mouldings and pine floorboards were painstakingly restored using heritage-grade methods.</p>
      
      <blockquote>"True British luxury in architecture lies in knowing what to restore with reverence, and where to introduce modern stillness." — Claire Sterling</blockquote>

      <h3>The Palette: Cotswold Stone & Warm Terracotta</h3>
      <p>Rather than stark brilliant whites, the interiors celebrate nuanced heritage pigments—Farrow & Ball's School House White on cornices paired with custom limewashed stone textures that absorb the soft British daylight.</p>
      
      <h3>Bespoke Joinery & Modern Comfort</h3>
      <p>Concealed beneath the period elegance lies state-of-the-art climate zoning, acoustic soundproofing, and bespoke fluted oak cabinetry that houses an understated collection of contemporary British ceramics.</p>
    `,
    keyTakeaway: 'Heritage Victorian homes achieve their highest aesthetic when original plasterwork and timber proportions are preserved with understated contemporary furnishings.'
  },
  {
    id: 'alcove-joinery-masterclass',
    title: 'The Art of Bespoke Alcove Joinery in British Living Rooms',
    slug: 'art-bespoke-alcove-joinery-british-living-rooms',
    category: 'interiors',
    categoryName: 'INTERIORS',
    categoryLabel: 'LUXURY DESIGN • INTERIORS',
    author: 'Sarah Jenkins',
    role: 'London Interior Stylist',
    date: 'September 10, 2026',
    readTime: '5 min read',
    views: '12.8k',
    isStacked: true,
    excerpt: 'Transforming awkward chimney breast recesses into functional architectural statements with integrated warm LED illumination and fluted panelling.',
    heroImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    content: `
      <p>Chimney breast alcoves are a quintessential hallmark of UK Victorian and Edwardian architecture. While often perceived as restrictive, bespoke joinery turns them into the visual anchor of the living room.</p>
      
      <h3>Designing for Symmetry and Scale</h3>
      <p>Key to successful alcove cabinetry is matching the scale of your ceiling height. In rooms exceeding 2.7m ceiling height, incorporate floating upper open display shelves with lower closed shaker cabinets.</p>
      
      <h3>Integrated Illumination</h3>
      <p>Incorporate concealed 2700K warm LED profile strips routed into the underside of each shelf to cast a gentle downward wash of light over curated art objects and books.</p>
    `,
    keyTakeaway: 'Always measure wall plumbness before ordering custom timber strips, as historical British brickwork often contains gentle bowing.'
  },
  {
    id: 'rental-elegance-hacks',
    title: 'Rental Elegance: Non-Damaging Interior Upgrades for UK Tenants',
    slug: 'rental-elegance-non-damaging-upgrades-uk-tenants',
    category: 'bedroom',
    categoryName: 'Bedroom',
    categoryLabel: 'BEDROOM RETREAT',
    author: 'Alex Turner',
    role: 'Design Columnist',
    date: 'September 08, 2026',
    readTime: '4 min read',
    views: '9.5k',
    isStacked: true,
    excerpt: 'High-end aesthetic upgrades for rented London and Manchester apartments without risking security deposits or violating tenancy agreements.',
    heroImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
    content: `
      <p>Renting in the UK should never mean compromising on refined personal style. With smart, zero-damage techniques, tenants can elevate generic rental finishes into curated sanctuary spaces.</p>
      
      <h3>Heavyweight Linen Drapery</h3>
      <p>Replace generic plastic roller blinds with ceiling-hung tension drapery poles fitted with Belgian linen curtains. This immediately adds vertical height and warmth.</p>
      
      <h3>Peel-and-Stick Architectural Tiles</h3>
      <p>Modern vinyl splashbacks accurately replicate handmade Moroccan zellige or Portuguese tiles, peeling off effortlessly upon move-out with zero residue.</p>
    `,
    keyTakeaway: 'Layering ambient table lamps and floor rugs conceals bland developer finishes without permanent alterations.'
  },
  {
    id: 'diy-wall-panelling-masterclass',
    title: 'Step-by-Step Wall Panelling Masterclass for British Homes',
    slug: 'step-by-step-wall-panelling-masterclass',
    category: 'diy',
    categoryName: 'DIY',
    categoryLabel: 'UK DIY MASTERCLASS',
    author: 'Sarah Jenkins',
    role: 'DIY & Restoration Lead',
    date: 'September 06, 2026',
    readTime: '6 min read',
    views: '22.1k',
    excerpt: 'Transform plain plasterboard walls into elegant wainscoting and Georgian grid panelling using standard moisture-resistant MDF timber strips and Gripfill.',
    heroImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    content: `
      <p>Wall panelling adds instant depth, architectural proportion, and timeless character to both new-build UK houses and older period flats.</p>
      
      <h3>Materials List from UK Builders Merchants</h3>
      <ul>
        <li>9mm or 12mm Moisture Resistant (MR) MDF strips (cut to 70mm - 90mm width)</li>
        <li>Solvent-free instant grab adhesive (No More Nails / Gripfill)</li>
        <li>Fine-surface decorators caulk and flexible wood filler</li>
        <li>Spirit level (minimum 1m length) and mitre box saw</li>
        <li>Eggshell or Satinwood interior wood paint</li>
      </ul>

      <h3>Step 1: Calculating Spacing</h3>
      <p>Measure the total wall width in millimetres. Subtract the combined width of all vertical stiles, then divide by the desired number of panels (typically 4 to 6 panels per average 3.5m British wall).</p>

      <h3>Step 2: Fixing & Caulking</h3>
      <p>Apply generous S-beads of adhesive to the rear of each MDF strip. Press firmly against the wall and check alignment with your spirit level. Allow 24 hours before filling seam joints and applying your primer.</p>
    `,
    keyTakeaway: 'Always use MR (Green-core) MDF when panelling in bathrooms or hallway areas prone to seasonal UK humidity changes.'
  },
  {
    id: 'shaker-kitchen-design',
    title: 'Crafting the Ultimate British Shaker Kitchen: Layout & Materials Guide',
    slug: 'ultimate-british-shaker-kitchen-guide',
    category: 'kitchen',
    categoryName: 'Kitchen',
    categoryLabel: 'KITCHEN ARCHITECTURE',
    author: 'Marcus Cole',
    role: 'Kitchen Design Architect',
    date: 'September 05, 2026',
    readTime: '5 min read',
    views: '16.3k',
    excerpt: 'Timeless cabinetry proportions, unlacquered brass hardware, and honed Carrara marble worktops for modern British homes.',
    heroImage: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
    content: `
      <p>The British Shaker kitchen remains an enduring design icon. Its beauty lies in unadorned simplicity, authentic craftsmanship, and functional proportions.</p>
      
      <h3>Pared-Back In-Frame Cabinetry</h3>
      <p>Traditional in-frame construction features doors set within a hardwood frame. When finished in muted tones like deep charcoal, soft olive, or off-white, the kitchen feels established rather than trendy.</p>

      <h3>Natural Worktop Surfaces</h3>
      <p>Pair painted timber cabinets with honed natural stone—whether Welsh slate, honed limestone, or Carrara marble—which patinate gracefully with age.</p>
    `,
    keyTakeaway: 'Incorporate deep pan drawers with solid oak dovetailed joints for optimal utensil organisation.'
  },
  {
    id: 'luxury-bathroom-sanctuary',
    title: 'Transforming Compact UK Bathrooms into Spa Sanctuaries',
    slug: 'transforming-compact-uk-bathrooms-spa-sanctuaries',
    category: 'bathroom',
    categoryName: 'Bathroom',
    categoryLabel: 'BATHROOM DESIGN',
    author: 'Clara Hughes',
    role: 'Wellness & Spa Consultant',
    date: 'September 04, 2026',
    readTime: '5 min read',
    views: '14.1k',
    excerpt: 'Space-saving fluted glass screens, concealed thermostatic valves, and microcement finishes for modern British bathrooms.',
    heroImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
    content: `
      <p>British bathrooms in Victorian terraces and urban flats often possess compact footprints. By utilizing reflective surfaces and seamless wetroom systems, even a small 2m x 2m bathroom transforms into an oasis.</p>
      
      <h3>Walk-In Crittall or Fluted Wetroom Screens</h3>
      <p>Replacing bulky shower enclosures with minimalist fluted glass screens maximizes visual space while providing tactile privacy.</p>

      <h3>Wall-Hung Vanity Units</h3>
      <p>Elevating cabinetry off the floor reveals continuous floor tiling beneath, immediately giving the perception of a larger room.</p>
    `,
    keyTakeaway: 'Always install underfloor heating before tiling compact bathrooms to accelerate drying and prevent dampness.'
  },
  {
    id: 'cottage-garden-outdoor-living',
    title: 'English Cottage Gardens: Designing Year-Round Outdoor Living Spaces',
    slug: 'english-cottage-gardens-outdoor-living',
    category: 'garden',
    categoryName: 'Garden',
    categoryLabel: 'GARDEN & OUTDOOR',
    author: 'Hugh Montgomery',
    role: 'Landscape Designer',
    date: 'September 03, 2026',
    readTime: '6 min read',
    views: '13.7k',
    excerpt: 'Gravel courtyards, heritage pergolas, and hardy perennial borders designed to thrive in the changing British climate.',
    heroImage: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80',
    content: `
      <p>An authentic English garden is a natural extension of the home interior. Blending structured boxwood hedging with free-flowing lavender, delphiniums, and rambling roses creates an enchanting setting.</p>
      
      <h3>Cotswold Gravel Patios</h3>
      <p>Gravel courtyards offer excellent drainage during wet UK seasons and provide an informal, rustic foundation for teak dining furniture.</p>

      <h3>Sheltered Timber Pergolas</h3>
      <p>Installing an oak pergola trained with wisteria or honeysuckle creates essential dappled shade during summer and shelter on breezy evenings.</p>
    `,
    keyTakeaway: 'Layer evergreen structural shrubs among flowering perennials to maintain architectural interest during winter.'
  },
  {
    id: 'buying-guide-sofas',
    title: 'The Ultimate UK Sofa Buying Guide: Quality, Fabrics & Proportions',
    slug: 'ultimate-uk-sofa-buying-guide',
    category: 'buying-guides',
    categoryName: 'Buying Guides',
    categoryLabel: 'EXPERT BUYING GUIDE',
    author: 'Eleanor Vance',
    role: 'Senior Architectural Editor',
    date: 'September 02, 2026',
    readTime: '6 min read',
    views: '19.8k',
    excerpt: 'What to look for in kiln-dried hardwood frames, feather-wrapped foam cushions, and stain-resistant Belgian linen weaves.',
    heroImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
    content: `
      <p>A sofa is the centerpiece investment of any British living room. Understanding frame construction and fabric durability ensures your piece endures for decades.</p>
      
      <h3>Frame Construction: Hardwood vs Softwood</h3>
      <p>Always verify the frame is crafted from FSC-certified kiln-dried beech or birch hardwood with dowelled and glued corner blocks. Avoid staples or particleboard frames.</p>

      <h3>Choosing the Right Fabric Martindale Score</h3>
      <p>For daily family living, select upholstery fabrics with a Martindale rub count of at least 30,000 cycles. Performance linen and wool blends offer luxury hand-feel with remarkable longevity.</p>
    `,
    keyTakeaway: 'Always measure doorway clearance, hallway turns, and stairwells before finalizing delivery dimensions.'
  },
  {
    id: 'sage-terracotta-palette',
    title: 'Sage & Cotswold Terracotta: 2026 British Color Edit',
    slug: 'sage-cotswold-terracotta-color-edit',
    category: 'interiors',
    categoryName: 'INTERIORS',
    categoryLabel: 'DESIGN TRENDS • INTERIORS',
    author: 'Editorial Desk',
    role: 'Trend Forecast Team',
    date: 'September 01, 2026',
    readTime: '4 min read',
    views: '15.7k',
    excerpt: 'How grounding earthy terracottas, muted sage greens, and warm linen textiles capture cozy natural warmth during overcast British afternoons.',
    heroImage: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
    content: `
      <p>British interiors in 2026 are moving decisively away from sterile cool greys toward enveloping, nature-grounded earthy tones inspired by countryside manors.</p>
      
      <h3>The Power of Sage Green</h3>
      <p>Muted sage green acts as a gentle botanical neutral. When applied in low-sheen Dead Flat or Estate Emulsion formulations, it softens harsh northern daylight.</p>

      <h3>Warm Terracotta Accents</h3>
      <p>Pairing sage walls with hand-thrown terracotta table lamps, wool bouclé throws, and natural jute floor runners introduces tactile depth and visual warmth.</p>
    `,
    keyTakeaway: 'Test paint sample patches on both north and south-facing walls, observing shifts between 10am morning light and 4pm dusk.'
  }
];
