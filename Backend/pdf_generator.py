from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
import os
import uuid

def generate_pdf(title: str, content: str):
    # Create output folder if it doesn't exist
    os.makedirs("generated_pdfs", exist_ok=True)

    filename = f"{uuid.uuid4().hex}.pdf"
    filepath = os.path.join("generated_pdfs", filename)

    doc = SimpleDocTemplate(filepath, pagesize=A4)

    styles = getSampleStyleSheet()

    title_style = styles["Heading1"]
    title_style.alignment = TA_CENTER
    title_style.textColor = HexColor("#7B1E1E")

    heading_style = styles["Heading2"]
    heading_style.textColor = HexColor("#7B1E1E")

    body_style = styles["BodyText"]
    body_style.leading = 22

    story = []

    # Title
    story.append(Paragraph("EDUMOTION AI", title_style))
    story.append(Spacer(1, 20))

    story.append(Paragraph(title, heading_style))
    story.append(Spacer(1, 15))

    # Split content into paragraphs
    for line in content.split("\n"):
        line = line.strip()
        if line:
            story.append(Paragraph(line, body_style))
            story.append(Spacer(1, 10))

    doc.build(story)

    return filepath
