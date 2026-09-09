import json, os, re

BASE_DIR = '/home/nate_foxtrot/PROJECTS/SOFTWARE/Website_Final'
BLITZ_SEO_FILE = '/home/nate_foxtrot/PROJECTS/SOFTWARE/MSP_Blitz/data/seo_pages.json'
SERVICES_DIR = os.path.join(BASE_DIR, 'services')

os.makedirs(SERVICES_DIR, exist_ok=True)

with open(BLITZ_SEO_FILE, 'r') as f:
    seo_pages = json.load(f)

# Load template from about.html for matching headers, nav, styles, and footer
with open(os.path.join(BASE_DIR, 'about.html'), 'r') as f:
    about_html = f.read()

# Extract header/nav and footer
nav_match = re.search(r'(<!DOCTYPE html>.*?<main[^>]*>)', about_html, re.DOTALL)
footer_match = re.search(r'(</main>.*?</html>)', about_html, re.DOTALL)

nav_template = nav_match.group(1) if nav_match else ""
footer_template = footer_match.group(1) if footer_match else ""

# Fix asset paths for /services/ subfolder (e.g. styles.css -> ../styles.css)
nav_template = nav_template.replace('href="styles.css', 'href="../styles.css')
nav_template = nav_template.replace('href="styles-modern.css', 'href="../styles-modern.css')
nav_template = nav_template.replace('href="assets/', 'href="../assets/')
nav_template = nav_template.replace('src="assets/', 'src="../assets/')
nav_template = nav_template.replace('href="index.html"', 'href="../index.html"')
nav_template = nav_template.replace('href="about.html"', 'href="../about.html"')
nav_template = nav_template.replace('href="ordering_system.html"', 'href="../ordering_system.html"')
nav_template = nav_template.replace('href="contact.html"', 'href="../contact.html"')
nav_template = nav_template.replace('href="service_area.html"', 'href="../service_area.html"')
nav_template = nav_template.replace('href="reviews.html"', 'href="../reviews.html"')
nav_template = nav_template.replace('href="partners.html"', 'href="../partners.html"')
nav_template = nav_template.replace('href="accomplishments.html"', 'href="../accomplishments.html"')

footer_template = footer_template.replace('href="assets/', 'href="../assets/')
footer_template = footer_template.replace('src="assets/', 'src="../assets/')
footer_template = footer_template.replace('href="index.html"', 'href="../index.html"')
footer_template = footer_template.replace('href="about.html"', 'href="../about.html"')
footer_template = footer_template.replace('href="ordering_system.html"', 'href="../ordering_system.html"')
footer_template = footer_template.replace('href="contact.html"', 'href="../contact.html"')
footer_template = footer_template.replace('href="service_area.html"', 'href="../service_area.html"')
footer_template = footer_template.replace('href="reviews.html"', 'href="../reviews.html"')

generated = []

for page in seo_pages:
    if not page.get('published'):
        continue
    slug = page['slug']
    title = page.get('title', 'Service | Ultimate Security Solutions')
    description = page.get('description', '')
    canonical_url = f"https://usstech.net/services/{slug}.html"
    
    # Custom head with exact SEO tags
    head_content = nav_template
    # Replace title, description, canonical
    head_content = re.sub(r'<title>.*?</title>', f'<title>{title}</title>', head_content)
    head_content = re.sub(r'<meta name="description" content=".*?">', f'<meta name="description" content="{description}">', head_content)
    head_content = re.sub(r'<link rel="canonical" href=".*?">', f'<link rel="canonical" href="{canonical_url}">', head_content)
    
    sections_html = ""
    for sec in page.get('sections', []):
        h2 = sec.get('h2', '')
        body = sec.get('body', '').replace('\n', '<br><br>')
        sections_html += f"""
        <section class="section">
            <div class="container">
                <h2 class="section-title anim">{h2}</h2>
                <div class="mission-quote" style="font-style: normal; font-size: 1.1rem; text-align: left; max-width: 900px; margin: 1.5rem auto 0; line-height: 1.8; color: var(--color-text-secondary);">
                    {body}
                </div>
            </div>
        </section>
        """
        
    faqs_html = ""
    if page.get('faqs'):
        faqs_html = """<section class="section" style="background: rgba(255, 255, 255, 0.02);"><div class="container"><h2 class="section-title anim">FREQUENTLY ASKED QUESTIONS</h2><div style="max-width: 900px; margin: 2rem auto 0;">"""
        for f in page['faqs']:
            faqs_html += f"""
            <div style="border-bottom: 1px solid var(--color-border); padding: 1.5rem 0;">
                <h3 style="font-size: 1.2rem; color: var(--color-gold); margin-bottom: 0.5rem; font-family: 'Chakra Petch', sans-serif;">{f.get('q')}</h3>
                <p style="color: var(--color-text-secondary); line-height: 1.7;">{f.get('a')}</p>
            </div>
            """
        faqs_html += "</div></div></section>"
        
    page_body = f"""
    <div class="mission-banner" style="padding: 7rem 2rem 4rem;">
        <h1 style="font-family: 'Chakra Petch', sans-serif; font-size: clamp(2rem, 5vw, 3.2rem); text-transform: uppercase; letter-spacing: 2px; color: #fff; margin-bottom: 1rem;">
            {page.get('hero', {}).get('h1', title)}
        </h1>
        <p class="mission-quote" style="color: var(--color-gold); font-size: 1.25rem;">
            {page.get('hero', {}).get('sub', description)}
        </p>
        <div style="margin-top: 2.5rem; display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            <a href="../ordering_system.html" class="btn btn-primary" style="padding: 1rem 2rem; font-size: 1rem; font-weight: 700; text-transform: uppercase;">Get Instant Quote / Equipment</a>
            <a href="tel:8167872061" class="btn btn-secondary" style="padding: 1rem 2rem; font-size: 1rem; font-weight: 700; text-transform: uppercase;">Call: 816-787-2061</a>
        </div>
    </div>
    {sections_html}
    {faqs_html}
    <section class="section" style="text-align: center; padding: 4rem 2rem;">
        <div class="container">
            <h2 class="section-title anim">READY TO SECURE YOUR FACILITY?</h2>
            <p style="color: var(--color-text-secondary); max-width: 600px; margin: 1rem auto 2rem;">Our Kansas City technicians provide professional site surveys, hardware provisioning, and turnkey installation.</p>
            <a href="../contact.html" class="btn btn-primary" style="padding: 1rem 2.5rem; font-size: 1.1rem;">Schedule A Free Site Assessment</a>
        </div>
    </section>
    """
    
    full_html = head_content + page_body + footer_template
    
    out_file = os.path.join(SERVICES_DIR, f"{slug}.html")
    with open(out_file, 'w') as f_out:
        f_out.write(full_html)
    generated.append(slug)

print(f"Successfully generated {len(generated)} modern HTML SEO service pages.")
