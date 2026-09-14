export const AUTHORS = [
  {
    id: 'sarah-jenkins',
    name: 'Sarah Jenkins',
    role: 'London Interior Stylist and Joinery Specialist',
    location: 'Chelsea, London, UK',
    avatar: 'https://images.unsplash.com/photo-1643908091873-a64caefd35fb?auto=format&fit=crop&w=800&q=85',
    coverImage: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=85',
    metaDescription: 'Explore luxury joinery masterclasses, bespoke kitchen architecture, and interior styling by London designer Sarah Jenkins on Lumaa Home.',
    shortDescription: 'Chelsea-based stylist specialising in bespoke in-frame joinery, handcrafted Shaker kitchens, and tactile architectural textures across British homes.',
    bio: 'Sarah works directly with British artisan cabinetmakers and joiners to create bespoke alcove cabinetry, handmade Shaker pantries, and tactile bedroom suites.',
    fullBio: [
      'With a background rooted in interior architecture and bespoke textile design, Sarah Jenkins is the driving force behind LUMAA HOME’s in-depth joinery masterclasses and bedroom design guides.',
      'Sarah collaborates closely with artisan timber workshops across Yorkshire and Oxfordshire to document the fine details of custom cabinetry, integrated warm illumination, and handmade brass fixtures.',
      'Her residential projects across Chelsea and Notting Hill showcase a masterclass in texture, combining raw Belgian linen, fluted oak panels, and microcement wetrooms.'
    ],
    quote: 'Bespoke cabinetry should disappear into the architecture, revealing its brilliance through effortless utility.',
    specialties: [
      'Alcove Cabinetry',
      'Handcrafted Shaker Kitchens',
      'Acoustic Linen Headboards',
      'Brass Hardware',
      'Material Tactility'
    ],
    socials: {
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com',
      email: 'info.lumaahome@gmail.com'
    },
    publishedYear: '2023 - Present',
    articleCount: 12
  },
  {
    id: 'eleanor-vance',
    name: 'Eleanor Vance',
    role: 'Senior Architectural and Restoration Editor',
    location: 'Kensington, London, UK',
    avatar: 'https://images.unsplash.com/photo-1637164860912-85ec65af9031?auto=format&fit=crop&w=800&q=85',
    coverImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85',
    metaDescription: 'Discover British period architectural restorations, listed townhouse tours, and heritage design guides by senior editor Eleanor Vance.',
    shortDescription: 'Senior architectural editor and Courtauld alumna documenting historic Grade II listed townhouse preservation and sustainable period restoration.',
    bio: 'Architectural historian and senior editor with over 15 years of experience documenting Grade I and Grade II listed townhouse restorations across London and Edinburgh. Eleanor specialises in Victorian plasterwork preservation, Georgian joinery, and sustainable lime plasters.',
    fullBio: [
      'Eleanor Vance joined LUMAA HOME™ after a decade working alongside leading British heritage preservation trusts in South Kensington and Edinburgh. Her writing delves deep into the architectural skeleton of historic homes, uncovering original cornicing techniques, bespoke joinery, and structural authenticity.',
      'Holding a Master’s degree in Architectural Conservation from the Courtauld Institute of Art, Eleanor regularly lectures on the sustainable future of period residences. She champions traditional craft practices while advocating for low-impact, energy-efficient modern integrations that respect original brickwork and timber frames.',
      'When not on site inspecting Grade II listed townhouse restorations, Eleanor curates private collections of British studio pottery and experiments with natural lime wash pigments in her own London residence.'
    ],
    quote: 'True British luxury in architecture lies in knowing what to restore with reverence, and where to introduce modern stillness.',
    specialties: [
      'Victorian Architecture',
      'Grade II Restorations',
      'Limewash Finishes',
      'London Period Properties',
      'Georgian Proportions'
    ],
    socials: {
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com',
      email: 'info.lumaahome@gmail.com'
    },
    publishedYear: '2021 - Present',
    articleCount: 14
  },
  {
    id: 'marcus-cole',
    name: 'Marcus Cole',
    role: 'Interiors and Period Living Editor',
    location: 'Marylebone, London, UK',
    avatar: 'https://images.unsplash.com/photo-1483995564125-85915c11dcfe?auto=format&fit=crop&w=800&q=85',
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
    metaDescription: 'Read curated interior styling rules, antique fireplace masterclasses, and luxury British furniture edits by design director Marcus Cole.',
    shortDescription: 'Mayfair interior curator and columnist exploring classical British proportions, period fireplace styling, and heirloom furniture investments.',
    bio: 'Former design director at an established Mayfair architectural studio, Marcus leads LUMAA HOME’s coverage of historic fireplaces, proportion rules, and curated living room furniture.',
    fullBio: [
      'Marcus Cole is an acclaimed interior curator and design journalist based in Marylebone, London. Having spent over twelve years directing high-profile residential interiors across Mayfair, Belgravia, and the Cotswolds, he brings an authoritative, refined eye to interior living.',
      'His editorial focus explores the balance between bold contemporary silhouettes and classical British antiques. Marcus is particularly renowned for his comprehensive analyses of focal hearths, antique marble mantels, and scale rules for spacious drawing rooms.',
      'Marcus acts as a trusted consultant for heritage restoration initiatives and frequently contributes to international design panels celebrating bespoke British craftsmanship.'
    ],
    quote: 'A room must feel gathered over decades, never purchased in an afternoon.',
    specialties: [
      'Fireplace Styling',
      'Proportion and Scale',
      'Antique Marble Mantels',
      'Bespoke Upholstery',
      'Atmospheric Lighting'
    ],
    socials: {
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com',
      email: 'info.lumaahome@gmail.com'
    },
    publishedYear: '2022 - Present',
    articleCount: 11
  }
];

export function getAuthorById(id) {
  if (!id) return AUTHORS[0];
  const found = AUTHORS.find(a => a.id === id);
  if (found) return found;
  // Fallback: match by name
  return AUTHORS.find(a => a.name.toLowerCase() === id.toLowerCase()) || AUTHORS[0];
}
