# resources_data.py

# ---------- Chapters (the backbone — everything else links to a chapter_id) ----------
RESOURCE_CHAPTERS = {
    "eco-national-income": {
        "id": "eco-national-income",
        "title": "National Income",
        "subject": "Economics",
        "class_level": "12",
    },
    "his-harappan": {
        "id": "his-harappan",
        "title": "Harappan Civilization",
        "subject": "History",
        "class_level": "12",
    },
    # Add one entry per chapter you want covered in the Resource Hub.
}

# ---------- MCQ Sets (now linked to a chapter_id) ----------
MCQ_SETS = {
    "eco-national-income-mcq": {
        "id": "eco-national-income-mcq",
        "chapter_id": "eco-national-income",
        "questions": [
            {"q": "GDP stands for?", "options": ["Gross Domestic Product", "General Domestic Product", "Gross Development Plan", "General Development Product"], "answer": 0},
            {"q": "GDP stands for?", "options": ["Gross Domestic Product", "General Domestic Product", "Gross Development Plan", "General Development Product"], "answer": 0},
            {"q": "Which of these is NOT included in National Income?", "options": ["Transfer payments", "Wages", "Rent", "Profit"], "answer": 0},
            {"q": "NNP at Factor Cost is also called:", "options": ["National Income", "Gross National Product", "Personal Income", "Disposable Income"], "answer": 0},
            {"q": "GNP is equal to:", "options": ["GDP + Net Factor Income from Abroad", "GDP - Depreciation", "NDP + Depreciation", "GDP + Indirect Taxes"], "answer": 0},
            {"q": "Net Factor Income from Abroad is:", "options": ["Factor income received from abroad minus factor income paid abroad", "Total exports minus total imports", "Total income earned by residents", "Foreign direct investment inflow"], "answer": 0},
            {"q": "Which of the following is a stock concept?", "options": ["Capital", "Income", "Investment", "Consumption"], "answer": 0},
            {"q": "Which of the following is a flow concept?", "options": ["National Income", "Wealth", "Capital", "Population"], "answer": 0},
            {"q": "The value of output produced within the domestic territory of a country during a year is called:", "options": ["GDP", "GNP", "NNP", "NDP"], "answer": 0},
            {"q": "NNP at Market Price minus Net Indirect Tax equals:", "options": ["NNP at Factor Cost", "GDP at Market Price", "GNP at Market Price", "NDP at Market Price"], "answer": 0},
            {"q": "Which of the following is NOT a method of measuring National Income?", "options": ["Circular Flow Method", "Product Method", "Income Method", "Expenditure Method"], "answer": 0},
            {"q": "In the Income Method, National Income is the sum of:", "options": ["Compensation of employees, rent, interest, profit, and mixed income", "Only wages and salaries", "Only profits of firms", "Government expenditure only"], "answer": 0},
            {"q": "Value Added is calculated as:", "options": ["Value of Output − Intermediate Consumption", "Value of Output + Intermediate Consumption", "Sales − Purchases", "Profit − Expenses"], "answer": 0},
            {"q": "Which of the following is included while calculating National Income?", "options": ["Compensation of employees", "Sale of second-hand goods", "Windfall gains", "Gifts received"], "answer": 0},
            {"q": "Depreciation is also known as:", "options": ["Consumption of Fixed Capital", "Net Investment", "Capital Formation", "Gross Investment"], "answer": 0},
            {"q": "Real GDP is calculated using:", "options": ["Constant prices", "Current prices", "Market prices only", "Factor cost only"], "answer": 0},
            {"q": "Nominal GDP is calculated using:", "options": ["Current prices", "Constant prices", "Base year prices", "Factor cost"], "answer": 0},
            {"q": "Which of the following is a leakage in the circular flow of income?", "options": ["Savings", "Investment", "Government Expenditure", "Exports"], "answer": 0},
            {"q": "Which of the following is an injection in the circular flow of income?", "options": ["Investment", "Savings", "Taxes", "Imports"], "answer": 0},
            {"q": "Personal Disposable Income is:", "options": ["Personal Income − Direct Taxes", "Personal Income + Direct Taxes", "National Income − Corporate Tax", "GDP − Depreciation"], "answer": 0},
            {"q": "Which of these is a transfer payment?", "options": ["Old age pension", "Wages", "Rent", "Interest on loans"], "answer": 0},
            {"q": "GDP Deflator is calculated as:", "options": ["(Nominal GDP / Real GDP) × 100", "(Real GDP / Nominal GDP) × 100", "Nominal GDP − Real GDP", "Real GDP + Nominal GDP"], "answer": 0},
            {"q": "Which sector's contribution is NOT included in domestic territory?", "options": ["Embassies of foreign countries located within the country", "Ships and aircrafts operated by residents", "Fishing vessels of residents in international waters", "Branches of domestic banks in the country"], "answer": 0},
            {"q": "A normal resident of a country is one whose centre of economic interest lies:", "options": ["In that country", "Outside that country", "In multiple countries equally", "Nowhere specific"], "answer": 0},
            {"q": "Which of the following is an intermediate good?", "options": ["Flour used by a bakery to make bread", "Bread purchased by a household", "A car bought by a family", "A washing machine bought for home use"], "answer": 0},
            {"q": "National Income at Factor Cost is also known as:", "options": ["Net National Product at Factor Cost", "Gross National Product at Market Price", "Net Domestic Product at Market Price", "Gross Domestic Product at Factor Cost"], "answer": 0},
            {"q": "Which of the following is NOT a factor income?", "options": ["Old age pension", "Wages", "Interest", "Profit"], "answer": 0},
            {"q": "The sum of Gross Value Added at market price across all sectors of the economy is called:", "options": ["GDP at Market Price", "NNP at Factor Cost", "Personal Income", "National Disposable Income"], "answer": 0},
            {"q": "Which of the following is included in Net Indirect Tax?", "options": ["Indirect Tax minus Subsidies", "Direct Tax minus Subsidies", "Indirect Tax plus Direct Tax", "Subsidies minus Indirect Tax"], "answer": 0},
            # ... rest of your 28 questions
        ],
    },
}

# ---------- Important Questions (linked to a chapter_id) ----------
IMPORTANT_QUESTIONS = {
    "eco-national-income-iq": {
        "id": "eco-national-income-iq",
        "chapter_id": "eco-national-income",
        "questions": [
            {"q": "Explain the circular flow of income with a diagram.", "marks": 4},
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
            # ... rest of your 18 questions
        ],
    },
}

# ---------- Mind Maps (linked to a chapter_id, one per chapter) ----------
MIND_MAPS = {
    "eco-national-income-mindmap": {
        "id": "eco-national-income-mindmap",
        "chapter_id": "eco-national-income",
        "image_url": "https://drive.google.com/uc?export=view&id=REPLACE_WITH_FILE_ID",
    },
}

# ---------- Formula Sheets (NEW — linked to a chapter_id) ----------
FORMULA_SHEETS = {
    "eco-national-income-formulas": {
        "id": "eco-national-income-formulas",
        "chapter_id": "eco-national-income",
        "image_url": "https://drive.google.com/uc?export=view&id=REPLACE_WITH_FILE_ID",
        # Formula sheets are usually one image, same viewer as mind maps.
        # If yours are PDFs instead, use "pdf_url" and the PDF viewer instead.
    },
}

# ---------- Sample Papers (top-level, spans all chapters — unchanged) ----------
SAMPLE_PAPERS = {
    "eco-sample-paper-1": {
        "id": "eco-sample-paper-1",
        "title": "Economics Sample Paper 1",
        "subject": "Economics",
        "class_level": "12",
        "year": "2026",
        "pdf_url": "https://khvmrhnkooehyojkguev.supabase.co/storage/v1/object/public/Documents/eco1.pdf",
    },
    "eco-sample-paper-2": {
        "id": "eco-sample-paper-2",
        "title": "Economics Sample Paper 2",
        "subject": "Economics",
        "class_level": "12",
        "year": "2026",
        "pdf_url": "https://khvmrhnkooehyojkguev.supabase.co/storage/v1/object/public/Documents/eco2.pdf",
    },
    "eco-sample-paper-3": {
        "id": "eco-sample-paper-3",
        "title": "Economics Sample Paper 3",
        "subject": "Economics",
        "class_level": "12",
        "year": "2026",
        "pdf_url": "https://khvmrhnkooehyojkguev.supabase.co/storage/v1/object/public/Documents/Eco3.pdf",
    },
    "eco-sample-paper-4": {
        "id": "eco-sample-paper-4",
        "title": "Economics Sample Paper 4",
        "subject": "Economics",
        "class_level": "12",
        "year": "2026",
        "pdf_url": "https://khvmrhnkooehyojkguev.supabase.co/storage/v1/object/public/Documents/Eco4.pdf",
    },
    "eco-sample-paper-5": {
        "id": "eco-sample-paper-5",
        "title": "Economics Sample Paper 5",
        "subject": "Economics",
        "class_level": "12",
        "year": "2026",
        "pdf_url": "https://khvmrhnkooehyojkguev.supabase.co/storage/v1/object/public/Documents/Eco5.pdf",
    },
}

# ---------- PYQs (top-level — unchanged) ----------
PYQ_PAPERS = {
    "eco-pyq-2025-set1": {
        "id": "eco-pyq-2025-set1",
        "title": "Economics PYQ 2025 — Set 1",
        "subject": "Economics",
        "class_level": "12",
        "year": "2025",
        "pdf_url": "https://drive.google.com/file/d/19MAVP1AfekLwzywrmEwt-dSaIcYZx5ta/preview",
    },
    # ... rest of your PYQ entries
}

# ---------- Premium Books (NEW — your handwritten books, Library-style) ----------
PREMIUM_BOOKS = {
    "indian-constitution-handbook": {
        "id": "indian-constitution-handbook",
        "title": "Indian Constitution Handbook",
        "author": "Ayush",
        "class_level": "12",
        "subject": "Political Science",
        "cover": "https://covers.example.com/indian-constitution.jpg",
        "pdf_url": "https://khvmrhnkooehyojkguev.supabase.co/storage/v1/object/public/BOOKS/Indian%20Constitution%20Handbook.pdf",
    },
    "important-political-leaders": {
        "id": "important-political-leaders",
        "title": "Important Political Leaders",
        "author": "Ayush",
        "class_level": "12",
        "subject": "Political Science",
        "cover": "https://covers.example.com/political-leaders.jpg",
        "pdf_url": "https://khvmrhnkooehyojkguev.supabase.co/storage/v1/object/public/BOOKS/IMPORTANT%20POLITICAL%20LEADERS.pdf",
    },
}
