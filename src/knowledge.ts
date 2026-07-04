export type BuddyResponse = {
  category: string;
  paragraphs: string[];
};

type Entry = {
  keywords: string[];
  category: string;
  paragraphs: string[];
};

const knowledge: Entry[] = [
  {
    keywords: ['neighborhood', 'neighbourhood', 'area to live', 'where to live', 'best area', 'district', 'remote worker', '2000', 'nomad', 'where should i', 'place to live', 'live in lisbon'],
    category: 'Neighborhoods',
    paragraphs: [
      "For a remote worker on around €2,000 a month, I'd point you toward a few spots depending on your vibe. Príncipe Real is lovely — leafy, walkable, full of cafés like Copenhagen Coffee Lab and Dear Breakfast, and you're 10 minutes from Avenida da Liberdade. A studio runs €900–€1,200, which leaves room in your budget for coworking and meals out.",
      "If you want something quieter and cheaper, Anjos or Arroios are up-and-coming, more affordable (€700–€1,000 for a studio), and still right on the Metro. Cais do Sodré is the energetic option — great nightlife, Time Out Market next door, and coworking like Second Home — but pricier at €1,000–€1,400 for a one-bed.",
      "For the best value-to-quality ratio, look at Estrela or Lapa — calm, elegant, near the river, and slightly under the radar. One honest tip: the rental market is tight right now. Start on Idealista or HousingAnywhere 4–6 weeks before you arrive, and consider a short-term place first while you hunt in person. Avoid paying deposits before viewing — scams are real here.",
    ],
  },
  {
    keywords: ['nif', 'bank', 'bank account', 'fiscal', 'open a bank', 'banking', 'tax number', 'documento'],
    category: 'NIF & Banking',
    paragraphs: [
      "Getting a NIF (Número de Identificação Fiscal) is your first milestone, and it's surprisingly straightforward. Head to a Finanças office — the one on Avenida da Liberdade is central — with your passport and proof of address. Your home country's address works initially. It's free, usually done same-day, and you'll get your number on the spot. If you're not yet in Portugal, services like E-residence or Anchorless can get you a NIF remotely for around €40–€150.",
      "For a bank account, you'll typically need your NIF, passport, proof of address, and sometimes a Portuguese phone number. Novo Banco, Millennium BCP, and Caixa Geral de Depósitos are the main traditional options — expect a couple of visits and some patience with paperwork. ActivoBank is a popular digital-first choice with lower fees, and Wise is great for managing euros alongside your home currency while you settle in.",
      "Heads-up: requirements change and some branches are stricter than others. I'd call ahead or check the bank's website for the latest document list. If you hit a wall, a relocation service can smooth things out for a fee — worth it if you're short on time and Portuguese.",
    ],
  },
  {
    keywords: ['café', 'cafe', 'coffee', 'wifi', 'wi-fi', 'work from', 'coworking', 'remote work', 'príncipe real', 'principe real', 'laptop', 'work remotely'],
    category: 'Cafés & Coworking',
    paragraphs: [
      "Príncipe Real is a fantastic base for remote work. Copenhagen Coffee Labs on Rua da Rosa is a favorite — proper espresso, fast WiFi, and a calm upstairs area. The Mill, also on Rua da Rosa, has good coffee, plenty of power outlets, and a nomad-friendly vibe. Dear Breakfast does great brunch and solid connectivity, though it gets busy on weekends.",
      "If you want a dedicated workspace, Heden Príncipe Real is right in the neighborhood with polished desks and meeting rooms. A short walk or tram ride away, Coworking Lisboa near Cais do Sodré and Second Home inside the Mercado da Ribeira building are both excellent for a change of scene.",
      "Practical tip: Portuguese cafés are relaxed about laptop use on weekdays, but many discourage it on weekends when locals come to socialize. Bring a Type F power adapter (Portugal uses the same two-pin round sockets as most of Europe) and order something every couple of hours if you're camping — it keeps the goodwill going.",
    ],
  },
  {
    keywords: ['expensive', 'cost', 'cost of living', 'price', 'prices', 'budget', 'afford', 'compared to', 'eu capitals', 'how much', 'salary', 'spend'],
    category: 'Cost of Living',
    paragraphs: [
      "Compared to other EU capitals, Lisbon sits in the middle — cheaper than Paris, Amsterdam, or Dublin, but pricier than it was five years ago. Rent is the big variable: a one-bedroom in central Lisbon averages €1,000–€1,500, while Berlin or Madrid are similar or slightly higher, and Paris is notably more. Groceries are affordable — local frutarias and the Mercado da Ribeira keep food costs low, maybe €200–€300 a month for one person cooking at home.",
      "Eating out is where Lisbon shines. A lunch menu (prato do dia) runs €8–€12, and an espresso is under €1. Public transport is cheap — a monthly pass is €40, or €30 with the Lisboa Viva discount. Utilities and internet are reasonable, around €80–€120 a month combined for a flat.",
      "The catch: local salaries are low, but as a remote worker earning in euros or a stronger currency, your money goes far. Tourism has pushed prices up in central areas, so living slightly outside the core — Alvalade, Telheiras, or Campo de Ourique — keeps costs down without losing convenience.",
    ],
  },
  {
    keywords: ['housing', 'short-term', 'short term', 'rent', 'apartment', 'flat', 'find a place', 'airbnb', 'accommodation', 'stay', 'move', 'landlord'],
    category: 'Housing & Rentals',
    paragraphs: [
      "For short-term stays of one to three months, start with Airbnb for flexibility, then pivot to HousingAnywhere or Flatio for medium-term furnished rentals — often cheaper than Airbnb once you're past 30 days. Idealista has an 'arrendamento' section with monthly rentals, and Spotahome lets you book places with video tours before you arrive.",
      "Neighborhood-wise for a first landing: Príncipe Real, Bairro Alto, and Cais do Sodré are lively and central but pricier. If you want calm and value, try Estrela, Graça, or Alvalade — still well-connected by Metro and tram. A studio short-term runs €700–€1,200 a month depending on area and season.",
      "One real tip: summer (July–September) is peak season and prices spike, sometimes double. If you can, arrive between October–November or February–April for better deals and more landlord flexibility. Always confirm the exact address and check Google Street View — listings sometimes stretch the truth about 'central' locations.",
    ],
  },
  {
    keywords: ['visa', 'residency', 'residence', 'd7', 'd8', 'nomad visa', 'immigration', 'aima', 'sef', 'stay long', 'legal', 'permit', 'citizen', 'eu citizen'],
    category: 'Visas & Residency',
    paragraphs: [
      "The path depends on your nationality and situation. EU citizens just register residency at the Câmara Municipal after 90 days — relatively simple. Non-EU folks often start with the D7 (passive income like pensions, rentals, dividends) or the D8 'Digital Nomad Visa' (remote work income around €3,280+ a month, based on the Portuguese minimum wage). The process goes through the Portuguese consulate in your home country or via AIMA, the agency that replaced SEF, once you're in Portugal.",
      "Documents typically include: passport, proof of income, NIF, Portuguese bank account, health insurance, and an apostilled criminal record check. Processing times vary — plan for 2–6 months, sometimes longer. The D8 is popular with remote workers right now, but rules and income thresholds update, so check the official vistos.mgov.gov.pt portal or AIMA's site for current requirements.",
      "Honestly, many people use an immigration lawyer or service to avoid paperwork headaches. It costs €500–€2,000 depending on complexity, but saves weeks of back-and-forth. Book consulate appointments early — they fill up fast, especially in London, Berlin, and São Paulo.",
    ],
  },
  {
    keywords: ['transport', 'transportation', 'metro', 'bus', 'tram', 'getting around', 'get around', 'train', 'taxi', 'uber', 'ferry', 'pass', 'card'],
    category: 'Transport',
    paragraphs: [
      "Getting around Lisbon is easy once you get the hang of it. The Metro is clean, fast, and covers most of the city — a single ticket is €1.80, or get a monthly pass for €40 (€30 with the Lisboa Viva discount). The Viva Viagem card costs €0.50 for the card itself and works across Metro, buses, trams, and even trains to Cascais and Sintra.",
      "The iconic Tram 28 is charming but packed with tourists — ride it once for the experience, then rely on the Metro and buses for daily life. Trams and funiculars (like the Elevador da Glória) are included in the pass. For the river, the ferry from Cais do Sodré to Cacilhas costs €1.30 and gives you a beautiful view of the city skyline.",
      "Taxis and Uber/Bolt are cheap — a cross-town ride is €6–€12. Walking is great in central neighborhoods, but Lisbon is hilly, so wear good shoes. For day trips, trains to Cascais (€2.25) and Sintra (€4.30) are a bargain and run frequently from Cais do Sodré and Rossio stations.",
    ],
  },
  {
    keywords: ['health', 'healthcare', 'doctor', 'hospital', 'medical', 'insurance', 'pharmacy', 'sick', 'dentist', 'clinic', 'sns'],
    category: 'Healthcare',
    paragraphs: [
      "Portugal's healthcare is solid and accessible. The public system (SNS) is free or low-cost for residents with a número de utente — you register at your local health center (centro de saúde) with your residency card and NIF. Wait times for non-urgent care can be long, so many expats add private insurance (€30–€80 a month) for faster access at places like CUF or Hospital da Luz.",
      "For a GP, you'll be assigned one at your centro de saúde, but scheduling can take weeks. Pharmacies (farmácias) are everywhere and pharmacists are knowledgeable — many minor issues can be handled there without a doctor visit. Emergency care is at any hospital's 'Urgência' department; the main central one is Hospital de São José.",
      "If you're not yet a resident, travel insurance or a private plan is your best bet until you're enrolled. EU citizens can use the EHIC for temporary stays. For ongoing prescriptions, bring a supply and a doctor's note — getting some medications transferred takes paperwork and a local prescription.",
    ],
  },
  {
    keywords: ['weather', 'climate', 'rain', 'sun', 'sunshine', 'temperature', 'season', 'winter', 'summer', 'lifestyle', 'life like', 'culture', 'social', 'community'],
    category: 'Weather & Lifestyle',
    paragraphs: [
      "Lisbon's weather is one of its biggest draws — around 300 days of sunshine a year. Summers (June–September) are hot and dry, 25–35°C, with almost no rain. Winters (December–February) are mild, 8–15°C, but can be rainy, and the old apartments get cold — many lack central heating, so a good space heater is worth buying. Spring and autumn are the sweet spots: 18–25°C, light jackets, terraces open.",
      "Lifestyle-wise, it's relaxed and social. Long lunches, evenings on a terrace, weekend trips to the beach (Costa da Caparica is 30 minutes away). The pace is slower than northern Europe — don't expect punctuality to be a national sport. Portuguese people are warm and helpful; learning even basic Portuguese ('bom dia,' 'obrigado/a') goes a long way.",
      "The nomad scene is big — meetups, language exchanges, and coworking spaces make it easy to build a community. Just know that central Lisbon gets crowded with tourists in summer, and some locals feel the strain of over-tourism, so being a respectful, engaged resident (not just a visitor) is genuinely appreciated.",
    ],
  },
  {
    keywords: ['crypto', 'web3', 'ethereum', 'bitcoin', 'btc', 'eth', 'nft', 'blockchain', 'wallet', 'metamask', 'token', 'defi', 'coin', 'usdc', 'usdt', 'stablecoin', 'pay with crypto', 'accept crypto', 'crypto payment'],
    category: 'Crypto & Web3 in Lisbon',
    paragraphs: [
      "Lisbon has quietly become one of Europe's most exciting Web3 hubs. The community is active and welcoming — you'll find crypto meetups almost weekly, and big events like Lisbon Web3 Week (usually alongside Solana Breakpoint or ETHGlobal hackathons) draw builders from all over. Crypto-friendly cafés and coworking spots are scattered across Príncipe Real, Cais do Sodré, and LX Factory, where you'll overhear conversations about DeFi and NFTs over a galão.",
      "For everyday crypto use, a handful of cafés and restaurants in central Lisbon accept crypto payments — mostly through apps like Utrust or direct wallet transfers. The LX Factory area has a few spots that are crypto-curious, and some coworking spaces like Heden and Second Home have Web3-focused members. For crypto ATMs, there are a couple near Rossio and in shopping centers like Colombo, though fees are high — you're better off using an exchange like Binance, Kraken, or Coinbase and transferring to a local bank.",
      "If you're earning in crypto, the practical move is to convert to EUR for rent and daily expenses, since most landlords and shops don't accept crypto directly. Wise or Revolut are popular bridges. For taxes, Portugal has historically been crypto-friendly — crypto held for over 12 months is generally not taxed as capital gains, but rules evolve, so check the latest from the Autoridade Tributária (Portal das Finanças) or consult a Portuguese tax advisor who understands crypto.",
    ],
  },
];

const fallback: BuddyResponse = {
  category: 'General Lisbon Advice',
  paragraphs: [
    "That's a great question — Lisbon has a way of surprising you once you're here. I can help with neighborhoods, visas and the NIF, banking, cafés and coworking, transport, healthcare, housing, cost of living, crypto and Web3, and the general lifestyle. Tell me a bit more about your situation and I'll give you something specific and practical.",
    "For example, are you already in Lisbon or still planning? Are you working remotely, studying, or retiring? And what matters most to you right now — finding a place to live, sorting paperwork, or just getting oriented in the city? The more context you share, the better I can tailor my advice.",
    "If it's something I'm not certain about — like a legal deadline or a fee that changes often — I'll say so and point you to the official source, like the AIMA site, Portal das Finanças, or the relevant consulate. Better to verify than guess when it comes to paperwork.",
  ],
};

export function generateResponse(question: string): BuddyResponse {
  const q = question.toLowerCase();
  let bestMatch: Entry | null = null;
  let bestScore = 0;

  for (const entry of knowledge) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (q.includes(kw)) {
        score += kw.length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  if (bestMatch && bestScore > 0) {
    return {
      category: bestMatch.category,
      paragraphs: bestMatch.paragraphs,
    };
  }

  return fallback;
}
