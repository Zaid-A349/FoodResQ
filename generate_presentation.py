import sys
import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def create_deck():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Color Palette
    C_EMERALD = RGBColor(5, 150, 105)       # Primary Green #059669
    C_EMERALD_DARK = RGBColor(4, 120, 87)   # Dark Green #047857
    C_NAVY = RGBColor(15, 23, 42)          # Deep Navy/Slate #0F172A
    C_SLATE = RGBColor(51, 65, 85)         # Text Slate #334155
    C_MUTED = RGBColor(100, 116, 139)      # Muted Grey #64748B
    C_LIGHT_BG = RGBColor(248, 250, 252)   # Card bg #F8FAFC
    C_CARD_BORDER = RGBColor(226, 232, 240)# Border #E2E8F0
    C_WHITE = RGBColor(255, 255, 255)
    C_AMBER = RGBColor(217, 119, 6)        # Amber #D97706
    C_AMBER_BG = RGBColor(254, 243, 199)   # Light Amber
    C_EMERALD_BG = RGBColor(236, 253, 245) # Light Emerald
    C_BLUE = RGBColor(37, 99, 235)         # Blue #2563EB

    def add_header(slide, tag_text, title_text, slide_num):
        # Top banner background
        bg_bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(1.15))
        bg_bar.fill.solid()
        bg_bar.fill.fore_color.rgb = C_NAVY
        bg_bar.line.fill.background()

        # Accent line under header
        line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(1.12), Inches(13.333), Inches(0.04))
        line.fill.solid()
        line.fill.fore_color.rgb = C_EMERALD
        line.line.fill.background()

        # Tag box
        tb_tag = slide.shapes.add_textbox(Inches(0.8), Inches(0.15), Inches(8), Inches(0.3))
        p_tag = tb_tag.text_frame.paragraphs[0]
        p_tag.text = tag_text.upper()
        p_tag.font.name = "Arial"
        p_tag.font.size = Pt(10)
        p_tag.font.bold = True
        p_tag.font.color.rgb = C_EMERALD

        # Title
        tb_title = slide.shapes.add_textbox(Inches(0.8), Inches(0.42), Inches(10), Inches(0.6))
        p_title = tb_title.text_frame.paragraphs[0]
        p_title.text = title_text
        p_title.font.name = "Arial"
        p_title.font.size = Pt(22)
        p_title.font.bold = True
        p_title.font.color.rgb = C_WHITE

        # Slide Number Badge
        tb_num = slide.shapes.add_textbox(Inches(11.2), Inches(0.35), Inches(1.4), Inches(0.5))
        p_num = tb_num.text_frame.paragraphs[0]
        p_num.text = f"{slide_num:02d} / 15"
        p_num.font.name = "Arial"
        p_num.font.size = Pt(13)
        p_num.font.bold = True
        p_num.alignment = PP_ALIGN.RIGHT
        p_num.font.color.rgb = RGBColor(148, 163, 184)

    def add_card(slide, left, top, width, height, title, items, badge="", bg_color=C_LIGHT_BG, border_color=C_CARD_BORDER, title_color=C_NAVY):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = bg_color
        card.line.color.rgb = border_color
        card.line.width = Pt(1.2)

        # Title & Badge
        tb = slide.shapes.add_textbox(left + Inches(0.2), top + Inches(0.18), width - Inches(0.4), height - Inches(0.3))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_top = 0
        tf.margin_bottom = 0
        tf.margin_left = 0
        tf.margin_right = 0

        p0 = tf.paragraphs[0]
        p0.text = title
        p0.font.name = "Arial"
        p0.font.size = Pt(14)
        p0.font.bold = True
        p0.font.color.rgb = title_color
        p0.space_after = Pt(8)

        if badge:
            p0.text = f"{title}   [{badge}]"

        for item in items:
            p = tf.add_paragraph()
            p.font.name = "Arial"
            p.font.size = Pt(11)
            p.font.color.rgb = C_SLATE
            p.space_after = Pt(5)
            
            # Check if has bold prefix
            if ":" in item:
                parts = item.split(":", 1)
                run1 = p.add_run()
                run1.text = "• " + parts[0].strip() + ": "
                run1.font.bold = True
                run1.font.color.rgb = C_NAVY
                
                run2 = p.add_run()
                run2.text = parts[1].strip()
            else:
                p.text = "• " + item

    def add_footer_note(slide, note_text):
        tb = slide.shapes.add_textbox(Inches(0.8), Inches(6.9), Inches(11.7), Inches(0.4))
        p = tb.text_frame.paragraphs[0]
        p.text = note_text
        p.font.name = "Arial"
        p.font.size = Pt(10)
        p.font.italic = True
        p.font.color.rgb = C_MUTED

    # ==========================================
    # SLIDE 1: Title Slide (Dark Theme)
    # ==========================================
    s1 = prs.slides.add_slide(blank_layout)
    bg1 = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5))
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = C_NAVY
    bg1.line.fill.background()

    # Top accent bar
    top_bar = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(0.15))
    top_bar.fill.solid()
    top_bar.fill.fore_color.rgb = C_EMERALD
    top_bar.line.fill.background()

    # Title text box
    tb_main = s1.shapes.add_textbox(Inches(1.0), Inches(1.2), Inches(11.3), Inches(2.2))
    p1 = tb_main.text_frame.paragraphs[0]
    p1.text = "FoodResQ"
    p1.font.name = "Arial"
    p1.font.size = Pt(48)
    p1.font.bold = True
    p1.font.color.rgb = C_WHITE
    p1.space_after = Pt(10)

    p2 = tb_main.text_frame.add_paragraph()
    p2.text = "Hyperlocal Real-Time Surplus Food Redistribution Platform"
    p2.font.name = "Arial"
    p2.font.size = Pt(22)
    p2.font.color.rgb = RGBColor(52, 211, 153) # emerald-400
    p2.space_after = Pt(12)

    p3 = tb_main.text_frame.add_paragraph()
    p3.text = "Bridging Urban Food Waste & Nutritional Insecurity via Full-Stack MERN Architecture"
    p3.font.name = "Arial"
    p3.font.size = Pt(14)
    p3.font.color.rgb = RGBColor(148, 163, 184)

    # 3 Meta cards on Slide 1
    m1 = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(4.0), Inches(3.6), Inches(2.2))
    m1.fill.solid()
    m1.fill.fore_color.rgb = RGBColor(30, 41, 59)
    m1.line.color.rgb = RGBColor(51, 65, 85)
    tf1 = m1.text_frame
    tf1.word_wrap = True
    p = tf1.paragraphs[0]
    p.text = "CORE ARCHITECTURE"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = RGBColor(52, 211, 153)
    p.space_after = Pt(8)
    for line in ["MERN Stack (MongoDB, Express, React, Node.js)", "React 18 + Vite 5 Frontend", "Express REST API on Node v22", "MongoDB Atlas Cloud Replica Database"]:
        p = tf1.add_paragraph()
        p.text = "• " + line
        p.font.size = Pt(10)
        p.font.color.rgb = RGBColor(226, 232, 240)
        p.space_after = Pt(4)

    m2 = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(4.85), Inches(4.0), Inches(3.6), Inches(2.2))
    m2.fill.solid()
    m2.fill.fore_color.rgb = RGBColor(30, 41, 59)
    m2.line.color.rgb = RGBColor(51, 65, 85)
    tf2 = m2.text_frame
    tf2.word_wrap = True
    p = tf2.paragraphs[0]
    p.text = "KEY PILLARS"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = RGBColor(251, 191, 36) # amber-400
    p.space_after = Pt(8)
    for line in ["Zero-Barrier Access for Hungry Seekers", "Symmetrical 3-Way Authentication Matrix", "GPS Reverse Geocoding with OpenStreetMap", "Verified NGO Bulk Rescue Command Center"]:
        p = tf2.add_paragraph()
        p.text = "• " + line
        p.font.size = Pt(10)
        p.font.color.rgb = RGBColor(226, 232, 240)
        p.space_after = Pt(4)

    m3 = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(8.7), Inches(4.0), Inches(3.6), Inches(2.2))
    m3.fill.solid()
    m3.fill.fore_color.rgb = RGBColor(30, 41, 59)
    m3.line.color.rgb = RGBColor(51, 65, 85)
    tf3 = m3.text_frame
    tf3.word_wrap = True
    p = tf3.paragraphs[0]
    p.text = "PROJECT METADATA"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = RGBColor(147, 197, 253) # blue-300
    p.space_after = Pt(8)
    for line in ["Developer / Presenter: Zahid", "Academic Viva & Project Defense", "Status: Production Ready & Deployed", "Domain: Social Good / Geo-Informatics"]:
        p = tf3.add_paragraph()
        p.text = "• " + line
        p.font.size = Pt(10)
        p.font.color.rgb = RGBColor(226, 232, 240)
        p.space_after = Pt(4)

    # ==========================================
    # SLIDE 2: Problem Statement & Motivation
    # ==========================================
    s2 = prs.slides.add_slide(blank_layout)
    add_header(s2, "Context & Motivation", "The Urban Paradox: Food Wastage vs Nutritional Insecurity", 2)
    add_card(s2, Inches(0.8), Inches(1.5), Inches(3.7), Inches(5.1), 
             "The Problem Statistics", [
                 "National Loss: Over 68+ million tonnes of edible food discarded annually in India.",
                 "Hunger Reality: 200+ million citizens suffer chronic malnutrition and food insecurity daily.",
                 "Commercial Waste: Banquet halls, caterers, and restaurants generate large surplus daily.",
                 "Time Decay: Cooked food degrades within 4-6 hours if not rapidly claimed.",
                 "Landfill Impact: Decomposing food generates massive methane emissions."
             ], badge="CRITICAL DATA", bg_color=C_AMBER_BG, border_color=C_AMBER, title_color=C_AMBER)

    add_card(s2, Inches(4.8), Inches(1.5), Inches(3.7), Inches(5.1), 
             "Failures of Existing Models", [
                 "High Friction Barriers: Many apps require complex signups, identity checks, and phone OTPs.",
                 "Excluded Demographics: Impoverished seekers lack tech literacy or digital credentials.",
                 "Delayed Response: Traditional NGO helplines take 12-24 hours to schedule volunteer pickup.",
                 "Opaque Location: Raw coordinates confuse users without human-readable street names.",
                 "Fragmented Info: Donors have no central portal to broadcast urgent surplus."
             ], badge="SYSTEM GAPS")

    add_card(s2, Inches(8.8), Inches(1.5), Inches(3.7), Inches(5.1), 
             "The FoodResQ Solution", [
                 "Zero-Barrier Access: Hungry seekers browse & find food with 0 logins or barrier.",
                 "Hyperlocal Discovery: Immediate GPS proximity matching within 1-5 km radial range.",
                 "Symmetrical Security: Verified NGO Darpan ID portal alongside donor dashboards.",
                 "Smart Reverse Geocoding: Automatically resolves GPS lat/lng to exact neighborhood.",
                 "Dynamic Expiry Engine: Real-time countdown prevents distribution of spoiled meals."
             ], badge="OUR APPROACH", bg_color=C_EMERALD_BG, border_color=C_EMERALD, title_color=C_EMERALD_DARK)
    add_footer_note(s2, "FoodResQ converts an urgent perishable logistics crisis into an automated, transparent hyperlocal coordination network.")

    # ==========================================
    # SLIDE 3: System Architecture & 3-Tier Blueprint
    # ==========================================
    s3 = prs.slides.add_slide(blank_layout)
    add_header(s3, "System Design", "Full-Stack 3-Tier Enterprise Architecture", 3)
    add_card(s3, Inches(0.8), Inches(1.5), Inches(3.7), Inches(5.1), 
             "Tier 1: Client Layer", [
                 "React 18 SPA: Component-driven reactive UI with virtual DOM efficiency.",
                 "Vite 5 Bundler: Ultra-fast module bundling and sub-second HMR updates.",
                 "Tailwind CSS v4: Modern utility-first styles with uniform form symmetry.",
                 "Leaflet.js Mapping: Interactive visual food map with dynamic pins.",
                 "FoodContext Store: Global state handling hybrid sync & auto-expiry.",
                 "Lucide Icons: Lightweight, scalable iconography across all views."
             ], badge="FRONTEND", bg_color=C_LIGHT_BG)

    add_card(s3, Inches(4.8), Inches(1.5), Inches(3.7), Inches(5.1), 
             "Tier 2: Application Layer", [
                 "Node.js v22 Engine: High-performance non-blocking asynchronous event loop.",
                 "Express.js Framework: Lightweight RESTful routing architecture.",
                 "CORS & Security: Cross-origin resource sharing middleware protection.",
                 "Reverse Geocode Proxy: Integrates with OpenStreetMap Nominatim API.",
                 "Controller Logic: Clean separation of routes, models, and business services.",
                 "Atomic State Handler: Prevents race conditions during simultaneous claims."
             ], badge="BACKEND API", bg_color=C_LIGHT_BG)

    add_card(s3, Inches(8.8), Inches(1.5), Inches(3.7), Inches(5.1), 
             "Tier 3: Data Layer", [
                 "MongoDB Atlas: Cloud-hosted multi-region distributed document database.",
                 "Mongoose 8 ODM: Strongly typed schemas, data casting, and validation.",
                 "Dynamic Sharding: Scalable horizontal clustering for high write loads.",
                 "Replica Sets: 99.99% high availability and automated failover guarantees.",
                 "Geospatial Indexing: Ready for 2dsphere indexing and spatial queries.",
                 "Dual-Mode Resilience: Instant localStorage fallback during offline periods."
             ], badge="DATABASE", bg_color=C_EMERALD_BG, border_color=C_EMERALD, title_color=C_EMERALD_DARK)
    add_footer_note(s3, "Decoupled 3-tier architecture allows independent frontend scaling and backend microservice migration without service interruption.")

    # ==========================================
    # SLIDE 4: Frontend Engineering & UI/UX Stack
    # ==========================================
    s4 = prs.slides.add_slide(blank_layout)
    add_header(s4, "Frontend Engineering", "Modern Reactive Client Architecture & UI Components", 4)
    add_card(s4, Inches(0.8), Inches(1.5), Inches(3.7), Inches(5.1), 
             "Core Technologies", [
                 "React 18.3: Leveraging concurrent rendering, functional components, and hooks.",
                 "Vite 5.4: Lightning-fast builds, instant Hot Module Replacement (HMR).",
                 "Tailwind CSS v4: Modern CSS architecture with semantic tokens and zero bloat.",
                 "Lucide React: Crisp vector icons for navigation, statuses, and badges.",
                 "Responsive Design: Fluid breakpoints across mobile phones, tablets, and desktops."
             ], badge="STACK SPEC")

    add_card(s4, Inches(4.8), Inches(1.5), Inches(3.7), Inches(5.1), 
             "UI/UX Architecture", [
                 "Zero-Barrier Navigation: Seekers discover listings directly from homepage.",
                 "Symmetrical Modals: Harmonized proportions across Login, Donor, and NGO cards.",
                 "Visual Urgency Badges: Color-coded freshness indicators (Fresh / Expiring Soon / Expired).",
                 "Interactive Leaflet Maps: High-performance canvas tile rendering without Google fees.",
                 "Toast Notifications: Instant feedback on food posting, claiming, and errors."
             ], badge="DESIGN SYSTEM")

    add_card(s4, Inches(8.8), Inches(1.5), Inches(3.7), Inches(5.1), 
             "State & Lifecycle Management", [
                 "FoodContext Provider: Centralized state eliminating prop-drilling across screens.",
                 "Custom Hooks: Clean consumption via useContext(FoodContext).",
                 "Dual Sync Engine: Fetches from MongoDB API on load, saves to localStorage cache.",
                 "Real-Time Timer: 1-minute interval heartbeat recalculating remaining shelf hours.",
                 "Optimistic Updates: UI reflects claimed food instantaneously prior to network ACK."
             ], badge="REACTIVE STATE", bg_color=C_EMERALD_BG, border_color=C_EMERALD, title_color=C_EMERALD_DARK)
    add_footer_note(s4, "Built with performance in mind: lightweight bundle footprint (<200KB gzip) enabling instant loading even on 3G cellular connections.")

    # ==========================================
    # SLIDE 5: Backend RESTful Service & API Layer
    # ==========================================
    s5 = prs.slides.add_slide(blank_layout)
    add_header(s5, "Backend Engineering", "Express.js RESTful API & High-Throughput Routing", 5)
    add_card(s5, Inches(0.8), Inches(1.5), Inches(3.7), Inches(5.1), 
             "Server Architecture", [
                 "Runtime Environment: Node.js v22 LTS with high-efficiency V8 JS engine.",
                 "Express 4.19 Framework: Robust HTTP routing and modular controllers.",
                 "Middleware Pipeline: Express JSON parser, CORS authorization, error capturer.",
                 "Environment Isolation: dotenv configures Atlas URIs, ports, and secret keys.",
                 "Database Heartbeat: Connection state monitoring with automated retry logic."
             ], badge="RUNTIME & CONFIG")

    add_card(s5, Inches(4.8), Inches(1.5), Inches(3.7), Inches(5.1), 
             "Complete API Inventory", [
                 "POST /api/auth/register: Create donor or verified NGO accounts.",
                 "POST /api/auth/login: Authenticate credentials and return role metadata.",
                 "GET /api/food: Fetch active surplus food listings with optional filters.",
                 "POST /api/food: Create new food post with GPS coordinates and expiry hours.",
                 "PUT /api/food/:id: Update food details or status.",
                 "POST /api/food/:id/claim: Atomic claim transaction for seekers or NGOs.",
                 "DELETE /api/food/:id: Delete or soft-remove surplus post.",
                 "GET /api/rescues: Fetch complete historical rescue logs for dashboards."
             ], badge="13 ENDPOINTS")

    add_card(s5, Inches(8.8), Inches(1.5), Inches(3.7), Inches(5.1), 
             "Reliability & Error Handling", [
                 "Atomic Conditional Updates: findOneAndUpdate prevents concurrent double-claims.",
                 "Standard Status Codes: 200 OK, 201 Created, 400 Bad Request, 404 Not Found, 409 Conflict.",
                 "Payload Sanitization: Validates email syntax, required fields, and enum types.",
                 "Structured Error Bodies: Consistent JSON error schemas for friendly UI alerts.",
                 "Graceful Shutdown: SIGTERM handlers cleanly close active database pools."
             ], badge="STABILITY", bg_color=C_EMERALD_BG, border_color=C_EMERALD, title_color=C_EMERALD_DARK)
    add_footer_note(s5, "REST endpoints adhere to standard stateless conventions, facilitating effortless horizontal scaling across cloud containers.")

    # ==========================================
    # SLIDE 6: Database Models & MongoDB Schemas
    # ==========================================
    s6 = prs.slides.add_slide(blank_layout)
    add_header(s6, "Data Architecture", "MongoDB Atlas Document Models & Mongoose Schemas", 6)
    add_card(s6, Inches(0.8), Inches(1.5), Inches(3.7), Inches(5.1), 
             "User Model & Roles", [
                 "name: String (Required, donor or organization name).",
                 "email: String (Unique index, trimmed, lowercase).",
                 "password: String (Hashed/secured auth credential).",
                 "role: Enum ['donor', 'ngo', 'admin'] (Default: 'donor').",
                 "darpanId: String (Government registration for NGOs).",
                 "phone: String (Contact number for pickup coordination).",
                 "address: String (Physical operational base address).",
                 "verified: Boolean (Flag for verified NGO status)."
             ], badge="USER SCHEMA")

    add_card(s6, Inches(4.8), Inches(1.5), Inches(3.7), Inches(5.1), 
             "FoodPost Model", [
                 "title & description: Food item overview and notes.",
                 "quantity: Number of meals/servings available.",
                 "foodType: Enum ['Cooked Food', 'Raw Grocery', 'Packaged Food'].",
                 "dietType: Enum ['Veg', 'Non-Veg', 'Vegan'].",
                 "location: Object { lat, lng, address } for GIS mapping.",
                 "expiryHours: Duration until perishable spoil.",
                 "status: Enum ['available', 'claimed', 'expired'].",
                 "donorId: Reference to posting user.",
                 "claimedBy: Reference to claiming NGO/seeker."
             ], badge="FOODPOST SCHEMA", bg_color=C_EMERALD_BG, border_color=C_EMERALD, title_color=C_EMERALD_DARK)

    add_card(s6, Inches(8.8), Inches(1.5), Inches(3.7), Inches(5.1), 
             "RescueHistory & Reviews", [
                 "RescueHistory Model:",
                 "  • foodPostId: Ref to original FoodPost.",
                 "  • donorId & ngoId: Refs to involved parties.",
                 "  • claimTime & completionTime: Timestamps.",
                 "  • status: ['claimed', 'picked_up', 'distributed'].",
                 "Review Model:",
                 "  • rating: Number (1 to 5 stars).",
                 "  • comment: Feedback on food condition.",
                 "  • targetUserId: Builds accountability & trust score."
             ], badge="AUDIT & RATINGS")
    add_footer_note(s6, "Mongoose schemas enforce strict business constraints while preserving MongoDB's native JSON document retrieval speed.")

    # ==========================================
    # SLIDE 7: Geolocation, Mapping & Reverse Geocoding
    # ==========================================
    s7 = prs.slides.add_slide(blank_layout)
    add_header(s7, "Geospatial Intelligence", "Geolocation, Leaflet Mapping & OpenStreetMap Pipeline", 7)
    add_card(s7, Inches(0.8), Inches(1.5), Inches(3.7), Inches(5.1), 
             "GPS Coordinate Capture", [
                 "Browser API: navigator.geolocation.getCurrentPosition() with high accuracy.",
                 "Permission Handling: Intuitive UI prompt with fallback to manual address input.",
                 "Precision Coordinates: Captures latitude and longitude with sub-meter accuracy.",
                 "Real-Time Pinning: Places precise user position marker on the Leaflet canvas.",
                 "Zero Vendor Lock-in: Runs on standard browser standards without proprietary SDKs."
             ], badge="CLIENT GPS")

    add_card(s7, Inches(4.8), Inches(1.5), Inches(3.7), Inches(5.1), 
             "Smart Reverse Geocoding", [
                 "The Dilemma: Raw coordinates (12.9716, 77.5946) confuse donors and seekers.",
                 "Nominatim Engine: Queries OpenStreetMap reverse geocoding REST service.",
                 "Structured Parsing: Extracts road, suburb, neighbourhood, city, and pincode.",
                 "Human-Readable Result: Formats clean string: 'Indiranagar, Bengaluru'.",
                 "Graceful Resilience: If offline, seamlessly defaults to formatted coordinates."
             ], badge="REVERSE GEOCODER", bg_color=C_EMERALD_BG, border_color=C_EMERALD, title_color=C_EMERALD_DARK)

    add_card(s7, Inches(8.8), Inches(1.5), Inches(3.7), Inches(5.1), 
             "Leaflet & Spatial Proximity", [
                 "Interactive Canvas: Smooth panning, zooming, and cluster pin interactions.",
                 "Custom Markers: Color-coded pins for Veg (Green), Non-Veg (Red), and Urgent (Amber).",
                 "Popup Overlays: Shows food title, quantity, distance, and direct claim button.",
                 "Haversine Formula: Calculates radial geographic distance in kilometers.",
                 "Hyperlocal Filter: Seekers sort available surplus from closest to farthest."
             ], badge="SPATIAL MAPPING")
    add_footer_note(s7, "Solving the location challenge: automated reverse geocoding transforms abstract GPS numbers into actionable street-level pickup instructions.")

    # ==========================================
    # SLIDE 8: Symmetrical 3-Way Authentication Matrix
    # ==========================================
    s8 = prs.slides.add_slide(blank_layout)
    add_header(s8, "Security & Identity", "Symmetrical 3-Way Authentication Matrix & RBAC", 8)
    add_card(s8, Inches(0.8), Inches(1.5), Inches(3.7), Inches(5.1), 
             "Unified Sign In Card", [
                 "Visual Symmetry: Perfectly balanced card dimensions matching registration views.",
                 "Credentials: Email and password with real-time field validation.",
                 "Role Detection: Automatically routes Donors to Donor Hub and NGOs to Command Center.",
                 "One-Click Demo Button: Instantly logs in sample donor for viva/demo testing.",
                 "State Persistence: Remembers active session in authenticated app state."
             ], badge="SIGN IN MODAL")

    add_card(s8, Inches(4.8), Inches(1.5), Inches(3.7), Inches(5.1), 
             "Donor Registration Card", [
                 "Audience: Restaurants, banquet halls, caterers, and private citizens.",
                 "Required Fields: Organization/Full Name, verified Email, Password, Phone.",
                 "Location Capture: Default pickup address for faster future post creation.",
                 "Instant Activation: Immediate access to post surplus food right after register.",
                 "Harmonized Inputs: Identical padding, border-radius, and focus ring states."
             ], badge="DONOR SIGNUP")

    add_card(s8, Inches(8.8), Inches(1.5), Inches(3.7), Inches(5.1), 
             "NGO Registration Card", [
                 "Audience: Non-governmental organizations, food rescue foundations, shelters.",
                 "Darpan Verification: Mandates NGO Darpan ID / FCRA number for legitimacy.",
                 "Logistics Scope: Fleet capacity and emergency contact for bulk rescue.",
                 "Anti-Fraud Guard: Prevents fake accounts from monopolizing public food relief.",
                 "Command Center Access: Unlocks SOS Bulk Claim feed upon authentication."
             ], badge="VERIFIED NGO", bg_color=C_EMERALD_BG, border_color=C_EMERALD, title_color=C_EMERALD_DARK)
    add_footer_note(s8, "Form symmetry ensures visual elegance while Role-Based Access Control (RBAC) guarantees organizational accountability.")

    # ==========================================
    # SLIDE 9: Donor Operations Lifecycle & Dashboard
    # ==========================================
    s9 = prs.slides.add_slide(blank_layout)
    add_header(s9, "Donor Operations", "Donor Experience, Post Creation & Real-Time Tracking", 9)
    add_card(s9, Inches(0.8), Inches(1.5), Inches(3.7), Inches(5.1), 
             "The 4-Step Donor Journey", [
                 "1. Quick Access: Click 'Post Surplus Food' button from header or dashboard.",
                 "2. GPS Auto-Fill: Single click detects current location & reverse-geocodes address.",
                 "3. Detail Entry: Specify servings, dietary type, preparation time, and shelf life.",
                 "4. Broadcast: Instantly publishes post to live map, seeker feed, and NGO SOS portal."
             ], badge="POSTING WORKFLOW")

    add_card(s9, Inches(4.8), Inches(1.5), Inches(3.7), Inches(5.1), 
             "Active Listings Management", [
                 "Status Indicators: Real-time badge shows 'Available' or 'Claimed'.",
                 "Claim Alerts: Notifies donor immediately when an NGO or seeker claims the food.",
                 "Contact Card: Displays claiming NGO name, phone number, and pickup vehicle details.",
                 "Handover Confirmation: One-click status update marking item as 'Handed Over'.",
                 "Expiry Safeguard: Automatic warning when post is within 1 hour of expiration."
             ], badge="ACTIVE POSTINGS", bg_color=C_EMERALD_BG, border_color=C_EMERALD, title_color=C_EMERALD_DARK)

    add_card(s9, Inches(8.8), Inches(1.5), Inches(3.7), Inches(5.1), 
             "Impact Analytics & History", [
                 "Cumulative Metrics: Total meals donated, kilograms rescued, and families fed.",
                 "Carbon Offset Score: Visual metric showing CO2 emissions avoided by saving food.",
                 "Historical Archive: Complete searchable audit log of past successful donations.",
                 "Community Ratings: Reviews received from recipient shelters and NGOs.",
                 "Account Management: Clean logout button and profile update controls."
             ], badge="IMPACT LOGS")
    add_footer_note(s9, "Donors experience zero administrative burden: an intuitive 30-second posting flow converts kitchen surplus into community nourishment.")

    # ==========================================
    # SLIDE 10: NGO Command Center & Bulk Rescue Logistics
    # ==========================================
    s10 = prs.slides.add_slide(blank_layout)
    add_header(s10, "NGO Operations", "NGO Command Center & Bulk Logistics Pipeline", 10)
    add_card(s10, Inches(0.8), Inches(1.5), Inches(3.7), Inches(5.1), 
             "Darpan Verification", [
                 "Regulatory Compliance: Verifies registered non-profit standing via Darpan ID.",
                 "Accountability Tier: Prevents commercial resale or misuse of donated food.",
                 "Verified Badge: Displays trust mark on all communication with donors.",
                 "Direct Dispatch Access: Unlocks high-capacity transport coordination tools.",
                 "Fleet Readiness: Allows entering rescue vehicle count and volunteer capacity."
             ], badge="TRUST PROTOCOL")

    add_card(s10, Inches(4.8), Inches(1.5), Inches(3.7), Inches(5.1), 
             "SOS Bulk Surplus Feed", [
                 "Priority Filtering: Aggregates large-quantity postings (50+ to 500+ meals).",
                 "Urgency Sort: Ranks listings by nearest expiration deadline.",
                 "One-Click Claim Lock: Atomically locks listing to prevent duplicate claims.",
                 "Pickup Navigation: Launches turn-by-turn route directions to donor location.",
                 "Direct Communication: Provides direct phone call button to donor kitchen."
             ], badge="COMMAND CENTER", bg_color=C_EMERALD_BG, border_color=C_EMERALD, title_color=C_EMERALD_DARK)

    add_card(s10, Inches(8.8), Inches(1.5), Inches(3.7), Inches(5.1), 
             "Rescue Lifecycle Tracking", [
                 "Stage 1 - Claimed: Donor alerted, pickup team assigned.",
                 "Stage 2 - En Route: Transit team traveling to food donor location.",
                 "Stage 3 - Picked Up: Food inspected, loaded, and in transit to shelter.",
                 "Stage 4 - Distributed: Meals served to vulnerable families; record archived.",
                 "Impact Scorecard: Real-time dashboard tallying total rescued kilograms."
             ], badge="DISPATCH PIPELINE")
    add_footer_note(s10, "Equips non-profits with enterprise-grade logistics tools to rescue hundreds of meals from weddings and conventions before spoilage.")

    # ==========================================
    # SLIDE 11: Seeker Zero-Barrier Experience & Localization
    # ==========================================
    s11 = prs.slides.add_slide(blank_layout)
    add_header(s11, "Social Inclusion", "Zero-Barrier Seeker Access & Bilingual Localization", 11)
    add_card(s11, Inches(0.8), Inches(1.5), Inches(3.7), Inches(5.1), 
             "Zero-Barrier Access Ethics", [
                 "Dignity by Design: Hungry citizens browse and find food without creating an account.",
                 "Overcoming Digital Divide: No passwords, email verification, or Aadhaar required.",
                 "Public Transparency: Available meals displayed directly on the home discovery feed.",
                 "One-Tap Directions: Instant link to navigation or donor phone call.",
                 "Universal Compatibility: Functions on basic smartphones and mobile browsers."
             ], badge="INCLUSIVE UX", bg_color=C_EMERALD_BG, border_color=C_EMERALD, title_color=C_EMERALD_DARK)

    add_card(s11, Inches(4.8), Inches(1.5), Inches(3.7), Inches(5.1), 
             "Hyperlocal Filtering Tools", [
                 "Proximity Sorting: Surfaces food postings closest to seeker's current GPS location.",
                 "Dietary Classification: Filter by Pure Vegetarian, Non-Veg, or Vegan.",
                 "Food Category Pills: Fast toggle between Cooked Food, Raw Groceries, and Snacks.",
                 "Freshness Indicators: Visual countdown timer showing hours remaining.",
                 "Portion Quantities: Clearly shows exact available meal count (e.g., '15 Meals')."
             ], badge="DISCOVERY FILTERS")

    add_card(s11, Inches(8.8), Inches(1.5), Inches(3.7), Inches(5.1), 
             "Bilingual i18n Engine", [
                 "Dual Language Support: Instant one-click toggle between English and Hindi (हिंदी).",
                 "Context-Aware Translation: Translates UI labels, category names, and status alerts.",
                 "Local Demographic Reach: Ensures non-English speakers navigate with ease.",
                 "Extensible Architecture: Language dictionaries structured for adding regional tongues.",
                 "Persistent Preference: Remembers language choice in client browser storage."
             ], badge="LOCALIZATION")
    add_footer_note(s11, "Eliminating technological and linguistic barriers guarantees that food reaches those who need it most with speed and dignity.")

    # ==========================================
    # SLIDE 12: Real-Time Dynamic Expiry & Resilience
    # ==========================================
    s12 = prs.slides.add_slide(blank_layout)
    add_header(s12, "System Resilience", "Dynamic Expiry Engine & Dual-Mode State Synchronization", 12)
    add_card(s12, Inches(0.8), Inches(1.5), Inches(3.7), Inches(5.1), 
             "Dynamic Expiry Engine", [
                 "The Perishable Risk: Serving expired food can cause severe foodborne illnesses.",
                 "Timestamp Computation: createdAt + (expiryHours * 3600000) determines expiry deadline.",
                 "Heartbeat Interval: Client recalculates remaining minutes on a 60-second timer.",
                 "Automated Invalidation: Once timer reaches 0, post switches to 'Expired' automatically.",
                 "Safety Visuals: Color shifts from green (>3h) to amber (1-3h) to red (<1h)."
             ], badge="FOOD SAFETY", bg_color=C_AMBER_BG, border_color=C_AMBER, title_color=C_AMBER)

    add_card(s12, Inches(4.8), Inches(1.5), Inches(3.7), Inches(5.1), 
             "Dual-Mode State Sync", [
                 "Primary Tier: Real-time REST communication with live MongoDB Atlas cloud cluster.",
                 "Secondary Fallback: Automatic offline caching in browser localStorage.",
                 "Seamless Recovery: If backend disconnects, app continues operating seamlessly.",
                 "Data Reconciliation: Automatically resyncs local posts upon backend reconnection.",
                 "Optimistic UI Updates: User actions reflect instantly on screen without lag."
             ], badge="OFFLINE RESILIENCE", bg_color=C_EMERALD_BG, border_color=C_EMERALD, title_color=C_EMERALD_DARK)

    add_card(s12, Inches(8.8), Inches(1.5), Inches(3.7), Inches(5.1), 
             "Performance Optimization", [
                 "React Memoization: useMemo prevents redundant recalculation of distances and filters.",
                 "Lazy Asset Loading: Leaflet map tiles render on demand to preserve bandwidth.",
                 "Lightweight Dependencies: Zero bloated state libraries; clean native Context API.",
                 "High Efficiency Queries: Indexed MongoDB lookups ensure sub-20ms query responses.",
                 "Vite Production Minification: Bundled assets optimized for rapid mobile load."
             ], badge="PERFORMANCE")
    add_footer_note(s12, "Combining real-time expiry tracking with resilient offline fallbacks guarantees food safety without sacrificing system reliability.")

    # ==========================================
    # SLIDE 13: Technical Challenges & Key Innovations
    # ==========================================
    s13 = prs.slides.add_slide(blank_layout)
    add_header(s13, "Engineering Challenges", "Technical Hurdles Overcome & Key Innovations", 13)
    add_card(s13, Inches(0.8), Inches(1.5), Inches(3.7), Inches(5.1), 
             "Challenge 1: Geocoding", [
                 "The Problem: GPS coordinates alone are unreadable by regular citizens.",
                 "Our Solution: Integrated OpenStreetMap Nominatim reverse geocoding pipeline.",
                 "Innovation: Automatically queries API on GPS detect and injects street/city address.",
                 "Fallback: Formatted GPS string fallback ensures zero form submission blocking.",
                 "Result: 100% address clarity for drivers and volunteers."
             ], badge="GEO CODING", bg_color=C_EMERALD_BG, border_color=C_EMERALD, title_color=C_EMERALD_DARK)

    add_card(s13, Inches(4.8), Inches(1.5), Inches(3.7), Inches(5.1), 
             "Challenge 2: Form Symmetry", [
                 "The Problem: Sign In, Donor, and NGO forms had mismatched sizes and messy UI shifts.",
                 "Our Solution: Re-engineered all 3 auth interfaces into a unified geometric matrix.",
                 "Innovation: Standardized modal widths, padding tokens, and field styling.",
                 "UX Win: Smooth tabs, zero modal jumping, and clean role-switching.",
                 "Result: Enterprise aesthetic matching top-tier commercial web apps."
             ], badge="UI HARMONY")

    add_card(s13, Inches(8.8), Inches(1.5), Inches(3.7), Inches(5.1), 
             "Challenge 3: Cloud Database", [
                 "The Problem: Local memory state was lost on every server restart.",
                 "Our Solution: Seamlessly migrated to production MongoDB Atlas Cloud Replica cluster.",
                 "Innovation: Created strongly typed Mongoose schemas with dual-mode sync.",
                 "Data Safety: Seeded demo data ensures one-click testing without setup.",
                 "Result: Full persistent storage accessible from anywhere."
             ], badge="CLOUD DB")
    add_footer_note(s13, "Rigorous engineering discipline turned real-world integration hurdles into reliable, user-friendly production features.")

    # ==========================================
    # SLIDE 14: Future Roadmap & Scalability Vision
    # ==========================================
    s14 = prs.slides.add_slide(blank_layout)
    add_header(s14, "Future Roadmap", "Enterprise Scaling, AI Verification & Commercial Integrations", 14)
    add_card(s14, Inches(0.8), Inches(1.5), Inches(3.7), Inches(5.1), 
             "Commercial Food APIs", [
                 "Swiggy & Zomato Webhooks: Ingest cancelled orders and restaurant end-of-day surplus.",
                 "Quick-Commerce Rescue: Connect with Blinkit/Zepto dark stores for unblemished produce.",
                 "Supermarket Feeds: Automate bulk donations of goods approaching 'Best Before' dates.",
                 "Standardized Protocol: Open Food Rescue JSON schema for third-party donor integrations.",
                 "Tax Exemption Automation: Generates digital 80G tax exemption receipts for donors."
             ], badge="API INTEGRATION")

    add_card(s14, Inches(4.8), Inches(1.5), Inches(3.7), Inches(5.1), 
             "Cold-Chain Logistics Routing", [
                 "Multi-Stop Route Optimizer: Dijkstra / A* routing algorithm for NGO rescue vans.",
                 "Dynamic Batching: Clusters multiple small donations along a single transit corridor.",
                 "IoT Temperature Monitoring: Cold-chain sensor telemetry logged via MQTT/WebSockets.",
                 "Volunteer Dispatch PWA: Progressive Web App for field volunteers with offline maps.",
                 "Automated ETA Alerts: Real-time GPS tracking for food recipient shelters."
             ], badge="OPTIMAL LOGISTICS", bg_color=C_EMERALD_BG, border_color=C_EMERALD, title_color=C_EMERALD_DARK)

    add_card(s14, Inches(8.8), Inches(1.5), Inches(3.7), Inches(5.1), 
             "AI Vision & Omnichannel", [
                 "AI Freshness Verification: Gemini Vision API analyzes food photos to check packaging.",
                 "Automated Spoilage Warning: Vision model detects broken seals or discoloration.",
                 "Twilio SMS & WhatsApp: Pushes urgent food alerts to community volunteers without data plans.",
                 "Voice Assist Navigation: Audio guidance in local dialects for low-literacy users.",
                 "Decentralized Verification: Cryptographic proof-of-distribution on public ledger."
             ], badge="AI & TELEPHONY")
    add_footer_note(s14, "FoodResQ's scalable architecture is primed to evolve from a local community tool into a national automated food rescue infrastructure.")

    # ==========================================
    # SLIDE 15: Conclusion, Project Impact & Q&A
    # ==========================================
    s15 = prs.slides.add_slide(blank_layout)
    bg15 = s15.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5))
    bg15.fill.solid()
    bg15.fill.fore_color.rgb = C_NAVY
    bg15.line.fill.background()

    # Top accent bar
    top_bar15 = s15.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(0.15))
    top_bar15.fill.solid()
    top_bar15.fill.fore_color.rgb = C_EMERALD
    top_bar15.line.fill.background()

    # Header text
    tb_c = s15.shapes.add_textbox(Inches(1.0), Inches(0.8), Inches(11.3), Inches(1.5))
    pc1 = tb_c.text_frame.paragraphs[0]
    pc1.text = "FoodResQ — Project Summary & Viva Defense"
    pc1.font.name = "Arial"
    pc1.font.size = Pt(32)
    pc1.font.bold = True
    pc1.font.color.rgb = C_WHITE
    pc1.space_after = Pt(6)

    pc2 = tb_c.text_frame.add_paragraph()
    pc2.text = "A Complete, Production-Ready MERN Engineering Solution for Social Impact"
    pc2.font.name = "Arial"
    pc2.font.size = Pt(16)
    pc2.font.color.rgb = RGBColor(52, 211, 153)

    # 3 Summary Cards
    sc1 = s15.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(2.6), Inches(3.6), Inches(3.5))
    sc1.fill.solid()
    sc1.fill.fore_color.rgb = RGBColor(30, 41, 59)
    sc1.line.color.rgb = RGBColor(51, 65, 85)
    tfc1 = sc1.text_frame
    tfc1.word_wrap = True
    p = tfc1.paragraphs[0]
    p.text = "ACCOMPLISHMENTS"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = RGBColor(52, 211, 153)
    p.space_after = Pt(10)
    for line in [
        "Fully implemented MERN 3-tier system.",
        "Zero-barrier access for vulnerable seekers.",
        "GPS auto-detection & reverse geocoding.",
        "Symmetrical 3-way auth with Darpan ID.",
        "Live MongoDB Atlas cloud database.",
        "Real-time countdown & auto-expiry engine."
    ]:
        p = tfc1.add_paragraph()
        p.text = "✔ " + line
        p.font.size = Pt(11)
        p.font.color.rgb = RGBColor(226, 232, 240)
        p.space_after = Pt(6)

    sc2 = s15.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(4.85), Inches(2.6), Inches(3.6), Inches(3.5))
    sc2.fill.solid()
    sc2.fill.fore_color.rgb = RGBColor(30, 41, 59)
    sc2.line.color.rgb = RGBColor(51, 65, 85)
    tfc2 = sc2.text_frame
    tfc2.word_wrap = True
    p = tfc2.paragraphs[0]
    p.text = "SYSTEM METRICS"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = RGBColor(251, 191, 36)
    p.space_after = Pt(10)
    for line in [
        "13 RESTful API endpoints active.",
        "Sub-1-second GPS location resolution.",
        "Sub-20ms database query latency.",
        "100% responsive cross-device layout.",
        "Zero third-party proprietary mapping fees.",
        "English + Hindi bilingual localization."
    ]:
        p = tfc2.add_paragraph()
        p.text = "⚡ " + line
        p.font.size = Pt(11)
        p.font.color.rgb = RGBColor(226, 232, 240)
        p.space_after = Pt(6)

    sc3 = s15.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(8.7), Inches(2.6), Inches(3.6), Inches(3.5))
    sc3.fill.solid()
    sc3.fill.fore_color.rgb = RGBColor(30, 41, 59)
    sc3.line.color.rgb = RGBColor(51, 65, 85)
    tfc3 = sc3.text_frame
    tfc3.word_wrap = True
    p = tfc3.paragraphs[0]
    p.text = "OPEN FOR QUESTIONS"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = RGBColor(147, 197, 253)
    p.space_after = Pt(10)
    p = tfc3.add_paragraph()
    p.text = "Thank You!"
    p.font.size = Pt(22)
    p.font.bold = True
    p.font.color.rgb = C_WHITE
    p.space_after = Pt(8)
    for line in [
        "Demonstration ready: Live app & API.",
        "Ready to explain code implementation.",
        "Ready to discuss architectural trade-offs.",
        "Presenter: Zahid | Year: 2026"
    ]:
        p = tfc3.add_paragraph()
        p.text = "• " + line
        p.font.size = Pt(11)
        p.font.color.rgb = RGBColor(203, 213, 225)
        p.space_after = Pt(5)

    # Save presentation
    output_path = os.path.abspath("FoodResQ_Project_Presentation.pptx")
    prs.save(output_path)
    print(f"Presentation saved successfully to: {output_path}")

if __name__ == "__main__":
    create_deck()
