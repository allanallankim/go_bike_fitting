export interface BikeGeometry {
  id: string;
  brand: string;
  model: string;
  year: number;
  category: 'Aero' | 'All-Round' | 'Endurance' | 'Gravel';
  sizes: {
    sizeName: string;
    stack: number;        // mm
    reach: number;        // mm
    topTubeLength: number;// mm
    seatTubeAngle: number;// deg
    headTubeAngle: number;// deg
    wheelbase: number;    // mm
    recommendedHeight: [number, number]; // [min, max] in cm
    stockCrankLength: number; // mm
  }[];
}

export const BIKE_DATABASE: BikeGeometry[] = [
  {
    id: 'specialized-tarmac-sl8',
    brand: 'Specialized',
    model: 'S-Works Tarmac SL8',
    year: 2024,
    category: 'All-Round',
    sizes: [
      { sizeName: '49', stack: 514, reach: 375, topTubeLength: 508, seatTubeAngle: 75.5, headTubeAngle: 71.75, wheelbase: 973, recommendedHeight: [155, 163], stockCrankLength: 165 },
      { sizeName: '52', stack: 527, reach: 380, topTubeLength: 531, seatTubeAngle: 74.0, headTubeAngle: 72.5, wheelbase: 975, recommendedHeight: [163, 170], stockCrankLength: 170 },
      { sizeName: '54', stack: 544, reach: 384, topTubeLength: 540, seatTubeAngle: 74.0, headTubeAngle: 73.0, wheelbase: 978, recommendedHeight: [170, 177], stockCrankLength: 172.5 },
      { sizeName: '56', stack: 565, reach: 395, topTubeLength: 562, seatTubeAngle: 73.5, headTubeAngle: 73.5, wheelbase: 991, recommendedHeight: [177, 184], stockCrankLength: 172.5 },
      { sizeName: '58', stack: 591, reach: 402, topTubeLength: 577, seatTubeAngle: 73.5, headTubeAngle: 73.5, wheelbase: 1006, recommendedHeight: [184, 191], stockCrankLength: 175 },
    ]
  },
  {
    id: 'specialized-roubaix-sl8',
    brand: 'Specialized',
    model: 'Roubaix SL8',
    year: 2024,
    category: 'Endurance',
    sizes: [
      { sizeName: '49', stack: 545, reach: 362, topTubeLength: 519, seatTubeAngle: 74.5, headTubeAngle: 71.5, wheelbase: 990, recommendedHeight: [155, 163], stockCrankLength: 165 },
      { sizeName: '52', stack: 560, reach: 368, topTubeLength: 535, seatTubeAngle: 74.0, headTubeAngle: 72.0, wheelbase: 995, recommendedHeight: [163, 170], stockCrankLength: 170 },
      { sizeName: '54', stack: 585, reach: 376, topTubeLength: 545, seatTubeAngle: 74.0, headTubeAngle: 72.5, wheelbase: 1000, recommendedHeight: [170, 177], stockCrankLength: 172.5 },
      { sizeName: '56', stack: 605, reach: 384, topTubeLength: 563, seatTubeAngle: 73.5, headTubeAngle: 73.0, wheelbase: 1015, recommendedHeight: [177, 184], stockCrankLength: 172.5 },
      { sizeName: '58', stack: 630, reach: 392, topTubeLength: 578, seatTubeAngle: 73.5, headTubeAngle: 73.5, wheelbase: 1030, recommendedHeight: [184, 191], stockCrankLength: 175 },
    ]
  },
  {
    id: 'trek-madone-gen8',
    brand: 'Trek',
    model: 'Madone SLR Gen 8',
    year: 2025,
    category: 'Aero',
    sizes: [
      { sizeName: 'XS', stack: 515, reach: 373, topTubeLength: 512, seatTubeAngle: 74.5, headTubeAngle: 71.5, wheelbase: 972, recommendedHeight: [155, 165], stockCrankLength: 165 },
      { sizeName: 'S', stack: 535, reach: 380, topTubeLength: 530, seatTubeAngle: 74.0, headTubeAngle: 72.3, wheelbase: 978, recommendedHeight: [165, 172], stockCrankLength: 170 },
      { sizeName: 'M', stack: 555, reach: 388, topTubeLength: 549, seatTubeAngle: 73.5, headTubeAngle: 73.0, wheelbase: 987, recommendedHeight: [172, 179], stockCrankLength: 172.5 },
      { sizeName: 'ML', stack: 570, reach: 395, topTubeLength: 561, seatTubeAngle: 73.0, headTubeAngle: 73.5, wheelbase: 994, recommendedHeight: [177, 184], stockCrankLength: 172.5 },
      { sizeName: 'L', stack: 590, reach: 402, topTubeLength: 576, seatTubeAngle: 73.0, headTubeAngle: 73.8, wheelbase: 1007, recommendedHeight: [184, 191], stockCrankLength: 175 },
    ]
  },
  {
    id: 'trek-emonda-slr',
    brand: 'Trek',
    model: 'Émonda SLR',
    year: 2023,
    category: 'All-Round',
    sizes: [
      { sizeName: '50', stack: 521, reach: 374, topTubeLength: 521, seatTubeAngle: 74.6, headTubeAngle: 72.1, wheelbase: 974, recommendedHeight: [158, 166], stockCrankLength: 165 },
      { sizeName: '52', stack: 533, reach: 377, topTubeLength: 534, seatTubeAngle: 74.2, headTubeAngle: 72.8, wheelbase: 977, recommendedHeight: [166, 172], stockCrankLength: 170 },
      { sizeName: '54', stack: 555, reach: 386, topTubeLength: 543, seatTubeAngle: 73.7, headTubeAngle: 73.0, wheelbase: 981, recommendedHeight: [172, 178], stockCrankLength: 172.5 },
      { sizeName: '56', stack: 573, reach: 391, topTubeLength: 559, seatTubeAngle: 73.3, headTubeAngle: 73.5, wheelbase: 983, recommendedHeight: [178, 185], stockCrankLength: 172.5 },
    ]
  },
  {
    id: 'giant-tcr-adv-sl',
    brand: 'Giant',
    model: 'TCR Advanced SL (Gen 10)',
    year: 2024,
    category: 'All-Round',
    sizes: [
      { sizeName: 'XS', stack: 517, reach: 376, topTubeLength: 515, seatTubeAngle: 74.5, headTubeAngle: 71.0, wheelbase: 972, recommendedHeight: [157, 169], stockCrankLength: 165 },
      { sizeName: 'S', stack: 528, reach: 383, topTubeLength: 535, seatTubeAngle: 74.0, headTubeAngle: 72.3, wheelbase: 977, recommendedHeight: [165, 175], stockCrankLength: 170 },
      { sizeName: 'M', stack: 545, reach: 388, topTubeLength: 550, seatTubeAngle: 73.5, headTubeAngle: 73.0, wheelbase: 980, recommendedHeight: [171, 181], stockCrankLength: 172.5 },
      { sizeName: 'ML', stack: 567, reach: 397, topTubeLength: 570, seatTubeAngle: 73.0, headTubeAngle: 73.0, wheelbase: 997, recommendedHeight: [177, 187], stockCrankLength: 172.5 },
      { sizeName: 'L', stack: 588, reach: 402, topTubeLength: 580, seatTubeAngle: 73.0, headTubeAngle: 73.0, wheelbase: 1007, recommendedHeight: [183, 193], stockCrankLength: 175 },
    ]
  },
  {
    id: 'giant-propel-adv',
    brand: 'Giant',
    model: 'Propel Advanced SL',
    year: 2024,
    category: 'Aero',
    sizes: [
      { sizeName: 'XS', stack: 517, reach: 378, topTubeLength: 515, seatTubeAngle: 74.5, headTubeAngle: 71.0, wheelbase: 972, recommendedHeight: [157, 169], stockCrankLength: 165 },
      { sizeName: 'S', stack: 528, reach: 386, topTubeLength: 535, seatTubeAngle: 74.0, headTubeAngle: 72.3, wheelbase: 977, recommendedHeight: [165, 175], stockCrankLength: 170 },
      { sizeName: 'M', stack: 545, reach: 393, topTubeLength: 550, seatTubeAngle: 73.5, headTubeAngle: 73.0, wheelbase: 980, recommendedHeight: [171, 181], stockCrankLength: 172.5 },
      { sizeName: 'ML', stack: 567, reach: 401, topTubeLength: 570, seatTubeAngle: 73.0, headTubeAngle: 73.0, wheelbase: 997, recommendedHeight: [177, 187], stockCrankLength: 172.5 },
    ]
  },
  {
    id: 'canyon-aeroad-cfr',
    brand: 'Canyon',
    model: 'Aeroad CFR',
    year: 2024,
    category: 'Aero',
    sizes: [
      { sizeName: '2XS', stack: 489, reach: 373, topTubeLength: 510, seatTubeAngle: 74.0, headTubeAngle: 70.8, wheelbase: 968, recommendedHeight: [152, 162], stockCrankLength: 165 },
      { sizeName: 'XS', stack: 512, reach: 378, topTubeLength: 528, seatTubeAngle: 73.5, headTubeAngle: 71.8, wheelbase: 976, recommendedHeight: [162, 170], stockCrankLength: 170 },
      { sizeName: 'S', stack: 533, reach: 391, topTubeLength: 546, seatTubeAngle: 73.5, headTubeAngle: 72.8, wheelbase: 988, recommendedHeight: [170, 178], stockCrankLength: 170 },
      { sizeName: 'M', stack: 560, reach: 401, topTubeLength: 565, seatTubeAngle: 73.5, headTubeAngle: 73.3, wheelbase: 998, recommendedHeight: [178, 184], stockCrankLength: 172.5 },
      { sizeName: 'L', stack: 580, reach: 412, topTubeLength: 583, seatTubeAngle: 73.5, headTubeAngle: 73.5, wheelbase: 1012, recommendedHeight: [184, 192], stockCrankLength: 175 },
    ]
  },
  {
    id: 'canyon-ultimate-cfr',
    brand: 'Canyon',
    model: 'Ultimate CF SLX',
    year: 2024,
    category: 'All-Round',
    sizes: [
      { sizeName: 'XS', stack: 512, reach: 378, topTubeLength: 528, seatTubeAngle: 73.5, headTubeAngle: 71.8, wheelbase: 976, recommendedHeight: [162, 170], stockCrankLength: 170 },
      { sizeName: 'S', stack: 542, reach: 388, topTubeLength: 543, seatTubeAngle: 73.5, headTubeAngle: 72.8, wheelbase: 988, recommendedHeight: [170, 178], stockCrankLength: 170 },
      { sizeName: 'M', stack: 567, reach: 398, topTubeLength: 562, seatTubeAngle: 73.5, headTubeAngle: 73.3, wheelbase: 998, recommendedHeight: [178, 184], stockCrankLength: 172.5 },
      { sizeName: 'L', stack: 588, reach: 408, topTubeLength: 580, seatTubeAngle: 73.5, headTubeAngle: 73.5, wheelbase: 1012, recommendedHeight: [184, 192], stockCrankLength: 175 },
    ]
  },
  {
    id: 'pinarello-dogma-f',
    brand: 'Pinarello',
    model: 'Dogma F',
    year: 2024,
    category: 'All-Round',
    sizes: [
      { sizeName: '500', stack: 522, reach: 379, topTubeLength: 525, seatTubeAngle: 74.0, headTubeAngle: 71.4, wheelbase: 975, recommendedHeight: [164, 171], stockCrankLength: 170 },
      { sizeName: '515', stack: 531, reach: 384, topTubeLength: 535, seatTubeAngle: 73.7, headTubeAngle: 72.0, wheelbase: 981, recommendedHeight: [170, 176], stockCrankLength: 172.5 },
      { sizeName: '530', stack: 543, reach: 386, topTubeLength: 545, seatTubeAngle: 73.5, headTubeAngle: 72.5, wheelbase: 985, recommendedHeight: [174, 180], stockCrankLength: 172.5 },
      { sizeName: '540', stack: 550, reach: 390, topTubeLength: 550, seatTubeAngle: 73.2, headTubeAngle: 72.8, wheelbase: 990, recommendedHeight: [177, 183], stockCrankLength: 172.5 },
      { sizeName: '560', stack: 570, reach: 398, topTubeLength: 565, seatTubeAngle: 73.0, headTubeAngle: 73.2, wheelbase: 998, recommendedHeight: [182, 188], stockCrankLength: 175 },
    ]
  },
  {
    id: 'cervelo-s5',
    brand: 'Cervélo',
    model: 'S5 Disc',
    year: 2024,
    category: 'Aero',
    sizes: [
      { sizeName: '48', stack: 497, reach: 367, topTubeLength: 516, seatTubeAngle: 73.0, headTubeAngle: 71.0, wheelbase: 970, recommendedHeight: [155, 165], stockCrankLength: 165 },
      { sizeName: '51', stack: 519, reach: 376, topTubeLength: 532, seatTubeAngle: 73.0, headTubeAngle: 72.5, wheelbase: 975, recommendedHeight: [165, 172], stockCrankLength: 170 },
      { sizeName: '54', stack: 542, reach: 384, topTubeLength: 550, seatTubeAngle: 73.0, headTubeAngle: 73.0, wheelbase: 985, recommendedHeight: [172, 180], stockCrankLength: 172.5 },
      { sizeName: '56', stack: 565, reach: 392, topTubeLength: 565, seatTubeAngle: 73.0, headTubeAngle: 73.5, wheelbase: 999, recommendedHeight: [178, 186], stockCrankLength: 172.5 },
    ]
  }
];
