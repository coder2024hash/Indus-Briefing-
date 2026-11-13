# Indus Briefing on Netlify
Deploy: push this folder to GitHub, then Netlify > Add new site > Import. No build command needed.
Set env var ADMIN_TOKEN (Site settings > Environment variables).
Add your PDF as public/whitepaper.pdf.
Export data: curl -H "Authorization: Bearer $ADMIN_TOKEN" https://YOURSITE/api/admin/export?type=subscribers  (or type=messages)
Forms and data are stored in Netlify Blobs; no external database needed.

