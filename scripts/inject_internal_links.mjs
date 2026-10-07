import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const ARTICLES_FILE = path.join(ROOT_DIR, 'src', 'data', 'articles.js');

const LINK_PLANS = [
  // GARDEN (5 Articles)
  {
    slug: 'choosing-the-best-outdoor-log-burner-for-your-garden',
    headingMatch: /protecting combustible timber decking/i,
    position: 'middle',
    sentence: 'If you prefer an open flame instead of an enclosed chimney, an [outdoor fire pit](/choosing-the-best-fire-pit-out-for-your-english-garden) needs that same stone base so flying sparks do not reach dry decking.'
  },
  {
    slug: 'choosing-the-best-fire-pit-out-for-your-english-garden',
    headingMatch: /kiln dried oak logs/i,
    position: 'last',
    sentence: 'You can keep spare kindling dry through wet weather with a sturdy [timber garden storage box](/choosing-a-high-specification-garden-storage-box-for-timber) placed right by the seating area.'
  },
  {
    slug: 'choosing-a-high-specification-garden-storage-box-for-timber',
    headingMatch: /patio placement and weather/i,
    position: 'start',
    sentence: 'Homeowners running an [outdoor log burner](/choosing-the-best-outdoor-log-burner-for-your-garden) often place the storage unit close to the patio for quick fuel top ups.'
  },
  {
    slug: 'crafting-a-stunning-garden-with-borders-across-britain',
    headingMatch: /seasonal flower layering/i,
    position: 'middle',
    sentence: 'Taller architectural grasses like those seen in [London sky garden spaces](/sky-garden-london-principles-for-elevated-botanical-spaces) work well at the back of the border to screen off neighbours.'
  },
  {
    slug: 'sky-garden-london-principles-for-elevated-botanical-spaces',
    headingMatch: /vertical planting and zoning/i,
    position: 'last',
    sentence: 'Layering your planting heights mimics the tiered look of [traditional British garden borders](/crafting-a-stunning-garden-with-borders-across-britain).'
  },

  // KITCHEN (8 Articles)
  {
    slug: 'choosing-practical-drawers-in-the-kitchen-space',
    headingMatch: /organising everyday utensil drawers/i,
    position: 'start',
    sentence: 'When planning [kitchen cabinet joinery](/mastering-kitchen-cabinets-design-joinery-and-proportion), wide cutlery drawers work best when fitted directly under the main food preparation counter.'
  },
  {
    slug: 'mastering-kitchen-cabinets-design-joinery-and-proportion',
    headingMatch: /base unit ergonomics and deep storage/i,
    position: 'middle',
    sentence: 'Swapping deep shelves for [practical kitchen drawers](/choosing-practical-drawers-in-the-kitchen-space) saves you having to reach into dark base cupboards.'
  },
  {
    slug: 'how-to-choose-the-best-kitchen-bin-for-built-in-cabinets',
    headingMatch: /width and depth tolerances/i,
    position: 'middle',
    sentence: 'Pull out bins use the exact same heavy duty runners found on [deep kitchen drawers](/choosing-practical-drawers-in-the-kitchen-space), so they handle daily rubbish weight easily.'
  },
  {
    slug: 'how-to-select-a-quality-kitchen-sink-for-modern-uk-homes',
    headingMatch: /undermount versus inset/i,
    position: 'last',
    sentence: 'Undermount bowls need solid waterproof support, which works best alongside properly sealed [craft kitchen worktops](/selecting-craft-kitchen-worktops-for-modern-british-homes).'
  },
  {
    slug: 'selecting-craft-kitchen-worktops-for-modern-british-homes',
    headingMatch: /cutouts for appliances and undermount basins/i,
    position: 'middle',
    sentence: 'Cutouts for an [undermount kitchen sink](/how-to-select-a-quality-kitchen-sink-for-modern-uk-homes) must be sealed with silicone to stop water seeping into timber cores.'
  },
  {
    slug: 'choosing-and-fitting-modern-lt-kitchen-cabinets-today',
    headingMatch: /leveling and alignment techniques/i,
    position: 'start',
    sentence: 'If you are following our general [DIY kitchen fitting guide](/crafting-bespoke-diy-kitchens-the-british-fitting-guide), always level your base units before touching any wall cupboards.'
  },
  {
    slug: 'crafting-bespoke-diy-kitchens-the-british-fitting-guide',
    headingMatch: /securing wall cabinets and hanging rails/i,
    position: 'last',
    sentence: 'This laser leveling step is essential when hanging [modern kitchen cabinets](/choosing-and-fitting-modern-lt-kitchen-cabinets-today) on uneven plasterboard walls.'
  },
  {
    slug: 'choosing-quality-storage-cabinets-living-room-storage-cabine',
    headingMatch: /solid back panel construction/i,
    position: 'middle',
    sentence: 'Look for the same solid back panels used in quality [kitchen cabinet design](/mastering-kitchen-cabinets-design-joinery-and-proportion) to prevent the unit from wobbling.'
  },

  // BATHROOM (6 Articles)
  {
    slug: 'designing-serene-spaces-with-premium-green-bathroom-tiles',
    headingMatch: /comparing glazed earthenware and porcelain/i,
    position: 'last',
    sentence: 'Renting tenants who cannot lay real ceramics can try [stick on bathroom tiles](/stunning-transformations-using-stick-on-bathroom-tiles) for a quick splashback update.'
  },
  {
    slug: 'stunning-transformations-using-stick-on-bathroom-tiles',
    headingMatch: /colour choices and modern aesthetics/i,
    position: 'middle',
    sentence: 'Peel and stick vinyls often copy the glazed look of [green bathroom tiles](/designing-serene-spaces-with-premium-green-bathroom-tiles), giving you an earthy look on a small budget.'
  },
  {
    slug: 'transform-british-interiors-with-large-bathroom-tiles-now',
    headingMatch: /cutting down on grout lines and maintenance/i,
    position: 'start',
    sentence: 'When [selecting bathroom tiles](/selecting-bathroom-tiles-for-refined-architectural-homes) for smaller en suites, oversized formats actually make the floor look wider by cutting down on grout lines.'
  },
  {
    slug: 'selecting-bathroom-tiles-for-refined-architectural-homes',
    headingMatch: /slip resistance in walk in wetrooms/i,
    position: 'last',
    sentence: 'For walk in wetrooms, pairing small mosaic shower floors with [large bathroom tiles](/transform-british-interiors-with-large-bathroom-tiles-now) on the walls keeps drainage simple.'
  },
  {
    slug: 'architectural-design-principles-luxury-bath-tub',
    headingMatch: /freestanding bath positioning and floor loading/i,
    position: 'middle',
    sentence: 'Families with young children can set up a [safe baby bath tub zone](/designing-the-safe-baby-bath-tub-zone-for-modern-bathrooms) right beside a freestanding bath using a soft non slip floor runner.'
  },
  {
    slug: 'designing-the-safe-baby-bath-tub-zone-for-modern-bathrooms',
    headingMatch: /water splash protection and slip prevention/i,
    position: 'last',
    sentence: 'Keeping splash water off polished tiles is just as important around a [freestanding bath tub](/architectural-design-principles-luxury-bath-tub).'
  },

  // LIVING ROOM (3 Articles)
  {
    slug: 'how-to-layer-living-room-lights-for-warm-architectural-depth',
    headingMatch: /the three lighting layers/i,
    position: 'middle',
    sentence: 'Placing warm [floor lamps for living rooms](/floor-lamps-for-living-room-layouts-architectural-guide) in dark corners spreads soft light without bouncing harsh glare off the television.'
  },
  {
    slug: 'floor-lamps-for-living-room-layouts-architectural-guide',
    headingMatch: /placing living room floor lamps beside sofas/i,
    position: 'start',
    sentence: 'To finish your scheme, follow our practical rules on [how to layer living room lights](/how-to-layer-living-room-lights-for-warm-architectural-depth) so your ceiling pendants and reading lamps work on separate switches.'
  },
  {
    slug: 'choosing-rugs-for-living-room-spaces-with-style',
    headingMatch: /placing furniture feet on living room rugs/i,
    position: 'last',
    sentence: 'Make sure all front sofa legs and heavy [living room floor lamps](/floor-lamps-for-living-room-layouts-architectural-guide) rest flat on the rug surface to stop trip hazards.'
  },

  // BEDROOM (4 Articles)
  {
    slug: 'how-to-choose-a-master-bedroom-chair-for-timeless-comfort',
    headingMatch: /matching timber finishes and upholstery/i,
    position: 'start',
    sentence: 'When pairing an armchair with other [quality bedroom furniture](/crafting-timeless-spaces-with-quality-bedroom-furniture), match the wood finish to your bedside tables for a balanced look.'
  },
  {
    slug: 'crafting-timeless-spaces-with-quality-bedroom-furniture',
    headingMatch: /statement armchairs and dressing seating/i,
    position: 'middle',
    sentence: 'Adding an upholstered [master bedroom chair](/how-to-choose-a-master-bedroom-chair-for-timeless-comfort) creates a quiet reading corner away from busy family areas.'
  },
  {
    slug: 'refined-bedroom-decor-ideas-for-timeless-british-houses',
    headingMatch: /timeless furniture investments/i,
    position: 'last',
    sentence: 'You can ground a neutral colour palette with sturdy [oak bedroom furniture](/crafting-timeless-spaces-with-quality-bedroom-furniture) that gets better with age.'
  },
  {
    slug: 'finding-the-ideal-3-bedroom-house-for-rent-in-britain',
    headingMatch: /personalising rented bedrooms/i,
    position: 'middle',
    sentence: 'Once you move into a rental property, simple [bedroom decor ideas](/refined-bedroom-decor-ideas-for-timeless-british-houses) like fresh linen curtains help make the space feel like home without losing your deposit.'
  },

  // DIY (3 Articles)
  {
    slug: 'mastering-fablon-sticky-plastic-for-british-homes',
    headingMatch: /preparing your surfaces before application/i,
    position: 'middle',
    sentence: 'The same surface cleaning rules apply when [applying self adhesive wall tiles](/applying-self-adhesive-wall-tiles-in-modern-british-homes), where kitchen grease can stop the backing from sticking.'
  },
  {
    slug: 'applying-self-adhesive-wall-tiles-in-modern-british-homes',
    headingMatch: /smoothing air pockets and edge seals/i,
    position: 'start',
    sentence: 'Much like wrapping worktops with [Fablon sticky plastic](/mastering-fablon-sticky-plastic-for-british-homes), pressing out trapped air bubbles with a squeegee stops tiles lifting at the seams.'
  },
  {
    slug: 'creating-a-diy-art-club-space-for-collaborative-studios',
    headingMatch: /practical splash protection for wash basins/i,
    position: 'last',
    sentence: 'Protecting messy craft sinks is easy with wipe clean [self adhesive wall tiles](/applying-self-adhesive-wall-tiles-in-modern-british-homes) that fit straight over old plaster.'
  },

  // INTERIORS (2 Articles)
  {
    slug: 'bringing-bright-summer-flowers-into-your-british-home',
    headingMatch: /displaying arrangements in entryways and hallways/i,
    position: 'last',
    sentence: 'Fresh seasonal floral arrangements remain one of the easiest [home interior design ideas](/inspiring-home-interior-design-ideas-for-british-properties) to brighten a dark hallway.'
  },
  {
    slug: 'inspiring-home-interior-design-ideas-for-british-properties',
    headingMatch: /bringing natural seasonal accents indoors/i,
    position: 'middle',
    sentence: 'In living spaces with heavy wood furniture, [bringing summer flowers into your home](/bringing-bright-summer-flowers-into-your-british-home) adds instant natural colour.'
  }
];

export async function run() {
  const fileContent = fs.readFileSync(ARTICLES_FILE, 'utf-8');
  const mod = await import(`file://${ARTICLES_FILE}?t=${Date.now()}`);
  const articles = mod.ARTICLES;

  let totalUpdated = 0;

  for (const plan of LINK_PLANS) {
    const art = articles.find(a => a.slug === plan.slug);
    if (!art) {
      console.warn(`[WARN] Article not found for slug: ${plan.slug}`);
      continue;
    }

    if (!Array.isArray(art.content)) continue;

    // Find section by regex match or find section past middle
    let targetSec = art.content.find(s => plan.headingMatch.test(s.heading || ''));
    if (!targetSec) {
      // Fallback: pick section at index Math.floor(art.content.length * 0.6)
      const targetIdx = Math.floor(art.content.length * 0.6);
      targetSec = art.content[targetIdx];
      console.log(`[FALLBACK] Using section index ${targetIdx} (${targetSec.heading}) for ${plan.slug}`);
    }

    // Check if link already present
    if (JSON.stringify(targetSec).includes(plan.sentence)) {
      console.log(`[SKIP] Already linked in ${plan.slug}`);
      continue;
    }

    // Insert sentence according to position
    if (typeof targetSec.body === 'string') {
      const paras = targetSec.body.split('\n\n').filter(Boolean);
      const pIdx = Math.min(1, paras.length - 1);
      const originalPara = paras[pIdx];

      if (plan.position === 'start') {
        paras[pIdx] = `${plan.sentence} ${originalPara}`;
      } else if (plan.position === 'middle') {
        const sentences = originalPara.match(/[^.!?]+[.!?]+(\s|$)/g) || [originalPara];
        if (sentences.length > 1) {
          sentences.splice(1, 0, ` ${plan.sentence} `);
          paras[pIdx] = sentences.join('').replace(/\s+/g, ' ').trim();
        } else {
          paras[pIdx] = `${originalPara} ${plan.sentence}`;
        }
      } else {
        // last
        paras[pIdx] = `${originalPara} ${plan.sentence}`;
      }
      targetSec.body = paras.join('\n\n');
      totalUpdated++;
    }
  }

  // Write back formatted articles
  const newContent = `export const CATEGORIES = ${JSON.stringify(mod.CATEGORIES, null, 2)};\n\nexport const ARTICLES = ${JSON.stringify(articles, null, 2)};\n`;
  fs.writeFileSync(ARTICLES_FILE, newContent, 'utf-8');
  console.log(`✅ Successfully updated ${totalUpdated} articles with natural internal links!`);
}

run().catch(console.error);
