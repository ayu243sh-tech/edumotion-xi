# resources_data.py
# Data for the Study Materials / Resources hub — MCQ sets (interactive, scored),
# sample papers, PYQs, important questions, and mind maps.
# No database — static Python dicts, same pattern as seed_data.py and library_data.py.

# ---------- MCQ Sets (interactive, scored in the frontend) ----------
MCQ_SETS = {
    "eco-national-income-mcq": {
        "id": "eco-national-income-mcq",
        "title": "National Income — 100 MCQs",
        "subject": "Economics",
        "class_level": "12",
        "chapter": "National Income",
        "questions": [
            {
                "q": "GDP stands for?",
                "options": ["Gross Domestic Product", "General Domestic Product", "Gross Development Plan", "General Development Product"],
                "answer": 0,
            },
            {
                "q": "Which of these is NOT included in National Income?",
                "options": ["Transfer payments", "Wages", "Rent", "Profit"],
                "answer": 0,
            },
            {
                "q": "NNP at Factor Cost is also called:",
                "options": ["National Income", "Gross National Product", "Personal Income", "Disposable Income"],
                "answer": 0,
            },
            {
                "q": "GNP is equal to:",
                "options": ["GDP + Net Factor Income from Abroad", "GDP - Depreciation", "NDP + Depreciation", "GDP + Indirect Taxes"],
                "answer": 0,
            },
            {
                "q": "Net Factor Income from Abroad is:",
                "options": ["Factor income received from abroad minus factor income paid abroad", "Total exports minus total imports", "Total income earned by residents", "Foreign direct investment inflow"],
                "answer": 0,
            },
            {
                "q": "Which of the following is a stock concept?",
                "options": ["Capital", "Income", "Investment", "Consumption"],
                "answer": 0,
            },
            {
                "q": "Which of the following is a flow concept?",
                "options": ["National Income", "Wealth", "Capital", "Population"],
                "answer": 0,
            },
            {
                "q": "The value of output produced within the domestic territory of a country during a year is called:",
                "options": ["GDP", "GNP", "NNP", "NDP"],
                "answer": 0,
            },
            {
                "q": "NNP at Market Price minus Net Indirect Tax equals:",
                "options": ["NNP at Factor Cost", "GDP at Market Price", "GNP at Market Price", "NDP at Market Price"],
                "answer": 0,
            },
            {
                "q": "Which of the following is NOT a method of measuring National Income?",
                "options": ["Circular Flow Method", "Product Method", "Income Method", "Expenditure Method"],
                "answer": 0,
            },
            {
                "q": "In the Income Method, National Income is the sum of:",
                "options": ["Compensation of employees, rent, interest, profit, and mixed income", "Only wages and salaries", "Only profits of firms", "Government expenditure only"],
                "answer": 0,
            },
            {
                "q": "Value Added is calculated as:",
                "options": ["Value of Output − Intermediate Consumption", "Value of Output + Intermediate Consumption", "Sales − Purchases", "Profit − Expenses"],
                "answer": 0,
            },
            {
                "q": "Which of the following is included while calculating National Income?",
                "options": ["Compensation of employees", "Sale of second-hand goods", "Windfall gains", "Gifts received"],
                "answer": 0,
            },
            {
                "q": "Depreciation is also known as:",
                "options": ["Consumption of Fixed Capital", "Net Investment", "Capital Formation", "Gross Investment"],
                "answer": 0,
            },
            {
                "q": "Real GDP is calculated using:",
                "options": ["Constant prices", "Current prices", "Market prices only", "Factor cost only"],
                "answer": 0,
            },
            {
                "q": "Nominal GDP is calculated using:",
                "options": ["Current prices", "Constant prices", "Base year prices", "Factor cost"],
                "answer": 0,
            },
            {
                "q": "Which of the following is a leakage in the circular flow of income?",
                "options": ["Savings", "Investment", "Government Expenditure", "Exports"],
                "answer": 0,
            },
            {
                "q": "Which of the following is an injection in the circular flow of income?",
                "options": ["Investment", "Savings", "Taxes", "Imports"],
                "answer": 0,
            },
            {
                "q": "Personal Disposable Income is:",
                "options": ["Personal Income − Direct Taxes", "Personal Income + Direct Taxes", "National Income − Corporate Tax", "GDP − Depreciation"],
                "answer": 0,
            },
            {
                "q": "Which of these is a transfer payment?",
                "options": ["Old age pension", "Wages", "Rent", "Interest on loans"],
                "answer": 0,
            },
            {
                "q": "GDP Deflator is calculated as:",
                "options": ["(Nominal GDP / Real GDP) × 100", "(Real GDP / Nominal GDP) × 100", "Nominal GDP − Real GDP", "Real GDP + Nominal GDP"],
                "answer": 0,
            },
            {
                "q": "Which sector's contribution is NOT included in domestic territory?",
                "options": ["Embassies of foreign countries located within the country", "Ships and aircrafts operated by residents", "Fishing vessels of residents in international waters", "Branches of domestic banks in the country"],
                "answer": 0,
            },
            {
                "q": "A normal resident of a country is one whose centre of economic interest lies:",
                "options": ["In that country", "Outside that country", "In multiple countries equally", "Nowhere specific"],
                "answer": 0,
            },
            {
                "q": "Which of the following is an intermediate good?",
                "options": ["Flour used by a bakery to make bread", "Bread purchased by a household", "A car bought by a family", "A washing machine bought for home use"],
                "answer": 0,
            },
            {
                "q": "National Income at Factor Cost is also known as:",
                "options": ["Net National Product at Factor Cost", "Gross National Product at Market Price", "Net Domestic Product at Market Price", "Gross Domestic Product at Factor Cost"],
                "answer": 0,
            },
            {
                "q": "Which of the following is NOT a factor income?",
                "options": ["Old age pension", "Wages", "Interest", "Profit"],
                "answer": 0,
            },
            {
                "q": "The sum of Gross Value Added at market price across all sectors of the economy is called:",
                "options": ["GDP at Market Price", "NNP at Factor Cost", "Personal Income", "National Disposable Income"],
                "answer": 0,
            },
            {
                "q": "Which of the following is included in Net Indirect Tax?",
                "options": ["Indirect Tax minus Subsidies", "Direct Tax minus Subsidies", "Indirect Tax plus Direct Tax", "Subsidies minus Indirect Tax"],
                "answer": 0,
            },
            # ... continue adding up to 100 questions in this {q, options, answer} shape
        ],
    },
}

# ---------- Sample Papers (question paper + optional marking scheme, both PDFs) ----------
SAMPLE_PAPERS = {
    "eco-sample-paper-1": {
        "id": "eco-sample-paper-2",
        "title": "Economics Sample Paper 2",
        "subject": "Economics",
        "class_level": "12",
        "year": "2026",
        "pdf_url": "https://drive.google.com/file/d/19MAVP1AfekLwzywrmEwt-dSaIcYZx5ta/preview",
    },
    "eco-sample-paper-2": {
        "id": "eco-sample-paper-3",
        "title": "Economics Sample Paper 3",
        "subject": "Economics",
        "class_level": "12",
        "year": "2026",
        "pdf_url": "https://drive.google.com/file/d/1EZgwgENsu7wOy8PAzSKXvNFFmX2hZgPj/preview",
    },
    "eco-sample-paper-3": {
        "id": "eco-sample-paper-4",
        "title": "Economics Sample Paper 4",
        "subject": "Economics",
        "class_level": "12",
        "year": "2026",
        "pdf_url": "https://drive.google.com/file/d/1qJROKGL0r4k5Ef--C-DV_zY9bxuCmnvk/preview",
    },
    "eco-sample-paper-4": {
        "id": "eco-sample-paper-5",
        "title": "Economics Sample Paper 5",
        "subject": "Economics",
        "class_level": "12",
        "year": "2026",
        "pdf_url": "https://drive.google.com/file/d/1rKG9MgGyeoFACnw_0C_e7TIAQw64cDEP/preview",
    },
    "eco-sample-paper-5": {
        "id": "eco-sample-paper-6",
        "title": "Economics Sample Paper 6",
        "subject": "Economics",
        "class_level": "12",
        "year": "2026",
        "pdf_url": "https://drive.google.com/file/d/1BsoAaQrtxlmj-vBePCZyoV-GPSU62QT7/preview",
    },
}

# ---------- Previous Year Question Papers ----------
PYQ_PAPERS = {
    "eco-pyq-2024": {https://drive.google.com/file/d/1BsoAaQrtxlmj-vBePCZyoV-GPSU62QT7/view?usp=sharing
        "id": "eco-pyq-2024",
        "title": "Economics PYQ 2024",
        "subject": "Economics",
        "class_level": "12",
        "year": "2024",
        "pdf_url": "https://drive.google.com/file/d/REPLACE_WITH_FILE_ID/preview",
    },
    "eco-pyq-2023": {
        "id": "eco-pyq-2023",
        "title": "Economics PYQ 2023",
        "subject": "Economics",
        "class_level": "12",
        "year": "2023",
        "pdf_url": "https://drive.google.com/file/d/REPLACE_WITH_FILE_ID/preview",
    },
"eco-pyq-2025-set1": {
        "id": "eco-pyq-2025-set1",
        "title": "Economics PYQ 2025 — Set 1",
        "subject": "Economics",
        "class_level": "12",
        "year": "2025",
        "pdf_url": "https://drive.google.com/file/d/19MAVP1AfekLwzywrmEwt-dSaIcYZx5ta/preview",
    },
    "eco-pyq-2025-set2": {
        "id": "eco-pyq-2025-set2",
        "title": "Economics PYQ 2025 — Set 2",
        "subject": "Economics",
        "class_level": "12",
        "year": "2025",
        "pdf_url": "https://drive.google.com/file/d/1EZgwgENsu7wOy8PAzSKXvNFFmX2hZgPj/preview",
    },
    "eco-pyq-2025-set3": {
        "id": "eco-pyq-2025-set3",
        "title": "Economics PYQ 2025 — Set 3",
        "subject": "Economics",
        "class_level": "12",
        "year": "2025",
        "pdf_url": "https://drive.google.com/file/d/1qJROKGL0r4k5Ef--C-DV_zY9bxuCmnvk/preview",
    },
    "eco-pyq-2025-set4": {
        "id": "eco-pyq-2025-set4",
        "title": "Economics PYQ 2025 — Set 4",
        "subject": "Economics",
        "class_level": "12",
        "year": "2025",
        "pdf_url": "https://drive.google.com/file/d/1rKG9MgGyeoFACnw_0C_e7TIAQw64cDEP/preview",
    },
    "eco-pyq-2025-set5": {
        "id": "eco-pyq-2025-set5",
        "title": "Economics PYQ 2025 — Set 5",
        "subject": "Economics",
        "class_level": "12",
        "year": "2025",
        "pdf_url": "https://drive.google.com/file/d/1BsoAaQrtxlmj-vBePCZyoV-GPSU62QT7/preview",
    },
}

# ---------- Important Questions (text-based, marks-weighted) ----------
IMPORTANT_QUESTIONS = {
    "eco-important-q": {
        "id": "eco-important-q",
        "title": "Economics — Important Questions",
        "subject": "Economics",
        "class_level": "12",
        "questions": [
            {"q": "Explain the circular flow of income with a diagram.", "marks": 4},
            {"q": "Distinguish between GDP and GNP.", "marks": 3},
            {"q": "What is the significance of the multiplier in income determination?", "marks": 6},
            {"q": "Distinguish between final goods and intermediate goods with examples.", "marks": 3},
            {"q": "Explain the problem of double counting in the estimation of National Income and how it can be avoided.", "marks": 4},
            {"q": "Distinguish between GDP at Market Price and GDP at Factor Cost.", "marks": 3},
            {"q": "Explain the various components of the income method of calculating National Income.", "marks": 6},
            {"q": "What is meant by 'depreciation'? How does it differ from Net Domestic Product and Gross Domestic Product?", "marks": 3},
            {"q": "Explain the functions of a Central Bank.", "marks": 6},
            {"q": "Distinguish between the Legal Tender Money and Fiat Money.", "marks": 3},
            {"q": "Explain the process of credit creation by commercial banks with a numerical example.", "marks": 6},
            {"q": "What are the instruments of monetary policy used by the Central Bank to control credit?", "marks": 4},
            {"q": "Explain the concept of Aggregate Demand and Aggregate Supply.", "marks": 4},
            {"q": "What is meant by 'excess demand' and 'deficient demand'? Explain their effects on the economy.", "marks": 4},
            {"q": "Explain the fiscal measures to correct deficient demand.", "marks": 4},
            {"q": "Distinguish between Revenue Budget and Capital Budget.", "marks": 3},
            {"q": "Explain the objectives of a government budget.", "marks": 4},
            {"q": "What is the difference between Current Account and Capital Account of Balance of Payments?", "marks": 4},
        ],
    },
}

# ---------- Mind Maps (single image per chapter) ----------
MIND_MAPS = {
    "eco-national-income-mindmap": {
        "id": "eco-national-income-mindmap",
        "title": "National Income — Mind Map",
        "subject": "Economics",
        "class_level": "12",
        "chapter": "National Income",
        "image_url": "https://drive.google.com/uc?export=view&id=REPLACE_WITH_FILE_ID",
    },
}
