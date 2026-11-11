# Virtual Front Desk: verified product facts

Use this file as the single source of truth for product claims. Every fact
below was checked against virtualfrontdesk.com and help.virtualfrontdesk.com
in November 2026. If an interview answer contradicts this file, trust this
file and flag the conflict to the user. If a claim appears in neither, leave
it out or flag it as "needs verification" in the hand-off notes.

Re-verify anything that has a price, a plan name, a license or a number
before publishing. Product facts move.

## Company

- Name: **Virtual Front Desk** (registered trademark). Always written in full
  in article body copy. "VFD" is internal shorthand only.
- Founded 2018 in Montreal, Canada, by Jeff Letendre (CEO and Founder) and
  Robert Brouillette.
- 1M+ video calls made, 35+ countries, 4+ data centers, 100% in-house team.
- Blog author of record: **Jeff Letendre, CEO and Founder**. (The interview
  drafts list him as "Head of Customer Success". That title is wrong.)
- Tagline: **"AI when it can, human when needed."**
- Positioning line: "AI Reception & Visitor Management Software with Live
  Video Built In."
- Core idea: technology removes the desk, not the person behind it. Every
  visitor can still reach a real member of the team.
- Does not sell hardware. Recommends devices. Authorized reseller of the
  Neat Frame floor stand.

## What a station is

- A **station** is the tablet, kiosk or screen visitors use. It runs the
  Virtual Front Desk web app in the browser. Nothing to install.
- Connect a device by opening `station.virtualfrontdesk.com` and entering a
  one-time connection code. A first station can be live in minutes.
- Supported: **Neat Frame (recommended)**, Neat Board, iPad, Android tablets,
  Windows PCs / all-in-ones, large kiosks, Elo Touch, outdoor stations.
  Neat Bar and Neat Pad are **not** supported.
- Why Neat Frame: all-in-one touchscreen, locks into kiosk mode
  automatically, can be managed remotely.
- A **location** is a building or address with one or more stations. One
  account manages many locations.
- **Buttons** on the welcome screen. Button actions: Video call group, Video
  call user, Video call station, Phone call, SMS & email, iFrame, PDF, QR
  code, Visitor sign-in, Sign out. Each button can have its own schedule.
- **Office hours** (all plans): outside them the station shows a closed
  screen and hides its buttons. Close now / Open now overrides.
- Inactivity timeout returns the station to the welcome screen (300 s
  default).
- Translator: visitors switch the station language from the welcome screen.
  Texts written in English are translated automatically and can be edited.

## Plans and pricing (per active station)

| Plan | Monthly | With prepaid credit |
|---|---|---|
| Essential | $29 | $22 |
| Professional | $49 + $0.07 per video call, 5 users included then $7/user, $7 per extra group | $37 |
| Enterprise | $109, unlimited video calls, users and groups | $82 |

- 30-day free trial on the Enterprise plan for every new account. Monthly,
  no contracts, cancel anytime.
- Prepaid credit ("annual plan"): $500+ gets a 20% bonus, $1,000+ gets 25%.
- **Essential** = visitor sign-in, SMS and email notifications, 1 user.
  **No video calls.**
- **Professional adds**: video calls, phone calls, Microsoft Teams
  integration, station status / call back, QR codes and PDF display,
  branding, send PDF to screen live, call hours, API.
- **Enterprise adds**: live monitoring / streaming, call queues, Azure
  (Entra ID) employee directory, remove VFD logo, badge and document
  printing, clock in/out, digital scanner, Stripe payment terminal.
- **AI Agent add-on**, any plan: $9.99/month per station using it, plus
  $0.10 per minute of conversation.
- Available on all plans: Outlook add-in, Google Calendar add-on, Slack,
  WhatsApp, Okta SSO, office hours, Express sign-in / pre-registration.

## Visitor sign-in

- Custom sign-in forms. **Full name is the only mandatory field.**
- Options per form: selfie, ID card photo (front and back with the station
  camera), PDFs to read and sign (NDA, safety rules), iFrame with an online
  form (Jotform, Microsoft Forms, Google Forms) for dropdowns or conditional
  questions, sign-out, visitor badge, emergency message, email summaries.
- Native form fields do not support dropdowns or conditional logic.
- USB and Bluetooth ID scanners are not supported.
- After sign-in the host is notified by video call, phone call, SMS or email,
  depending on each user's settings and the plan. Microsoft Teams users get
  the call in Teams.
- If only one host is offered, the visitor skips host selection.
- **Sign-out**: visitor taps Sign out, types the first letters of their name,
  picks it from the list. Admins can sign out a visitor who forgot.
- **Visitor badge** (Enterprise): prints automatically at the end of sign-in.
  Header text, up to three form fields, footer, logo, selfie, date and time.

## Pre-registration and Express sign-in

- Turn on Pre-registration in the sign-in form's Options tab.
- Invite from the dashboard (single or **bulk invitations**), the **Outlook
  add-in** (admin installs once from the Microsoft 365 admin center; Outlook
  calendar only, not the Teams calendar) or the **Google Calendar add-on**
  (from a saved event). Any host can send invitations from their calendar
  without opening the dashboard.
- Invitation by email, SMS or both. Visitor completes the form on their own
  phone or computer (questions, selfie, ID photos, signatures).
- Visitor receives a **QR code and a 4-digit code**. At the station: "I have
  a QR code" and scan, or type the 4-digit code.
- After Express sign-in the badge prints (Enterprise) and the host is
  notified, exactly as if the form was filled in at the station.
- QR codes are single-use (source: founder interview).
- Lost code: the visitor signs in like a walk-in.
- Status tracking: Pending, Pre-Registered, Completed. Pre-registration logs
  show invitations sent, arrivals, no-shows, visits still scheduled.

## History, records and emergency

- History has six logs: Call logs, Other actions, Sign-in logs,
  Pre-registration logs, Transaction logs, AI conversations. Search,
  filters, Export All.
- Sign-in logs: photo, location, name, email, host, form, date and time,
  answers, signed documents, selfie. Download each record.
- Signed PDFs stored with the visit record.
- Retention: **12 months by default**, then deleted automatically. The
  retention period is an organization setting (Settings > Features >
  Auto-delete visitor history) and support can extend it.
- **Emergency message**: SMS to every visitor who signed in today, has not
  signed out, gave a mobile number, and used a form with Emergency message
  turned on. Only owners, admins and managers can send. Templates, choice of
  locations, test send to own phone.
- Roles: owner, admin, manager, user. Users only see the locations they have
  access to.

## Video reception and live calls

- Visitor taps a button, the station places a live video call. Answer from
  the web dashboard, the iOS or Android app, Microsoft Teams, or a WhatsApp
  video-call link.
- Video calls: Professional and Enterprise only.
- **Group call modes**: Broadcast (everyone rings, first to answer takes it),
  List (visitor picks a person from the group), Queue (members ring one
  after another, 30 s each by default).
- **Call forwarding**: if no one answers (30 s default), the call goes to the
  group's phone number or the user's mobile/landline. Phone-only groups
  build department submenus.
- **Call hours** per user (Professional, Enterprise).
- **In-call tools**: ID capture, digital scanner (visitor's own phone,
  Enterprise), send PDF or iFrame to the screen for signature, send to
  printer (Enterprise), screenshots, QR codes, one-way chat, hold, share
  screen, switch between calls, Quick Access, Stripe POS payments
  (Enterprise), **live translated closed captions**.
- Everything captured in a call is saved in History > Call logs.
- **Live monitoring** (Enterprise): low-resolution, video-only feed of the
  lobby, no audio, never recorded, 3 to 4 seconds behind. Monitor as many
  stations as you like; **four feeds on screen at once**. Start a call from
  the feed in one click.
- Calls are **never recorded**. Video calls are live only.
- Virtual Front Desk does **not** supply receptionists. Calls go to the
  customer's own staff or a reception service they already use.

## Microsoft Teams

- Station calls can ring a user, a Teams call queue or an auto attendant in
  Teams desktop or mobile. Users who answer in Teams never need to sign in
  to Virtual Front Desk.
- **Licensing (Microsoft requirement)**: a Teams Phone calling plan assigned
  to the Microsoft administrator, and a **Teams Phone Standard** license for
  every other user who answers video calls in Teams.
- IT setup: external access for the Virtual Front Desk Azure Communication
  Services resource, Enterprise Voice on for answering users, connect
  Microsoft Entra ID (admin consent; full directory or only selected
  groups), import users. Some settings take up to 24 hours.
- Only users imported from Entra ID can receive calls in Teams.
- **SMS for Microsoft Teams**: a text notification in Teams through the
  "Virtual Front Desk SMS" app. No extra Microsoft licenses. Leave "Teams
  video call" off for those users or calls fail.
- Groups with Teams users: Queue or List only (no Broadcast). A group can't
  mix Teams answerers and dashboard answerers.
- Teams call queues and auto attendants: create in the Teams admin center,
  import like a user, flag as call queue / auto attendant. Needs a resource
  account with the free Teams Phone Resource Account license; turn on
  conference mode for call queues. Auto attendants are audio only.
  Recommendation: **call queue for most station buttons**.
- **Limitation**: calls answered in Teams don't include Virtual Front Desk
  call tools (ID capture, screenshots, PDFs to screen or printer, payments,
  QR codes). Live translated captions do work in Teams calls.
- Microsoft ended support for Teams Displays on September 3, 2025. Virtual
  Front Desk is positioned as the replacement.
- Entra ID group sync for an on-station employee directory: Enterprise.

## Other integrations

- **Slack** (all plans): direct message, optionally a channel, with the
  station, location and button pressed.
- **WhatsApp** (all plans): text alert or a video-call link to answer the
  station from WhatsApp.
- **Okta**, Microsoft, Google and Apple SSO.
- **API** (Professional and Enterprise).
- **Stripe Terminal** (Enterprise): VFD never stores card data.

## AI Agent (AI receptionist)

- Names: help center calls it the **AI Agent**; the website markets it as
  the **AI Receptionist** and **Virtual Front Desk Intelligence**. In
  articles: "the Virtual Front Desk AI Agent" on first mention, "the AI
  Agent" after.
- Greets a visitor who steps up to the station (detects someone in front of
  the camera). Voice conversation; the conversation shows as chat bubbles on
  screen. Visitors speak, they don't type.
- Knows every button on its station and the location address by default.
  Can press buttons itself (start sign-in, place a call).
- Learns the place from a **context file** (Markdown, text or PDF) in
  Content library > AI context. Recommended one to three pages. Three rules:
  no greeting, no tone instructions (always professional), nothing
  confidential, since anything in it can be said out loud.
- Custom greeting written in English, translated automatically.
- Hands off to a person by calling reception through the station buttons.
  Designed not to guess and not to hold long conversations (founder
  interview).
- Resets after a few seconds with nobody in front of the camera.
- Doesn't greet visitors while the station is closed by office hours.
- Conversation history is optional. When on: History > AI conversations
  with summary, labels, number of turns and handoffs.
- Video handoff needs a plan with video calls (Professional or Enterprise).

## Security and compliance

- Runs on **Microsoft Azure**. Video on Azure Communication Services. Phone
  via Twilio.
- Encryption: TLS 1.2+ in transit, AES-256 at rest.
- **SOC 2 Type I** certified. Never write "SOC 2 Type II" for Virtual Front
  Desk (Type II is Azure's certification, not VFD's).
- Security program aligned with ISO/IEC 27001 and NIST CSF (aligned, not
  certified).
- Hosting regions: United States, Canada, Global (Germany, for GDPR),
  Asia (Australia).
- Role-based access. SSO through Microsoft, Google, Apple or Okta.
- Do not write "HIPAA compliant" for Virtual Front Desk as a whole. The
  safe wording: sign-in data is encrypted in transit and at rest on
  Microsoft Azure with role-based access.

## Claims that are NOT verified (do not publish without confirmation)

- "Virtual Front Desk does not train its AI on customer data."
- "Slack can be used to answer the video call." Docs say Slack sends a
  notification only. WhatsApp is the integration with a video-call link.
- "A phone number can be answered in Teams without a Teams Phone license."

## Customers named on the website (safe to mention as users)

Los Angeles Metro, City of Tampa, Government of Canada, Ricoh, EmergeOrtho,
Ports America, City of Palo Alto, Allstate, Siemens, Levi's, Grant Thornton,
University of Kentucky, iRent, MasterCraft, CCM Hockey, SpacePlus. Only
describe them the way the website does.

## URLs for internal links

- Home: https://www.virtualfrontdesk.com/
- Pricing: https://www.virtualfrontdesk.com/pricing
- Free trial: https://www.virtualfrontdesk.com/free-demo-trial
- Video reception: https://www.virtualfrontdesk.com/video-reception
- AI receptionist: https://www.virtualfrontdesk.com/ai-receptionist
- Building security compliance: https://www.virtualfrontdesk.com/solutions/building-security-compliance
- Devices: https://www.virtualfrontdesk.com/devices
- Neat: https://www.virtualfrontdesk.com/neat
- API: https://www.virtualfrontdesk.com/api
- Blog: https://www.virtualfrontdesk.com/blog
- Help center: https://help.virtualfrontdesk.com/en
- Help, sign-in and Express QR: https://help.virtualfrontdesk.com/en/article/visitor-sign-form-and-sign-out-option
- Help, Teams integration: https://help.virtualfrontdesk.com/en/article/ms-teams-integration-for-video-calls-call-queue-auto-attendant
- Help, SMS for Teams: https://help.virtualfrontdesk.com/en/article/sms-for-microsoft-teams
- Help, groups and call queue: https://help.virtualfrontdesk.com/en/article/groups-and-call-queue
- Help, live call features: https://help.virtualfrontdesk.com/en/article/live-call-features
- Help, monitoring: https://help.virtualfrontdesk.com/en/article/monitoring-or-live-streaming-your-stations
- Help, emergency message: https://help.virtualfrontdesk.com/en/article/emergency-message
- Help, security: https://help.virtualfrontdesk.com/en/article/infrastructure-built-on-microsoft-azure-with-acs-hipaa-compliant-video-technology
- Help, AI Agent setup: https://help.virtualfrontdesk.com/en/article/ai-agent-setup-guide
- Help, Outlook add-in: https://help.virtualfrontdesk.com/en/article/outlook-calendar-add-in-for-pre-registration-or-express-qr-code-sign-in
- Help, Google Calendar add-on: https://help.virtualfrontdesk.com/en/article/google-calendar-add-on-for-pre-registration-and-express-qr-code-sign-in
- Teams Displays replacement guide: https://www.virtualfrontdesk.com/post/how-to-upgrade-from-microsoft-teams-displays-to-virtual-front-desk-on-neat-frame
- Case study, 22 lobbies on Teams: https://www.virtualfrontdesk.com/post/22-lobbies-one-modern-front-desk-how-a-global-manufacturer-runs-reception-on-microsoft-teams
