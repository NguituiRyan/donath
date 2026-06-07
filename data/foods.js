/* ===== Camila Nutrition — food database =====
 * A large, MyFitnessPal-style database focused on foods eaten across Kenya
 * and East Africa, plus common general foods.
 *
 * Each food stores a list of SERVING UNITS (e.g. "serving spoon", "1 cup",
 * "portion", "100 g"). The first unit is the natural default. Nutrition is
 * authored once per 100 g and scaled to every unit, so values stay consistent.
 *
 * base = [kcal, protein g, carbs g, fat g, fibre g?, sugar g?, sodium mg?]  per 100 g
 * unit = [label, grams]   (for liquids, grams ≈ millilitres)
 * cat  = food group key (see FOOD_GROUPS). local = East-African / Kenyan staple.
 */
(function () {
  'use strict';

  window.FOOD_GROUPS = [
    { key: 'staple',  en: 'Staples & Grains',     sw: 'Vyakula vikuu' },
    { key: 'protein', en: 'Meat, Fish & Eggs',    sw: 'Nyama, Samaki & Mayai' },
    { key: 'legume',  en: 'Beans & Pulses',       sw: 'Maharagwe & Kunde' },
    { key: 'veg',     en: 'Vegetables',           sw: 'Mboga' },
    { key: 'fruit',   en: 'Fruits',               sw: 'Matunda' },
    { key: 'dairy',   en: 'Dairy',                sw: 'Maziwa' },
    { key: 'snack',   en: 'Snacks & Street food', sw: 'Vitafunio & Mtaani' },
    { key: 'drink',   en: 'Drinks',               sw: 'Vinywaji' },
    { key: 'fat',     en: 'Fats, Nuts & Spreads', sw: 'Mafuta, Karanga & Spredi' }
  ];

  function r1(n) { return Math.round(n * 10) / 10; }
  function expand(base, units) {
    var k = base[0], p = base[1], c = base[2], f = base[3];
    var fb = base[4] || 0, sg = base[5] || 0, na = base[6] || 0;
    return units.map(function (u) {
      var ratio = u[1] / 100;
      return {
        label: u[0], g: u[1],
        kcal: Math.round(k * ratio),
        p: r1(p * ratio), c: r1(c * ratio), f: r1(f * ratio),
        fb: r1(fb * ratio), sg: r1(sg * ratio), na: Math.round(na * ratio)
      };
    });
  }

  var DB = [];
  function f(name, cat, local, base, units) {
    DB.push({ name: name, cat: cat, local: !!local, units: expand(base, units) });
  }

  /* =====================================================================
     STAPLES & GRAINS
     ===================================================================== */
  f('Ugali (white maize)', 'staple', 1, [112, 2.4, 25, 0.5], [['Serving / slice (150 g)', 150], ['Large serving (250 g)', 250], ['Small piece (90 g)', 90], ['100 g', 100]]);
  f('Ugali (brown / whole maize)', 'staple', 1, [116, 3, 24, 1], [['Serving / slice (150 g)', 150], ['Large serving (250 g)', 250], ['100 g', 100]]);
  f('Ugali wa wimbi (millet)', 'staple', 1, [119, 3.2, 24, 1], [['Serving / slice (150 g)', 150], ['Large serving (250 g)', 250], ['100 g', 100]]);
  f('Chapati (soft)', 'staple', 1, [330, 8, 46, 13], [['1 piece (70 g)', 70], ['½ piece (35 g)', 35], ['Large (90 g)', 90]]);
  f('Chapati (layered / laccha)', 'staple', 1, [350, 8, 45, 16], [['1 piece (75 g)', 75], ['½ piece (38 g)', 38]]);
  f('Mandazi', 'staple', 1, [340, 6, 45, 15], [['1 piece (60 g)', 60], ['Small (40 g)', 40]]);
  f('Mahamri (coastal)', 'staple', 1, [330, 6, 50, 12], [['2 pieces (90 g)', 90], ['1 piece (45 g)', 45]]);
  f('White rice (wali, cooked)', 'staple', 1, [130, 2.7, 28, 0.3], [['1 cup (160 g)', 160], ['Serving spoon (80 g)', 80], ['Full plate (250 g)', 250], ['100 g', 100]]);
  f('Pilau (beef)', 'staple', 1, [180, 7, 23, 7], [['1 cup (200 g)', 200], ['Full plate (300 g)', 300], ['Serving spoon (90 g)', 90]]);
  f('Biryani (beef / chicken)', 'staple', 1, [190, 8, 22, 8], [['Full plate (300 g)', 300], ['1 cup (200 g)', 200]]);
  f('Coconut rice (wali wa nazi)', 'staple', 1, [168, 3, 28, 5], [['1 cup (160 g)', 160], ['Full plate (250 g)', 250]]);
  f('Brown rice (cooked)', 'staple', 0, [112, 2.6, 23, 0.9], [['1 cup (195 g)', 195], ['Serving spoon (95 g)', 95], ['100 g', 100]]);
  f('Fried rice', 'staple', 0, [165, 4, 27, 5], [['1 cup (180 g)', 180], ['Full plate (280 g)', 280]]);
  f('Spaghetti / pasta (cooked)', 'staple', 0, [158, 6, 31, 0.9], [['1 cup (140 g)', 140], ['Full plate (250 g)', 250]]);
  f('Macaroni (cooked)', 'staple', 0, [158, 5.8, 31, 0.9], [['1 cup (140 g)', 140], ['Full plate (250 g)', 250]]);
  f('Mukimo (mashed potato, maize & greens)', 'staple', 1, [130, 4, 22, 3], [['1 cup (200 g)', 200], ['Serving (250 g)', 250]]);
  f('Irio (githeri mash)', 'staple', 1, [135, 6, 23, 2], [['1 cup (200 g)', 200], ['Serving (250 g)', 250]]);
  f('Githeri (maize & beans)', 'staple', 1, [140, 7, 25, 1.5, 6], [['1 cup (200 g)', 200], ['Full plate (300 g)', 300], ['Serving spoon (90 g)', 90]]);
  f('Boiled maize (mahindi)', 'staple', 1, [110, 3.4, 21, 1.5, 2.4], [['1 cob (120 g)', 120], ['1 cup kernels (150 g)', 150]]);
  f('Roast maize (mahindi choma)', 'staple', 1, [120, 3.5, 24, 1.8], [['1 cob (150 g)', 150], ['Small cob (100 g)', 100]]);
  f('White bread', 'staple', 0, [265, 9, 49, 3.2, 2.7, 5, 490], [['1 slice (30 g)', 30], ['2 slices (60 g)', 60]]);
  f('Brown / whole-wheat bread', 'staple', 0, [250, 12, 43, 3.5, 6, 4, 450], [['1 slice (30 g)', 30], ['2 slices (60 g)', 60]]);
  f('Scone', 'staple', 0, [360, 7, 50, 15], [['1 piece (60 g)', 60]]);
  f('Sweet potato (boiled, viazi vitamu)', 'staple', 1, [86, 1.6, 20, 0.1, 3, 6], [['1 medium (130 g)', 130], ['1 small (80 g)', 80], ['1 large (180 g)', 180], ['1 cup mashed (200 g)', 200], ['100 g', 100]]);
  f('Sweet potato (roasted)', 'staple', 1, [90, 2, 21, 0.1, 3.3, 6.5], [['1 medium (130 g)', 130], ['1 small (80 g)', 80], ['1 large (180 g)', 180]]);
  f('Arrowroot (nduma, boiled)', 'staple', 1, [118, 1.5, 28, 0.2, 1.5], [['1 cup (135 g)', 135], ['1 piece (80 g)', 80]]);
  f('Cassava (boiled, mhogo)', 'staple', 1, [160, 1.4, 38, 0.3, 1.8], [['1 piece (100 g)', 100], ['1 cup (150 g)', 150]]);
  f('Cassava (fried, mhogo)', 'staple', 1, [280, 2, 38, 14], [['1 serving (150 g)', 150], ['Small (90 g)', 90]]);
  f('Irish potato (boiled)', 'staple', 0, [87, 1.9, 20, 0.1, 1.8], [['1 medium (150 g)', 150], ['1 small (80 g)', 80], ['1 cup (160 g)', 160]]);
  f('Mashed potato', 'staple', 0, [110, 2, 17, 4], [['1 cup (210 g)', 210], ['Serving spoon (100 g)', 100]]);
  f('Matoke (cooked green banana)', 'staple', 1, [116, 1.1, 29, 0.2, 2.3], [['1 cup (150 g)', 150], ['Serving (200 g)', 200]]);
  f('Yam (boiled, kiazi kikuu)', 'staple', 1, [116, 1.5, 28, 0.1, 4], [['1 cup (135 g)', 135], ['1 piece (100 g)', 100]]);
  f('Millet porridge (uji wa wimbi)', 'staple', 1, [60, 1.5, 12, 0.5], [['1 mug (300 g)', 300], ['1 cup (250 g)', 250]]);
  f('Maize porridge (uji)', 'staple', 1, [55, 1.2, 12, 0.4], [['1 mug (300 g)', 300], ['1 cup (250 g)', 250]]);
  f('Oats / oatmeal (cooked)', 'staple', 0, [65, 2.4, 12, 1.4, 1.7], [['1 cup (230 g)', 230], ['½ cup (115 g)', 115]]);
  f('Weetabix', 'staple', 0, [360, 12, 69, 2, 10], [['2 biscuits (38 g)', 38], ['1 biscuit (19 g)', 19]]);
  f('Cornflakes', 'staple', 0, [378, 7, 84, 0.9], [['1 cup (30 g)', 30], ['1 bowl (45 g)', 45]]);
  f('Pancake', 'staple', 0, [227, 6, 28, 10], [['1 pancake (40 g)', 40], ['2 pancakes (80 g)', 80]]);
  f('Quinoa (cooked)', 'staple', 0, [120, 4.4, 21, 1.9, 2.8], [['1 cup (185 g)', 185]]);

  /* =====================================================================
     MEAT, FISH & EGGS
     ===================================================================== */
  f('Beef (lean, cooked)', 'protein', 1, [217, 26, 0, 12, 0, 0, 60], [['Serving spoon (45 g)', 45], ['Small portion (60 g)', 60], ['1 cup diced (140 g)', 140], ['100 g', 100]]);
  f('Beef stew (with gravy)', 'protein', 1, [160, 14, 5, 9, 0, 1, 380], [['Serving spoon (60 g)', 60], ['1 cup (200 g)', 200], ['Full plate (250 g)', 250]]);
  f('Nyama choma (grilled beef)', 'protein', 1, [250, 26, 0, 16, 0, 0, 70], [['100 g', 100], ['Quarter kilo (250 g)', 250], ['1 piece (80 g)', 80]]);
  f('Minced beef (keema, cooked)', 'protein', 1, [215, 26, 0, 12], [['Serving spoon (50 g)', 50], ['1 cup (140 g)', 140], ['100 g', 100]]);
  f('Beef liver (maini, fried)', 'protein', 1, [175, 27, 4, 5], [['1 piece (60 g)', 60], ['Serving (100 g)', 100]]);
  f('Matumbo (tripe, cooked)', 'protein', 1, [130, 12, 2, 8], [['Serving (100 g)', 100], ['1 cup (150 g)', 150]]);
  f('Goat meat (mbuzi, cooked)', 'protein', 1, [234, 27, 0, 14, 0, 0, 75], [['Serving spoon (50 g)', 50], ['1 piece (80 g)', 80], ['100 g', 100]]);
  f('Goat stew', 'protein', 1, [165, 15, 4, 10, 0, 1, 360], [['Serving spoon (60 g)', 60], ['1 cup (200 g)', 200]]);
  f('Mutton / lamb (cooked)', 'protein', 1, [260, 25, 0, 18], [['1 piece (80 g)', 80], ['100 g', 100]]);
  f('Chicken (skinless, boiled / grilled)', 'protein', 1, [165, 31, 0, 3.6, 0, 0, 70], [['1 piece / breast (120 g)', 120], ['1 drumstick (70 g)', 70], ['100 g', 100]]);
  f('Chicken (fried, with skin)', 'protein', 1, [250, 27, 3, 14], [['1 piece (100 g)', 100], ['1 drumstick (80 g)', 80]]);
  f('Kuku kienyeji stew (free-range chicken)', 'protein', 1, [170, 20, 3, 9], [['1 piece (100 g)', 100], ['Serving (150 g)', 150]]);
  f('Chicken wing (fried)', 'protein', 1, [250, 27, 0, 15], [['1 wing (35 g)', 35], ['3 wings (105 g)', 105]]);
  f('Tilapia (fried, whole)', 'protein', 1, [200, 22, 5, 10, 0, 0, 90], [['1 medium fish (200 g)', 200], ['1 piece (120 g)', 120]]);
  f('Tilapia (wet fry / grilled)', 'protein', 1, [130, 26, 0, 3], [['1 medium fish (250 g)', 250], ['1 piece (120 g)', 120]]);
  f('Nile perch fillet (mbuta)', 'protein', 1, [105, 21, 0, 2], [['1 fillet (150 g)', 150], ['100 g', 100]]);
  f('Omena / dagaa (dried small fish)', 'protein', 1, [290, 45, 2, 12], [['1 handful (30 g)', 30], ['1 cup (60 g)', 60]]);
  f('Tuna (canned, in water)', 'protein', 0, [116, 26, 0, 1], [['1 can (95 g)', 95], ['½ can (48 g)', 48]]);
  f('Sardines (canned)', 'protein', 0, [208, 25, 0, 11], [['1 tin (120 g)', 120], ['½ tin (60 g)', 60]]);
  f('Prawns / shrimp (cooked)', 'protein', 0, [99, 24, 0, 0.3], [['1 serving (85 g)', 85]]);
  f('Egg (boiled)', 'protein', 0, [155, 13, 1.1, 11, 0, 0, 124], [['1 large (50 g)', 50], ['2 large (100 g)', 100]]);
  f('Egg (fried)', 'protein', 0, [196, 14, 1, 15], [['1 large (50 g)', 50], ['2 large (100 g)', 100]]);
  f('Scrambled eggs', 'protein', 0, [165, 11, 1.6, 12], [['2 eggs (120 g)', 120], ['1 egg (60 g)', 60]]);
  f('Pork (cooked)', 'protein', 0, [242, 27, 0, 14], [['Serving spoon (50 g)', 50], ['1 piece (80 g)', 80], ['100 g', 100]]);
  f('Bacon (fried)', 'protein', 0, [540, 37, 1.4, 42], [['1 rasher (12 g)', 12], ['3 rashers (36 g)', 36]]);
  f('Sausage (beef, fried)', 'protein', 1, [300, 12, 3, 27], [['1 piece (45 g)', 45], ['2 pieces (90 g)', 90]]);
  f('Smokie', 'protein', 1, [290, 11, 3, 26], [['1 piece (45 g)', 45]]);
  f('Beef samosa', 'protein', 1, [300, 9, 28, 16], [['1 piece (50 g)', 50], ['2 pieces (100 g)', 100]]);
  f('Mutura (blood sausage)', 'protein', 1, [275, 17, 2, 22], [['1 piece (60 g)', 60]]);
  f('Mshikaki (beef skewer)', 'protein', 1, [220, 24, 2, 13], [['1 stick (50 g)', 50], ['2 sticks (100 g)', 100]]);
  f('Camel meat (nyama ya ngamia)', 'protein', 1, [160, 21, 0, 8], [['100 g', 100], ['1 piece (80 g)', 80]]);
  f('Tofu', 'protein', 0, [144, 15, 3, 9], [['1 block (120 g)', 120], ['100 g', 100]]);
  f('Soya chunks (cooked)', 'protein', 0, [140, 18, 9, 2, 4], [['1 cup (100 g)', 100]]);

  /* =====================================================================
     BEANS & PULSES
     ===================================================================== */
  f('Maharagwe (beans, plain, cooked)', 'legume', 1, [127, 8.7, 23, 0.5, 7, 0.3], [['1 cup (180 g)', 180], ['Serving spoon (60 g)', 60], ['Full plate (250 g)', 250]]);
  f('Beans in coconut / stew (maharagwe ya nazi)', 'legume', 1, [135, 7, 20, 3, 6], [['1 cup (180 g)', 180], ['Serving spoon (60 g)', 60]]);
  f('Njahi (black beans, cooked)', 'legume', 1, [132, 9, 22, 0.6, 7], [['1 cup (180 g)', 180], ['Serving spoon (60 g)', 60]]);
  f('Ndengu (green grams, cooked)', 'legume', 1, [105, 7, 19, 0.4, 7], [['1 cup (180 g)', 180], ['Serving spoon (60 g)', 60]]);
  f('Kunde (cowpeas, cooked)', 'legume', 1, [116, 8, 21, 0.5, 6], [['1 cup (170 g)', 170], ['Serving spoon (60 g)', 60]]);
  f('Mbaazi (pigeon peas, cooked)', 'legume', 1, [121, 7, 23, 0.4, 6], [['1 cup (170 g)', 170]]);
  f('Lentils (dengu, cooked)', 'legume', 0, [116, 9, 20, 0.4, 8], [['1 cup (200 g)', 200], ['Serving spoon (65 g)', 65]]);
  f('Chickpeas (cooked)', 'legume', 0, [164, 9, 27, 2.6, 8], [['1 cup (164 g)', 164]]);
  f('Green peas (cooked)', 'legume', 0, [84, 5.4, 16, 0.4, 5.5], [['1 cup (160 g)', 160], ['Serving spoon (60 g)', 60]]);
  f('Groundnut stew (njugu sauce)', 'legume', 1, [180, 8, 10, 12], [['Serving (100 g)', 100], ['1 cup (150 g)', 150]]);

  /* =====================================================================
     VEGETABLES
     ===================================================================== */
  f('Sukuma wiki (collard greens, cooked)', 'veg', 1, [46, 3, 7, 1.5, 3, 1, 30], [['Portion (100 g)', 100], ['1 cup (130 g)', 130], ['Serving spoon (70 g)', 70]]);
  f('Cabbage (cooked)', 'veg', 1, [23, 1.3, 5.5, 0.1, 2, 3, 8], [['Portion (90 g)', 90], ['1 cup (150 g)', 150], ['Serving spoon (70 g)', 70], ['100 g', 100]]);
  f('Cabbage (raw, shredded)', 'veg', 1, [25, 1.3, 6, 0.1, 2.5, 3.2], [['1 cup (90 g)', 90], ['Portion (70 g)', 70]]);
  f('Spinach (cooked)', 'veg', 1, [23, 3, 3.8, 0.4, 2.4], [['1 cup (180 g)', 180], ['Portion (90 g)', 90]]);
  f('Managu (African nightshade, cooked)', 'veg', 1, [45, 4, 6, 1, 3], [['Portion (100 g)', 100], ['1 cup (130 g)', 130]]);
  f('Terere / mchicha (amaranth greens)', 'veg', 1, [45, 4, 6, 1, 3], [['Portion (100 g)', 100], ['1 cup (130 g)', 130]]);
  f('Saga (spider plant, cooked)', 'veg', 1, [50, 5, 5, 1.5, 3], [['Portion (100 g)', 100], ['1 cup (130 g)', 130]]);
  f('Mrenda (jute mallow, cooked)', 'veg', 1, [40, 3, 5, 0.8, 2.8], [['Portion (100 g)', 100], ['1 cup (130 g)', 130]]);
  f('Pumpkin leaves (seveve, cooked)', 'veg', 1, [40, 4, 5, 1, 3], [['Portion (100 g)', 100], ['1 cup (130 g)', 130]]);
  f('Broccoli (steamed / cooked)', 'veg', 0, [35, 2.4, 7, 0.4, 3.3, 1.5, 41], [['1 floret (15 g)', 15], ['Portion (80 g)', 80], ['1 cup (90 g)', 90], ['100 g', 100]]);
  f('Broccoli (raw)', 'veg', 0, [34, 2.8, 7, 0.4, 2.6, 1.7], [['1 floret (11 g)', 11], ['1 cup (90 g)', 90]]);
  f('Cauliflower (cooked)', 'veg', 0, [23, 1.8, 4, 0.5, 2.3], [['1 floret (13 g)', 13], ['1 cup (100 g)', 100]]);
  f('Carrot (raw)', 'veg', 0, [41, 0.9, 10, 0.2, 2.8, 4.7], [['1 medium (60 g)', 60], ['1 cup (120 g)', 120]]);
  f('Carrot (cooked)', 'veg', 0, [35, 0.8, 8, 0.2, 3], [['1 cup (150 g)', 150], ['Portion (90 g)', 90]]);
  f('Tomato (raw)', 'veg', 0, [18, 0.9, 3.9, 0.2, 1.2, 2.6], [['1 medium (120 g)', 120], ['1 slice (20 g)', 20]]);
  f('Onion (raw)', 'veg', 0, [40, 1.1, 9, 0.1, 1.7, 4.2], [['1 medium (110 g)', 110], ['1 tablespoon (10 g)', 10]]);
  f('Kachumbari (tomato-onion salad)', 'veg', 1, [38, 1, 8, 0.3, 1.4], [['1 cup (120 g)', 120], ['Serving (80 g)', 80]]);
  f('Green pepper / capsicum (hoho)', 'veg', 0, [20, 0.9, 4.6, 0.2, 1.7], [['1 medium (120 g)', 120], ['½ cup sliced (45 g)', 45]]);
  f('Cucumber', 'veg', 0, [15, 0.7, 3.6, 0.1, 0.5], [['1 cup (120 g)', 120], ['1 slice (7 g)', 7]]);
  f('Eggplant / brinjal (biringanya, cooked)', 'veg', 0, [35, 0.8, 8, 0.2, 2.5], [['1 cup (99 g)', 99]]);
  f('Okra (bamia, cooked)', 'veg', 1, [40, 1.9, 7, 0.3, 3.2], [['1 cup (80 g)', 80], ['Portion (60 g)', 60]]);
  f('Pumpkin (boiled, malenge)', 'veg', 1, [26, 1, 6.5, 0.1, 1.1, 2.8], [['1 cup (245 g)', 245], ['Portion (120 g)', 120]]);
  f('Butternut (cooked)', 'veg', 0, [40, 0.9, 10, 0.1, 3.2], [['1 cup (205 g)', 205], ['Portion (120 g)', 120]]);
  f('French beans (mishiri, cooked)', 'veg', 1, [35, 1.9, 8, 0.1, 3.4], [['1 cup (125 g)', 125], ['Portion (90 g)', 90]]);
  f('Avocado (parachichi)', 'veg', 1, [160, 2, 9, 15, 7, 0.7], [['½ medium (70 g)', 70], ['1 whole (140 g)', 140], ['1 slice (30 g)', 30]]);
  f('Mushrooms (cooked)', 'veg', 0, [28, 2.2, 5, 0.5, 2.2], [['1 cup (150 g)', 150]]);
  f('Lettuce', 'veg', 0, [15, 1.4, 2.9, 0.2, 1.3], [['1 cup (36 g)', 36], ['Portion (50 g)', 50]]);
  f('Beetroot (cooked)', 'veg', 0, [44, 1.7, 10, 0.2, 2, 8], [['1 cup (170 g)', 170], ['Portion (90 g)', 90]]);
  f('Coleslaw (with mayo)', 'veg', 0, [150, 1, 12, 11], [['1 cup (120 g)', 120], ['Serving (80 g)', 80]]);

  /* =====================================================================
     FRUITS
     ===================================================================== */
  f('Banana (ndizi)', 'fruit', 1, [89, 1.1, 23, 0.3, 2.6, 12], [['1 medium (120 g)', 120], ['1 small (90 g)', 90], ['1 large (150 g)', 150]]);
  f('Mango (embe)', 'fruit', 1, [60, 0.8, 15, 0.4, 1.6, 14], [['1 cup sliced (165 g)', 165], ['1 whole (200 g)', 200], ['1 slice (30 g)', 30]]);
  f('Pawpaw / papaya (papai)', 'fruit', 1, [43, 0.5, 11, 0.3, 1.7, 8], [['1 cup (145 g)', 145], ['1 slice (100 g)', 100]]);
  f('Pineapple (nanasi)', 'fruit', 1, [50, 0.5, 13, 0.1, 1.4, 10], [['1 slice (80 g)', 80], ['1 cup (165 g)', 165]]);
  f('Orange (chungwa)', 'fruit', 1, [47, 0.9, 12, 0.1, 2.4, 9], [['1 medium (130 g)', 130], ['1 large (180 g)', 180]]);
  f('Tangerine (mandarin)', 'fruit', 1, [53, 0.8, 13, 0.3, 1.8, 11], [['1 medium (88 g)', 88]]);
  f('Passion fruit (pasheni)', 'fruit', 1, [97, 2.2, 23, 0.7, 10, 11], [['1 fruit (18 g)', 18], ['1 cup pulp (236 g)', 236]]);
  f('Tree tomato (tamarillo)', 'fruit', 1, [31, 2, 7, 0.4, 3.3], [['1 fruit (60 g)', 60]]);
  f('Guava (mapera)', 'fruit', 1, [68, 2.6, 14, 1, 5, 9], [['1 fruit (55 g)', 55], ['1 cup (165 g)', 165]]);
  f('Watermelon (tikiti maji)', 'fruit', 1, [30, 0.6, 8, 0.2, 0.4, 6], [['1 cup (150 g)', 150], ['1 slice (280 g)', 280]]);
  f('Apple (tofaa)', 'fruit', 0, [52, 0.3, 14, 0.2, 2.4, 10], [['1 medium (180 g)', 180], ['1 small (150 g)', 150]]);
  f('Pear', 'fruit', 0, [57, 0.4, 15, 0.1, 3.1, 10], [['1 medium (178 g)', 178]]);
  f('Grapes (zabibu)', 'fruit', 0, [69, 0.7, 18, 0.2, 0.9, 16], [['1 cup (92 g)', 92], ['10 grapes (50 g)', 50]]);
  f('Pomegranate (komamanga)', 'fruit', 0, [83, 1.7, 19, 1.2, 4], [['1 cup arils (174 g)', 174], ['½ fruit (140 g)', 140]]);
  f('Custard apple (matomoko)', 'fruit', 1, [94, 2, 24, 0.3, 4.4], [['½ fruit (100 g)', 100]]);
  f('Jackfruit (fenesi)', 'fruit', 1, [95, 1.7, 23, 0.6, 1.5], [['1 cup (165 g)', 165]]);
  f('Coconut flesh (nazi)', 'fruit', 1, [354, 3.3, 15, 33, 9], [['1 piece (45 g)', 45]]);
  f('Dates (tende)', 'fruit', 1, [277, 1.8, 75, 0.2, 7, 66], [['1 date (7 g)', 7], ['1 handful (40 g)', 40]]);
  f('Sugarcane (miwa)', 'fruit', 1, [65, 0, 16, 0, 0, 16], [['1 piece (100 g)', 100]]);
  f('Roasted ripe banana', 'fruit', 1, [120, 1.3, 32, 0.3], [['1 piece (120 g)', 120]]);
  f('Lemon (limau)', 'fruit', 0, [29, 1.1, 9, 0.3], [['1 fruit (60 g)', 60]]);
  f('Raisins (zabibu kavu)', 'fruit', 0, [299, 3, 79, 0.5, 3.7, 59], [['1 small box (43 g)', 43], ['1 handful (30 g)', 30]]);

  /* =====================================================================
     DAIRY
     ===================================================================== */
  f('Milk (whole)', 'dairy', 0, [61, 3.2, 4.8, 3.3, 0, 5], [['1 cup (250 ml)', 250], ['1 glass (200 ml)', 200], ['1 mug (300 ml)', 300]]);
  f('Milk (low-fat)', 'dairy', 0, [50, 3.3, 4.8, 2, 0, 5], [['1 cup (250 ml)', 250], ['1 glass (200 ml)', 200]]);
  f('Milk (skim / fat-free)', 'dairy', 0, [34, 3.4, 5, 0.1, 0, 5], [['1 cup (250 ml)', 250]]);
  f('Mala / fermented milk (lala)', 'dairy', 1, [60, 3.5, 5, 3], [['1 cup (250 ml)', 250], ['½ litre (500 ml)', 500]]);
  f('Mursik (fermented milk)', 'dairy', 1, [66, 3.5, 4, 4], [['1 cup (250 ml)', 250]]);
  f('Yoghurt (plain)', 'dairy', 0, [61, 3.5, 4.7, 3.3, 0, 4.7], [['1 cup (245 g)', 245], ['1 pot (150 g)', 150]]);
  f('Yoghurt (flavoured / sweet)', 'dairy', 0, [95, 3.5, 15, 2.5, 0, 14], [['1 cup (245 g)', 245], ['1 pot (150 g)', 150]]);
  f('Greek yoghurt', 'dairy', 0, [97, 9, 3.6, 5], [['1 cup (200 g)', 200], ['½ cup (100 g)', 100]]);
  f('Cheese (cheddar)', 'dairy', 0, [402, 25, 1.3, 33, 0, 0, 621], [['1 slice (30 g)', 30], ['100 g', 100]]);
  f('Processed cheese slice', 'dairy', 0, [290, 16, 8, 22, 0, 0, 1300], [['1 slice (20 g)', 20]]);
  f('Cottage cheese', 'dairy', 0, [98, 11, 3.4, 4.3], [['1 cup (226 g)', 226], ['½ cup (113 g)', 113]]);
  f('Ice cream (vanilla)', 'dairy', 0, [207, 3.5, 24, 11, 0, 21], [['1 scoop (65 g)', 65], ['1 cup (132 g)', 132]]);
  f('Ghee (samli)', 'dairy', 1, [900, 0, 0, 100], [['1 tablespoon (14 g)', 14], ['1 teaspoon (5 g)', 5]]);
  f('Powdered milk', 'dairy', 0, [496, 26, 38, 27], [['1 tablespoon (15 g)', 15], ['2 tablespoons (30 g)', 30]]);

  /* =====================================================================
     SNACKS & STREET FOOD
     ===================================================================== */
  f('Chips / fries', 'snack', 1, [312, 3.4, 41, 15, 3.8, 0, 210], [['Small (130 g)', 130], ['Medium plate (180 g)', 180], ['Large (250 g)', 250]]);
  f('Chips masala', 'snack', 1, [320, 4, 40, 16], [['1 plate (200 g)', 200]]);
  f('Chips mayai (chips omelette)', 'snack', 1, [200, 7, 22, 10], [['1 plate (280 g)', 280]]);
  f('Crisps / potato chips (packet)', 'snack', 0, [536, 7, 53, 35, 4.4, 0, 525], [['1 small bag (50 g)', 50], ['1 big bag (150 g)', 150]]);
  f('Smocha (smokie + chapati)', 'snack', 1, [280, 8, 25, 16], [['1 wrap (150 g)', 150]]);
  f('Rolex (chapati + egg roll)', 'snack', 1, [215, 7, 20, 12], [['1 roll (200 g)', 200]]);
  f('Shawarma (chicken)', 'snack', 1, [215, 11, 20, 10], [['1 wrap (220 g)', 220], ['½ wrap (110 g)', 110]]);
  f('Beef burger', 'snack', 0, [250, 12, 20, 14], [['1 burger (215 g)', 215]]);
  f('Cheeseburger', 'snack', 0, [270, 13, 20, 16], [['1 burger (230 g)', 230]]);
  f('Pizza (cheese)', 'snack', 0, [266, 11, 33, 10], [['1 slice (107 g)', 107], ['Personal (250 g)', 250]]);
  f('Pizza (meat)', 'snack', 0, [290, 12, 30, 14], [['1 slice (120 g)', 120], ['Personal (280 g)', 280]]);
  f('Hot dog (in bun)', 'snack', 0, [247, 10, 18, 15], [['1 hot dog (100 g)', 100]]);
  f('Vegetable samosa', 'snack', 1, [280, 5, 32, 15], [['1 piece (50 g)', 50], ['2 pieces (100 g)', 100]]);
  f('Bhajia (potato, fried)', 'snack', 1, [230, 4, 26, 12], [['1 serving (120 g)', 120], ['6 pieces (100 g)', 100]]);
  f('Viazi karai (fried potato balls)', 'snack', 1, [250, 4, 30, 13], [['4 pieces (100 g)', 100]]);
  f('Kebab', 'snack', 1, [215, 15, 8, 14], [['1 piece (60 g)', 60]]);
  f('Spring roll', 'snack', 0, [250, 6, 30, 12], [['1 piece (40 g)', 40]]);
  f('Doughnut / donut', 'snack', 0, [410, 5, 50, 22], [['1 donut (60 g)', 60]]);
  f('Cake (sponge)', 'snack', 0, [350, 5, 55, 12], [['1 slice (80 g)', 80]]);
  f('Mkate wa sinia', 'snack', 1, [280, 5, 45, 9], [['1 slice (80 g)', 80]]);
  f('Kaimati (sweet dumplings)', 'snack', 1, [380, 5, 55, 16], [['5 pieces (60 g)', 60]]);
  f('Queen cake', 'snack', 1, [380, 6, 52, 17], [['1 cake (40 g)', 40]]);
  f('Biscuits (digestive / Nice)', 'snack', 0, [480, 7, 66, 21, 0, 25], [['1 biscuit (15 g)', 15], ['4 biscuits (60 g)', 60]]);
  f('Chocolate bar', 'snack', 0, [535, 7, 59, 30, 0, 52], [['1 bar (45 g)', 45], ['Fun size (20 g)', 20]]);
  f('Sweets / candy', 'snack', 0, [390, 0, 98, 0, 0, 70], [['1 piece (5 g)', 5], ['1 handful (30 g)', 30]]);
  f('Popcorn (plain)', 'snack', 0, [387, 12, 78, 5, 15], [['1 bowl (30 g)', 30], ['1 cup (8 g)', 8]]);
  f('Popcorn (buttered)', 'snack', 0, [500, 9, 57, 29], [['1 bowl (30 g)', 30]]);
  f('Indomie (instant noodles, cooked)', 'snack', 1, [450, 9, 62, 18, 0, 0, 800], [['1 pack (70 g dry)', 70]]);
  f('Sausage roll', 'snack', 0, [320, 8, 30, 18], [['1 piece (90 g)', 90]]);
  f('Meat pie', 'snack', 0, [290, 9, 25, 17], [['1 pie (150 g)', 150]]);
  f('Cafeteria plate: ugali + beef stew + greens', 'snack', 1, [140, 8, 16, 5], [['1 plate (450 g)', 450]]);
  f('Cafeteria plate: rice + beans', 'snack', 1, [150, 5, 28, 2], [['1 plate (350 g)', 350]]);
  f('Cafeteria plate: beans + chapati', 'snack', 1, [180, 7, 28, 5], [['1 plate (300 g)', 300]]);

  /* =====================================================================
     DRINKS
     ===================================================================== */
  f('Chai (tea with milk & sugar)', 'drink', 1, [44, 1.2, 7, 1.2, 0, 6], [['1 cup (250 ml)', 250], ['1 mug (300 ml)', 300]]);
  f('Black tea (no sugar)', 'drink', 1, [1, 0, 0.3, 0], [['1 cup (250 ml)', 250]]);
  f('Coffee (black, no sugar)', 'drink', 0, [2, 0.1, 0, 0], [['1 cup (250 ml)', 250]]);
  f('Coffee with milk & sugar', 'drink', 0, [36, 1, 6, 1, 0, 5], [['1 mug (300 ml)', 300], ['1 cup (250 ml)', 250]]);
  f('Milo / hot chocolate', 'drink', 0, [60, 2, 10, 1.5, 0, 9], [['1 mug (250 ml)', 250]]);
  f('Soda (regular, e.g. Coke / Fanta)', 'drink', 0, [42, 0, 11, 0, 0, 11], [['1 can (330 ml)', 330], ['500 ml bottle', 500], ['1 glass (250 ml)', 250]]);
  f('Soda (diet / zero)', 'drink', 0, [0.4, 0, 0, 0], [['1 can (330 ml)', 330]]);
  f('Packaged juice (sweetened)', 'drink', 0, [48, 0.2, 12, 0, 0, 11], [['1 cup (250 ml)', 250], ['1 box (200 ml)', 200]]);
  f('Fresh juice (mango / passion)', 'drink', 1, [54, 0.4, 13, 0.2, 0, 11], [['1 glass (250 ml)', 250]]);
  f('Fruit smoothie', 'drink', 0, [60, 1, 13, 0.5, 0, 10], [['1 cup (250 ml)', 250]]);
  f('Energy drink (e.g. Red Bull / Mo)', 'drink', 0, [45, 0, 11, 0, 0, 11], [['1 can (250 ml)', 250], ['500 ml', 500]]);
  f('Coconut water (madafu)', 'drink', 1, [19, 0.7, 3.7, 0.2, 0, 2.6], [['1 fruit (330 ml)', 330], ['1 glass (250 ml)', 250]]);
  f('Tamarind juice (ukwaju)', 'drink', 1, [55, 0.3, 14, 0, 0, 12], [['1 glass (250 ml)', 250]]);
  f('Dawa (honey, lemon & ginger)', 'drink', 1, [40, 0, 10, 0, 0, 9], [['1 mug (250 ml)', 250]]);
  f('Beer / lager (e.g. Tusker)', 'drink', 1, [43, 0.5, 3.6, 0], [['1 bottle (500 ml)', 500], ['1 can (330 ml)', 330]]);
  f('Stout (e.g. Guinness)', 'drink', 1, [45, 0.3, 4, 0], [['1 bottle (500 ml)', 500]]);
  f('Keg beer (e.g. Senator)', 'drink', 1, [40, 0.4, 3.5, 0], [['1 glass (300 ml)', 300], ['½ litre (500 ml)', 500]]);
  f('Wine (red)', 'drink', 0, [85, 0.1, 2.6, 0], [['1 glass (150 ml)', 150]]);
  f('Wine (white)', 'drink', 0, [82, 0.1, 2.6, 0], [['1 glass (150 ml)', 150]]);
  f('Spirit (whisky / vodka, 40%)', 'drink', 0, [231, 0, 0, 0], [['1 shot / tot (30 ml)', 30], ['Double (60 ml)', 60]]);

  /* =====================================================================
     FATS, NUTS & SPREADS
     ===================================================================== */
  f('Cooking oil (vegetable)', 'fat', 1, [884, 0, 0, 100], [['1 tablespoon (14 g)', 14], ['1 teaspoon (5 g)', 5]]);
  f('Olive oil', 'fat', 0, [884, 0, 0, 100], [['1 tablespoon (14 g)', 14], ['1 teaspoon (5 g)', 5]]);
  f('Coconut oil', 'fat', 1, [862, 0, 0, 100], [['1 tablespoon (14 g)', 14]]);
  f('Butter', 'fat', 0, [717, 0.9, 0.1, 81, 0, 0, 643], [['1 tablespoon (14 g)', 14], ['1 teaspoon (5 g)', 5]]);
  f('Margarine (e.g. Blue Band)', 'fat', 1, [717, 0.2, 0.7, 81, 0, 0, 700], [['Scrape / 1 slice (7 g)', 7], ['1 tablespoon (14 g)', 14]]);
  f('Mayonnaise', 'fat', 0, [680, 1, 0.6, 75], [['1 tablespoon (14 g)', 14]]);
  f('Tomato sauce / ketchup', 'fat', 0, [112, 1.3, 27, 0.1, 0, 22, 900], [['1 tablespoon (17 g)', 17], ['Sachet (10 g)', 10]]);
  f('Chilli sauce', 'fat', 0, [60, 1, 12, 0.5], [['1 tablespoon (15 g)', 15]]);
  f('Peanut / groundnut butter', 'fat', 1, [588, 25, 20, 50, 6], [['1 tablespoon (16 g)', 16], ['1 teaspoon (5 g)', 5]]);
  f('Honey (asali)', 'fat', 1, [304, 0.3, 82, 0, 0, 82], [['1 tablespoon (21 g)', 21], ['1 teaspoon (7 g)', 7]]);
  f('Jam', 'fat', 0, [250, 0.4, 65, 0.1, 0, 49], [['1 tablespoon (20 g)', 20]]);
  f('Sugar (white)', 'fat', 1, [387, 0, 100, 0, 0, 100], [['1 teaspoon (4 g)', 4], ['1 tablespoon (12 g)', 12]]);
  f('Groundnuts / peanuts (roasted, njugu)', 'fat', 1, [567, 26, 16, 49, 8], [['1 handful (30 g)', 30], ['1 cup (146 g)', 146]]);
  f('Cashew nuts (korosho)', 'fat', 1, [553, 18, 30, 44, 3.3], [['1 handful (28 g)', 28]]);
  f('Almonds', 'fat', 0, [579, 21, 22, 50, 12], [['1 handful (28 g)', 28]]);
  f('Simsim / sesame seeds', 'fat', 1, [573, 18, 23, 50, 12], [['1 tablespoon (9 g)', 9]]);
  f('Sunflower seeds', 'fat', 0, [584, 21, 20, 51, 9], [['1 handful (30 g)', 30]]);
  f('Macadamia nuts', 'fat', 1, [718, 8, 14, 76, 9], [['1 handful (28 g)', 28]]);

  window.FOOD_DB = DB;
})();
