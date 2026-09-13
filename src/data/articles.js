export const LOCATIONS = [
  { id: 'london', name: 'LONDON', badge: 'Flagship Edition' },
  { id: 'edinburgh', name: 'EDINBURGH', badge: 'Scottish Heritage' },
  { id: 'cotswolds', name: 'COTSWOLDS', badge: 'Country Estates' },
  { id: 'manchester', name: 'MANCHESTER', badge: 'Urban Living' },
];

export const CATEGORIES = [
  { id: 'all', name: 'ALL STORIES' },
  { id: 'luxury-home', name: 'LUXURY HOME' },
  { id: 'interiors', name: 'INTERIORS' },
  { id: 'diy-guides', name: 'DIY GUIDES' },
  { id: 'period-homes', name: 'PERIOD PROPERTIES' },
  { id: 'lifestyle', name: 'LIFESTYLE & TRAVEL' },
];

export const ARTICLES = [
  {
    id: 'kensington-townhouse',
    title: 'Inside a Restored 19th-Century Victorian Townhouse in Kensington',
    slug: 'inside-restored-victorian-townhouse-kensington',
    category: 'LUXURY HOME',
    categoryLabel: 'COVER STORY • UK INTERIORS',
    location: 'london',
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
    category: 'INTERIORS',
    categoryLabel: 'LUXURY DESIGN',
    location: 'london',
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
    category: 'PERIOD PROPERTIES',
    categoryLabel: 'REAL ESTATE & RENTALS',
    location: 'manchester',
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
    category: 'DIY GUIDES',
    categoryLabel: 'UK DIY GUIDES',
    location: 'cotswolds',
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
    id: 'insulating-sash-windows',
    title: 'Insulating Single-Glazed Sash Windows in Historic UK Properties',
    slug: 'insulating-single-glazed-sash-windows-uk',
    category: 'PERIOD PROPERTIES',
    categoryLabel: 'PERIOD PROPERTIES',
    location: 'edinburgh',
    author: 'David Miller',
    role: 'Conservation Specialist',
    date: 'September 04, 2026',
    readTime: '5 min read',
    views: '11.4k',
    excerpt: 'Preserving authentic timber box sash frames while eliminating draughts and reducing heat loss during damp Scottish and English winters.',
    heroImage: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80',
    content: `
      <p>Historic timber sash windows represent some of the most charming exterior facades across Edinburgh, Bath, and London. However, seasonal shrinkage leads to draughts.</p>
      
      <h3>Brush Pile Draught-Proofing Strips</h3>
      <p>Rather than unsightly expanding foam, install concealed brush pile carrier seals routed into the parting beads and meeting rails. This preserves smooth sash movement while blocking 90% of draughts.</p>

      <h3>Thermal Secondary Glazing</h3>
      <p>Discreet magnetic acrylic secondary glazing panels attach inside the timber staff bead during winter months and store flat during summer, complying fully with Grade II listed building constraints.</p>
    `,
    keyTakeaway: 'Never paint over historic sash cords or brass pulleys, as friction buildup leads to premature cord snapping.'
  },
  {
    id: 'sage-terracotta-palette',
    title: 'Sage & Cotswold Terracotta: 2026 British Color Edit',
    slug: 'sage-cotswold-terracotta-color-edit',
    category: 'INTERIORS',
    categoryLabel: 'DESIGN TRENDS',
    location: 'cotswolds',
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
