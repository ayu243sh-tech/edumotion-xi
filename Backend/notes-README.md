# Chapter PDF Notes

This project no longer stores PDF files locally. Notes are hosted on Google
Drive and linked to from `seed_data.py`.

## How it works

Each chapter in `/backend/seed_data.py` has a `notes_pdf` field, e.g.:

    "notes_pdf": "https://drive.google.com/file/d/YOUR_FILE_ID_HERE/preview"

The Chapter page's **Notes** tab embeds this URL in an iframe to preview it
inline. The **Open Notes** button opens the same file in a new tab on
Google Drive.

## Adding or updating a chapter's notes

1. Upload the PDF to Google Drive.
2. Right-click the file → **Share** → set access to **"Anyone with the link"**
   (Viewer). Without this, visitors will hit a permission error.
3. Copy the file's link. It looks like:

       https://drive.google.com/file/d/1AbCdEfGhIjKlMnOp/view?usp=sharing

4. Grab the file ID — the long string between `/d/` and `/view`
   (in the example above: `1AbCdEfGhIjKlMnOp`).
5. In `/backend/seed_data.py`, find that chapter's dict and set:

       "notes_pdf": "https://drive.google.com/file/d/1AbCdEfGhIjKlMnOp/preview"

6. Refresh the site — no restart needed.

## Missing PDFs

If a `notes_pdf` field is missing or still has the placeholder
`YOUR_FILE_ID_HERE`, the Notes tab shows a friendly "PDF coming soon"
placeholder instead of a broken viewer.
