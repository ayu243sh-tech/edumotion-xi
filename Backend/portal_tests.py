# portal_tests.py
# "batches" = which batches can take it. "option_id": None = both teacher options.
# "answer" is the index (0, 1, 2 ...) of the correct option.

TESTS = {
    "eco-national-income-1": {
        "id": "eco-national-income-1",
        "batches": ["c12-commerce", "c12-humanities"],
        "option_id": None,
        "subject": "Economics",
        "title": "National Income: Chapter Test",
        "duration_min": 10,
        "questions": [
            {"q": "GDP at market price plus net factor income from abroad equals:", "options": ["GNP at market price", "NDP at market price", "NNP at factor cost", "GDP at factor cost"], "answer": 0, "explain": "GNP = GDP + NFIA."},
            {"q": "Which of these is NOT included in national income?", "options": ["Wages", "Rent", "Old age pension", "Profit"], "answer": 2, "explain": "A pension is a transfer payment, not payment for a productive service."},
            {"q": "NNP at factor cost equals:", "options": ["NNP at MP − net indirect taxes", "GNP at MP + depreciation", "GDP at MP − NFIA", "NNP at MP + net indirect taxes"], "answer": 0, "explain": "NNP at FC (national income) = NNP at MP − net indirect taxes."},
            {"q": "Value added equals value of output minus:", "options": ["Depreciation", "Intermediate consumption", "Indirect taxes", "Factor payments"], "answer": 1, "explain": "Only the extra value created at each stage is counted."},
            {"q": "Which of these is a stock variable?", "options": ["Capital", "Income", "Investment", "Consumption"], "answer": 0, "explain": "A stock is measured at a point in time. Capital is a stock."},
        ],
    },
    "his-harappan-1": {
        "id": "his-harappan-1",
        "batches": ["c12-humanities"],
        "option_id": None,
        "subject": "History",
        "title": "Harappan Civilisation: Chapter Test",
        "duration_min": 10,
        "questions": [
            {"q": "Who excavated Harappa in 1921?", "options": ["R.D. Banerji", "Daya Ram Sahni", "John Marshall", "R.E.M. Wheeler"], "answer": 1, "explain": "Daya Ram Sahni excavated Harappa. R.D. Banerji excavated Mohenjodaro in 1922."},
            {"q": "The ratio of height : breadth : length of Harappan bricks was:", "options": ["1 : 2 : 4", "4 : 2 : 1", "2 : 3 : 4", "1 : 3 : 5"], "answer": 0, "explain": "The standard brick ratio was 1 : 2 : 4."},
            {"q": "A ploughed field was found at:", "options": ["Lothal", "Kalibangan", "Shortughai", "Balakot"], "answer": 1, "explain": "Kalibangan had a field with two sets of furrows at right angles."},
            {"q": "Mesopotamian texts called the Harappan region:", "options": ["Magan", "Dilmun", "Meluhha", "Sindhu"], "answer": 2, "explain": "Magan is Oman, Dilmun is Bahrain, and Meluhha is the Harappan region."},
            {"q": "The Harappan script is:", "options": ["Fully deciphered", "Still undeciphered", "The same as Brahmi", "Deciphered by Prinsep"], "answer": 1, "explain": "The script has not been deciphered."},
        ],
    },
}
