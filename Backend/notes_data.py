# notes_data.py
# Interactive notes. The key is the chapter id (same ids as RESOURCE_CHAPTERS in resources_data.py).
# Each note is a list of "blocks". Add, remove or reorder blocks freely.
# **double stars** make text bold. Blocks whose url or youtube_id starts with REPLACE are hidden.

NOTES = {
    "eco-national-income": {
        "title": "National Income and Related Aggregates",
        "summary": "GDP, GNP, NNP and National Income, the three methods of measuring them, and the circular flow of income.",
        "read_minutes": 12,
        "blocks": [
            {"type": "heading", "level": 2, "text": "The big idea"},
            {"type": "text", "text": "**National income** is the total income earned by a country's factors of production (land, labour, capital and enterprise) in one year. It tells us how big the economy is and how fast it is growing."},
            {"type": "callout", "variant": "definition", "title": "National Income", "text": "National Income = **NNP at Factor Cost**."},

            {"type": "audio", "title": "Listen: the chapter in 5 minutes", "caption": "Revise while travelling", "url": "REPLACE_WITH_AUDIO_URL"},

            {"type": "heading", "level": 2, "text": "The family of aggregates"},
            {"type": "table", "caption": "MP = market price, FC = factor cost, NFIA = net factor income from abroad",
             "headers": ["Aggregate", "Formula", "What it tells you"],
             "rows": [
                 ["GDP at MP", "C + I + G + (X − M)", "Output produced inside the country's borders"],
                 ["GNP at MP", "GDP at MP + NFIA", "Output of the country's residents, anywhere in the world"],
                 ["NDP at MP", "GDP at MP − Depreciation", "Output after wear and tear of capital"],
                 ["NNP at MP", "GNP at MP − Depreciation", "Net output of the country's residents"],
                 ["**NNP at FC (National Income)**", "NNP at MP − Net indirect taxes", "Income earned by the factors of production"],
             ]},
            {"type": "formula", "title": "Formulas to remember",
             "lines": [
                 {"label": "GDP at MP", "expr": "C + I + G + (X − M)"},
                 {"label": "GNP at MP", "expr": "GDP at MP + NFIA"},
                 {"label": "Net indirect taxes", "expr": "Indirect taxes − Subsidies"},
                 {"label": "NNP at FC", "expr": "NNP at MP − Net indirect taxes"},
             ]},
            {"type": "callout", "variant": "exam", "title": "Frequently asked",
             "text": "Know the difference between **domestic** (inside the borders) and **national** (by residents). The gap between GDP and GNP is exactly NFIA."},

            {"type": "heading", "level": 2, "text": "Stock and flow"},
            {"type": "compare",
             "left": {"title": "Stock", "points": ["Measured **at a point in time**", "Examples: capital, wealth, money supply", "Like water in a tank"]},
             "right": {"title": "Flow", "points": ["Measured **over a period of time**", "Examples: income, investment, consumption", "Like water flowing through a tap"]}},

            {"type": "heading", "level": 2, "text": "Three ways to measure it"},
            {"type": "timeline", "items": [
                {"label": "Product (value added) method", "text": "Add the **value added** at every stage of production in all sectors. Only the extra value at each stage is counted, so nothing is counted twice."},
                {"label": "Income method", "text": "Add factor incomes: compensation of employees + operating surplus + mixed income of the self-employed. This gives NDP at factor cost. Add NFIA to reach National Income."},
                {"label": "Expenditure method", "text": "Add up spending on final goods: private consumption + government consumption + investment + net exports. This gives GDP at market price."},
            ]},
            {"type": "image", "caption": "Infographic: the three methods at a glance", "url": "REPLACE_WITH_IMAGE_URL"},
            {"type": "callout", "variant": "warning", "title": "What is NOT counted",
             "text": "Sale of second-hand goods (only the commission counts), transfer payments such as pensions and scholarships, windfall gains like lottery prizes, and purely financial deals like buying shares."},

            {"type": "heading", "level": 2, "text": "The circular flow of income"},
            {"type": "slides", "title": "Circular flow in 4 slides", "slides": [
                {"title": "Two sectors, two flows", "bullets": ["Households sell factor services to firms", "Firms pay rent, wages, interest and profit", "Households spend that income on goods and services", "Real flow runs one way, money flow the other"]},
                {"title": "Leakages", "bullets": ["**Savings**, **taxes** and **imports** take money out of the flow", "Less money returns to firms as spending"]},
                {"title": "Injections", "bullets": ["**Investment**, **government spending** and **exports** add money to the flow", "More money reaches firms as spending"]},
                {"title": "Steady flow", "bullets": ["When leakages equal injections the flow stays steady", "If injections are bigger, income rises", "If leakages are bigger, income falls"]},
            ]},

            {"type": "heading", "level": 2, "text": "Go deeper"},
            {"type": "accordion", "items": [
                {"title": "Why must we avoid double counting?", "text": "A good that is used up to make another good (an **intermediate good**) is counted when the final good is sold. Counting both would overstate output. The value added method, or counting final goods only, fixes this."},
                {"title": "Real GDP vs nominal GDP", "text": "**Nominal GDP** uses current-year prices, so it can rise just because prices rose. **Real GDP** uses constant base-year prices, so it shows the true change in output."},
            ]},

            {"type": "heading", "level": 2, "text": "Revise with flashcards"},
            {"type": "flashcards", "cards": [
                {"front": "GDP", "back": "Market value of all final goods and services produced **within the domestic territory** of a country in a year."},
                {"front": "NFIA", "back": "Factor income received from abroad **minus** factor income paid to the rest of the world."},
                {"front": "Depreciation", "back": "Fall in the value of fixed capital from wear and tear and expected obsolescence. Also called **consumption of fixed capital**."},
                {"front": "Value added", "back": "**Value of output − intermediate consumption.**"},
            ]},

            {"type": "heading", "level": 2, "text": "Check yourself"},
            {"type": "quiz", "questions": [
                {"q": "Which of these is included in national income?", "options": ["Old age pension", "Wages and salaries", "Sale of a second-hand car", "A gift from a relative"], "answer": 1, "explain": "Wages are payment for a productive service. The others are transfers or sales of existing goods."},
                {"q": "NNP at market price minus net indirect taxes equals:", "options": ["GDP at market price", "NNP at factor cost", "GNP at factor cost", "NDP at market price"], "answer": 1, "explain": "NNP at factor cost = NNP at MP − net indirect taxes, and that is National Income."},
                {"q": "A stock variable is measured:", "options": ["Over a period of time", "At a point in time", "Only once a year", "Only in money terms"], "answer": 1, "explain": "A stock is a quantity at one moment, such as the capital of a country on 31 March."},
            ]},
        ],           
    },
     "his-harappan": {
        "title": "Bricks, Beads and Bones: The Harappan Civilisation",
        "summary": "How a forgotten civilisation was discovered, what its cities, crafts, trade and beliefs tell us, and why it declined.",
        "read_minutes": 20,
        "blocks": [
            {"type": "heading", "level": 2, "text": "The big picture"},
            {"type": "text", "text": "The **Harappan (Indus Valley) Civilisation** is the earliest urban culture of the Indian subcontinent. It had planned towns, drains, standard bricks and weights, long-distance trade and a script that nobody can read yet. It is called **Harappan** because Harappa was the first site to be discovered."},
            {"type": "callout", "variant": "definition", "title": "Archaeological culture",
             "text": "A group of objects, distinctive in style, usually found together within a specific area and period of time. The Harappan culture is known from finds like these."},
            {"type": "table", "caption": "Dates are approximate. Learn the Mature phase first.",
             "headers": ["Phase", "Approximate dates", "What was happening"],
             "rows": [
                 ["Early Harappan", "Before c. 2600 BCE", "Villages and early towns; farming and herding spread"],
                 ["**Mature Harappan**", "c. 2600 – 1900 BCE", "Planned cities, standard bricks and weights, long-distance trade"],
                 ["Late Harappan", "c. 1900 – 1300 BCE", "Cities decline; people move to smaller settlements"],
             ]},
            {"type": "audio", "title": "Listen: Harappan civilisation in 5 minutes", "caption": "Revise while travelling", "url": "REPLACE_WITH_AUDIO_URL"},
            {"type": "video", "title": "Video lecture (English)", "youtube_id": "BesZIL3xJPE"},

            {"type": "heading", "level": 2, "text": "How the civilisation was discovered"},
            {"type": "timeline", "items": [
                {"label": "1861 · The Archaeological Survey of India begins", "text": "**Alexander Cunningham** becomes its first Director-General. He searched mainly for the Buddhist-era past. A Harappan seal reached him, but he could not place how old it was."},
                {"label": "1921 · Harappa", "text": "**Daya Ram Sahni** excavates Harappa and finds seals and remains of an unknown culture."},
                {"label": "1922 · Mohenjodaro", "text": "**R.D. Banerji** excavates Mohenjodaro and finds similar seals and buildings, so the two sites are linked."},
                {"label": "1924 · The announcement", "text": "**John Marshall**, Director-General of the ASI, announces the discovery of a new civilisation."},
                {"label": "1944 · A new method", "text": "**R.E.M. Wheeler** becomes Director-General. He insists on following the **stratigraphy** (the layers) of a mound instead of digging in rigid horizontal units."},
                {"label": "After 1947 · Partition", "text": "Many major sites now lie in Pakistan, so Indian archaeologists search for new ones: Kalibangan, Lothal, Dholavira and others."},
            ]},
            {"type": "callout", "variant": "exam", "title": "Names to learn",
             "text": "**Daya Ram Sahni** = Harappa (1921). **R.D. Banerji** = Mohenjodaro (1922). **John Marshall** = announced it in 1924. **Wheeler** = stratigraphy."},

            {"type": "heading", "level": 2, "text": "Key sites"},
            {"type": "table", "caption": "Sites are on the Indus, its tributaries and the Ghaggar-Hakra river system.",
             "headers": ["Site", "Where", "Known for"],
             "rows": [
                 ["**Harappa**", "Punjab (Pakistan), on the Ravi", "First site found; granaries and working floors"],
                 ["**Mohenjodaro**", "Sind (Pakistan), on the Indus", "Great Bath, planned lower town, about 700 wells"],
                 ["**Chanhudaro**", "Sind (Pakistan)", "Tiny town devoted to crafts: beads, shell, metal, seals, weights"],
                 ["**Lothal**", "Gujarat", "Bead-making and a dockyard-like basin linked to sea trade"],
                 ["**Kalibangan**", "Rajasthan", "A ploughed field and fire altars"],
                 ["Banawali, Rakhigarhi", "Haryana", "Terracotta plough model (Banawali); one of the largest towns (Rakhigarhi)"],
                 ["**Dholavira**", "Gujarat", "City divided into three parts; large water reservoirs"],
                 ["Shortughai", "Afghanistan", "Harappan settlement near the lapis lazuli sources"],
                 ["Nageshwar, Balakot", "Near the coast", "Shell-working centres"],
             ]},

            {"type": "heading", "level": 2, "text": "Planned towns"},
            {"type": "text", "text": "Harappan towns look **planned**. Streets ran in a grid pattern and cut each other at right angles. Most settlements were split into two parts."},
            {"type": "compare",
             "left": {"title": "Citadel", "points": ["Smaller and **higher**, built on a raised platform", "Usually to the **west** of the town", "Walled", "Special buildings such as the Great Bath and storage buildings"]},
             "right": {"title": "Lower Town", "points": ["Larger and **lower**", "Usually to the **east**", "Also walled at some sites", "Houses built on raised platforms; where ordinary people lived"]}},
            {"type": "callout", "variant": "exam", "title": "Brick ratio",
             "text": "Bricks, whether sun-dried or baked, had a standard ratio: **height : breadth : length = 1 : 2 : 4**. The same ratio is found at sites hundreds of kilometres apart."},
            {"type": "accordion", "items": [
                {"title": "Drains and sanitation", "text": "Streets with drains were laid out **first**, and houses were built along them. Every house was connected to the street drain. Drains were covered with bricks or limestone slabs, with inspection holes (sumps) for cleaning."},
                {"title": "Houses", "text": "Houses were built around a **courtyard**. Walls facing the street had no windows. Many had a separate bathing area, and some had their own **wells**. Mohenjodaro had about **700 wells**."},
                {"title": "The Great Bath (Mohenjodaro)", "text": "A large rectangular tank in a courtyard, surrounded by a corridor on all four sides. Two flights of steps (north and south) led into it. It was made **water-tight** with bricks set on edge and gypsum mortar. There were rooms on three sides, one with a large well, and a huge drain carried the water away. It was probably used for **special ritual bathing**."},
                {"title": "Storage buildings", "text": "Large buildings on the citadels of Mohenjodaro and Harappa are called **granaries** because they look like storage structures. Harappa also had **working floors** for pounding grain."},
            ]},

            {"type": "heading", "level": 2, "text": "Crafts, beads and metals"},
            {"type": "text", "text": "The Harappans made beads, seals, weights, shell objects, pottery and tools and ornaments of copper and bronze. Some settlements, like **Chanhudaro**, were almost entirely devoted to craft production."},
            {"type": "list", "style": "bullet", "items": [
                "Beads were made of **carnelian, jasper, crystal, quartz and steatite**, of metals like copper, bronze and gold, and of shell, **faience** and terracotta.",
                "Shapes included disc, cylindrical, spherical, barrel-shaped and segmented. Some were decorated by incising or painting.",
                "**Steatite** is soft and easy to work. Specialised **drills** have been found at Chanhudaro, Lothal and Dholavira.",
            ]},
            {"type": "callout", "variant": "definition", "title": "Faience",
             "text": "A material made by mixing ground sand or silica with colour and a gum, then **firing** it. It was difficult to make, so faience vessels were probably costly."},
            {"type": "table", "caption": "Raw materials came from far away, which shows trade and contacts.",
             "headers": ["Material", "Where it came from"],
             "rows": [
                 ["Carnelian", "Gujarat (Bharuch)"],
                 ["Lapis lazuli", "Afghanistan (near Shortughai)"],
                 ["Steatite", "South Rajasthan and north Gujarat"],
                 ["Copper", "Khetri (Rajasthan) and Oman"],
                 ["Tin", "Afghanistan and Iran"],
                 ["Gold", "South India"],
                 ["Shell", "Coastal areas such as Nageshwar and Balakot"],
             ]},

            {"type": "heading", "level": 2, "text": "Trade and contacts"},
            {"type": "image", "caption": "Infographic: Harappan trade routes", "url": "REPLACE_WITH_IMAGE_URL"},
            {"type": "slides", "title": "Trade in 4 slides", "slides": [
                {"title": "Trade inside the subcontinent", "bullets": ["Raw materials came from many regions", "Copper from Rajasthan, gold from the south, steatite from Gujarat", "Finished goods went back to many settlements"]},
                {"title": "Trade across the sea", "bullets": ["Contacts with **Oman** (called Magan) and **Bahrain** (called Dilmun)", "Mesopotamian texts call the Harappan region **Meluhha**", "Exchange of copper, beads, shell and other goods"]},
                {"title": "Evidence of contact", "bullets": ["Mesopotamian texts mention Meluhha, Dilmun and Magan", "Harappan seals have been found in Mesopotamia", "Copper from Oman and Harappan copper both show traces of **nickel**"]},
                {"title": "Why it mattered", "bullets": ["Standard weights and seals made trade easier", "Craft towns depended on imported raw materials", "Trade linked the cities across a huge area"]},
            ]},

            {"type": "heading", "level": 2, "text": "Seals, script and weights"},
            {"type": "list", "style": "bullet", "items": [
                "**Seals** were usually made of steatite. They showed animals (the **unicorn** is the most common) and lines of script.",
                "Seals and **sealings** (clay impressions) were used to mark and protect packages of goods, which helped long-distance exchange.",
                "The script was written **right to left**, with about 375 to 400 signs. Most inscriptions are short, and the longest has about 26 signs.",
                "Weights were made of **chert**, usually cubical, with no markings. Lower denominations followed a **binary** system (1, 2, 4, 8 and so on) and higher ones were **decimal**. Small weights were probably used for jewellery and beads.",
            ]},
            {"type": "callout", "variant": "warning", "title": "Do not write this",
             "text": "The Harappan script has **not** been deciphered. Do not say that it is read, or that it is the same as Brahmi."},

            {"type": "heading", "level": 2, "text": "Farming, food and animals"},
            {"type": "compare",
             "left": {"title": "Plant foods found", "points": ["**Wheat, barley, lentil, chickpea, sesame**", "Millets from sites in Gujarat", "**Rice** is rare (found at some sites like Lothal and Rakhigarhi)"]},
             "right": {"title": "Animal bones found", "points": ["**Cattle, sheep, goat, buffalo, pig**", "Fish and fowl", "Wild animals such as boar, deer and gharial"]}},
            {"type": "accordion", "items": [
                {"title": "How do we know about ploughing?", "text": "**Terracotta models of the plough** were found at Cholistan and Banawali (Haryana). At **Kalibangan** (Rajasthan) archaeologists found a **ploughed field** with two sets of furrows at **right angles**, which suggests two different crops were grown together."},
                {"title": "Irrigation and water", "text": "Traces of **canals** have been found at **Shortughai** in Afghanistan. At **Dholavira** (Gujarat) there were large **water reservoirs**. Most Harappan farmers also depended on the river floods."},
            ]},
            {"type": "callout", "variant": "exam", "title": "Frequently asked",
             "text": "Kalibangan is the answer for the ploughed field. Banawali and Cholistan are the answer for plough models."},

            {"type": "heading", "level": 2, "text": "Society: rich, poor and rulers"},
            {"type": "text", "text": "Archaeologists try to find **social differences** by looking at burials and at objects. Some objects are everyday items (querns, pottery, tools). Others are **luxuries**, which are rare, costly or made from distant materials."},
            {"type": "compare",
             "left": {"title": "Signs of difference", "points": ["Some burials have more **ornaments** than others", "Luxury items like **faience** are found mostly at big cities like Mohenjodaro and Harappa", "Citadel and lower town were different areas"]},
             "right": {"title": "Signs of similarity", "points": ["Same **brick ratio** and similar **weights** over a vast area", "Similar drains and houses across towns", "No clear evidence of a palace or royal burials"]}},
            {"type": "accordion", "items": [
                {"title": "Burials", "text": "The dead were buried in pits, sometimes lined with bricks. Pottery and ornaments were placed in graves, and jewellery was found in the burials of both **men and women**. A few graves held a **copper mirror**."},
                {"title": "Who ruled?", "text": "Historians disagree. Some think there was **one state**, because of the similar artefacts, planned settlements and standard bricks and weights. Others think there was **no single ruler**. Others think each big city had its **own ruler**. A stone statue from Mohenjodaro is called the **'priest-king'**, but that name is an interpretation."},
            ]},

            {"type": "heading", "level": 2, "text": "Beliefs and religion"},
            {"type": "accordion", "items": [
                {"title": "Female figurines", "text": "Many **terracotta female figurines** were found. Some archaeologists think they represent a **mother goddess**, linked to fertility."},
                {"title": "The 'proto-Shiva' seal", "text": "A seal shows a figure seated cross-legged, surrounded by animals such as an elephant, a tiger, a rhinoceros and a buffalo. **John Marshall** called it **'proto-Shiva'**. Other historians question this."},
                {"title": "Stone objects and fire altars", "text": "Marshall also identified some conical stone objects as **lingas**. **Fire altars** were found at **Kalibangan** and **Lothal**."},
            ]},
            {"type": "callout", "variant": "important", "title": "Interpretations, not facts",
             "text": "Harappan religion is **reconstructed from objects**, and the script cannot be read to confirm it. Use words like **'probably'** and **'some archaeologists think'**."},

            {"type": "heading", "level": 2, "text": "The end of the civilisation"},
            {"type": "text", "text": "By about **1800 BCE**, most Mature Harappan sites in regions like Cholistan had been abandoned. People moved to new settlements in **Gujarat, Haryana and western Uttar Pradesh**."},
            {"type": "list", "style": "bullet", "items": [
                "**Climatic change** and **deforestation**",
                "**Floods**, and rivers that **dried up or changed course**",
                "**Overuse of land**",
                "Breakdown of the system that held the cities together",
            ]},
            {"type": "compare",
             "left": {"title": "Mature Harappan", "points": ["Planned cities and drains", "Standard bricks and weights", "Seals and script", "Long-distance trade"]},
             "right": {"title": "Late Harappan", "points": ["Smaller, rural settlements", "Seals, standard weights and script **disappear**", "Little long-distance trade", "New areas settled to the east and south"]}},
            {"type": "accordion", "items": [
                {"title": "Did invaders destroy the cities?", "text": "Wheeler once suggested an **invasion**. Today most historians **reject** it, because there is no clear evidence of conquest and the skeletons used as proof came from different periods."},
            ]},

            {"type": "heading", "level": 2, "text": "How archaeologists interpret finds"},
            {"type": "list", "style": "number", "items": [
                "**Classify** the finds: tools, ornaments, pottery, seals.",
                "Study the **context**: was it found in a house, a drain, a grave or a workshop?",
                "Decide the **function**: everyday use or ritual use?",
                "Compare with the present day and with other cultures, carefully.",
            ]},
            {"type": "callout", "variant": "tip", "title": "Answer-writing tip",
             "text": "For long answers, name the **evidence**, then the **conclusion**, then add a word like **'probably'** if historians disagree."},

            {"type": "heading", "level": 2, "text": "Revise with flashcards"},
            {"type": "flashcards", "cards": [
                {"front": "Citadel", "back": "The smaller, **higher**, walled part of a Harappan settlement, usually to the west."},
                {"front": "Lower Town", "back": "The larger, **lower** part of the settlement, usually to the east, where houses stood on platforms."},
                {"front": "Faience", "back": "Material made by firing ground sand or silica with colour and gum. It was costly and difficult to make."},
                {"front": "Steatite", "back": "A soft stone. It was used for **seals** and beads because it is easy to work."},
                {"front": "Seal", "back": "A small stone object with animal figures and script, used to stamp and protect packages of goods."},
                {"front": "Meluhha", "back": "The Mesopotamian name for the **Harappan region**."},
                {"front": "Chanhudaro", "back": "A tiny Sind settlement almost entirely devoted to craft production."},
                {"front": "Priest-king", "back": "A stone statue from Mohenjodaro. The name is an **interpretation**, not proof of a king."},
                {"front": "Stratigraphy", "back": "Studying the **layers** of a mound. Wheeler insisted on following it."},
                {"front": "Mature Harappan phase", "back": "**c. 2600 – 1900 BCE**, the period of planned cities."},
            ]},

            {"type": "heading", "level": 2, "text": "Check yourself"},
            {"type": "quiz", "questions": [
                {"q": "Who excavated Harappa in 1921?", "options": ["R.D. Banerji", "Daya Ram Sahni", "John Marshall", "R.E.M. Wheeler"], "answer": 1, "explain": "Daya Ram Sahni excavated Harappa. R.D. Banerji excavated Mohenjodaro in 1922."},
                {"q": "The standard ratio of height : breadth : length of Harappan bricks was:", "options": ["1 : 2 : 4", "4 : 2 : 1", "2 : 3 : 4", "1 : 3 : 5"], "answer": 0, "explain": "The length and breadth were four times and twice the height, so height : breadth : length is 1 : 2 : 4."},
                {"q": "Which tiny site was devoted almost entirely to craft production?", "options": ["Mohenjodaro", "Kalibangan", "Chanhudaro", "Dholavira"], "answer": 2, "explain": "Chanhudaro produced beads, shell objects, metal items, seals and weights."},
                {"q": "Mesopotamian texts used the name Meluhha for:", "options": ["Oman", "Bahrain", "The Harappan region", "Afghanistan"], "answer": 2, "explain": "Magan was Oman, Dilmun was Bahrain, and Meluhha was the Harappan region."},
                {"q": "Which statement about the Harappan script is correct?", "options": ["It has been fully deciphered", "It is still undeciphered", "It is the same as Brahmi", "It was deciphered by James Prinsep"], "answer": 1, "explain": "The script remains undeciphered. Prinsep deciphered Brahmi, which is a different script."},
                {"q": "A ploughed field with furrows at right angles was found at:", "options": ["Lothal", "Kalibangan", "Shortughai", "Balakot"], "answer": 1, "explain": "At Kalibangan, two sets of furrows at right angles suggest two crops were grown together."},
                {"q": "Harappan weights in the lower denominations followed which system?", "options": ["Decimal", "Binary", "Duodecimal", "Roman"], "answer": 1, "explain": "Lower weights were binary (1, 2, 4, 8 and so on), while higher ones were decimal."},
                {"q": "Which of these is NOT a suggested reason for the decline of the cities?", "options": ["Shifting or drying rivers", "Deforestation and overuse of land", "Floods and climatic change", "A proven massacre by invaders"], "answer": 3, "explain": "The invasion theory has no convincing evidence, and most historians reject it."},
            ]},
        ],
     },   
}
