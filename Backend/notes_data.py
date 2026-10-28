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
}
