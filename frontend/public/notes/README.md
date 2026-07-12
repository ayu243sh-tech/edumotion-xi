# Chapter PDF Notes

Drop chapter PDF files here using this naming convention:

    <chapter-id>.pdf

Example filenames matching the current catalog:

    ch-light.pdf
    ch-electricity.pdf
    ch-life-processes.pdf
    ch-quadratic.pdf
    ch-trigonometry.pdf
    ch-kinematics.pdf
    ch-matter.pdf
    ch-integrals.pdf
    ch-letter.pdf
    ch-python.pdf

## How the site picks them up

Each chapter in `/app/backend/seed_data.py` has a `notes_pdf` field like:

    "notes_pdf": "/notes/ch-light.pdf"

The Chapter page's **Notes** tab embeds this URL in a PDF viewer, and the
**Download PDF** button (Overview + Notes tabs) downloads the same file.

## Adding a NEW chapter

1. Save your PDF here as `<chapter-id>.pdf`
2. In `/app/backend/seed_data.py`, in that chapter's dict, add:

       "notes_pdf": "/notes/<chapter-id>.pdf"

3. Refresh the site — no restart needed (backend + frontend hot-reload).

## Missing PDFs

If a `notes_pdf` file does not exist yet, the Notes tab shows a friendly
"PDF coming soon" placeholder instead of a broken viewer.
