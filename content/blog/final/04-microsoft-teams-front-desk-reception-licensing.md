---
seo_title: "Microsoft Teams Reception: Integration and Licensing Guide"
meta_description: "How Microsoft Teams reception works: when visitor video calls need Teams Phone Standard, and how SMS for Microsoft Teams alerts staff without extra licenses."
slug: /blog/microsoft-teams-front-desk-reception-licensing
primary_question: "Which reception platforms integrate with Microsoft Teams without requiring Teams Phone licenses?"
primary_keyword: "Microsoft Teams reception"
related_queries:
  - Teams Phone Standard visitor calls
  - Microsoft Teams lobby kiosk
  - visitor management Microsoft Teams integration
  - Teams call queue for visitors
  - Teams auto attendant front desk
  - SMS for Microsoft Teams visitor notification
  - Microsoft Teams Displays replacement
author: "Jeff Letendre"
author_title: "CEO and Founder, Virtual Front Desk"
publisher: "Virtual Front Desk"
date_published: "2026-11-11"
date_modified: "2026-11-11"
ai_answer_summary: "Virtual Front Desk lets lobby visitors video call employees directly in Microsoft Teams. Answering those video calls in Teams requires a Teams Phone Standard license, a Microsoft requirement. Without it, employees can receive visitor alerts in Teams through SMS for Microsoft Teams at no extra Microsoft cost, or answer the same video calls in the Virtual Front Desk app. Calls can also go to Teams call queues."
---

# Microsoft Teams Reception: How Front-Desk Integration and Licensing Work

Microsoft Teams reception means a visitor in your lobby can reach an employee in Teams without anyone at the desk. With Virtual Front Desk, the visitor taps a button on the station and a video call rings in the employee's Teams app. Answering that call in Teams needs a Teams Phone Standard license, which is a Microsoft requirement. Employees without one can still get visitor alerts in Teams through SMS for Microsoft Teams, with no extra Microsoft license, or answer the same video call in the Virtual Front Desk app.

## How does a visitor reach an employee in Microsoft Teams?

1. The visitor taps a button on the station in the lobby, such as an employee directory or "Reception", or finishes the visitor sign-in form.
2. Virtual Front Desk places a video call to the employee, group or call queue behind that button.
3. The call rings in the Teams desktop or mobile app.
4. The employee answers in Teams and talks to the visitor face to face on the station screen.

The employee can be in the building, at home or on the road. As long as Teams is running on their computer or phone, the visitor reaches them. Employees who answer in Teams never need to sign in to Virtual Front Desk at all.

## Which Microsoft licenses do you need?

The licenses you need depend on how each person should be reached. Most organizations mix these options, so it's worth deciding per role rather than per company.

| How the employee is reached | Microsoft license needed | Video? |
|---|---|---|
| Video call answered in Microsoft Teams | Teams Phone Standard for the employee, plus a Teams Phone calling plan on your Microsoft administrator | Yes |
| Text alert in Teams (SMS for Microsoft Teams) | None beyond a normal Teams account | No, it's a notification |
| Video call answered in the Virtual Front Desk dashboard or mobile app | None | Yes |
| Video-call link in WhatsApp | None | Yes |
| Notification in Slack | None | No, it's a notification |
| Phone call to a mobile or desk number | None | No, audio only |

Two details catch IT teams out. First, only users imported from Microsoft Entra ID can receive calls in Teams; people invited to Virtual Front Desk by email use the dashboard. Second, an employee whose calls are routed to Teams answers them in Teams, not in the Virtual Front Desk app, so pick one place per person.

## SMS for Microsoft Teams: visitor alerts without Teams Phone

If the goal is simply "tell me in Teams when my visitor arrives", you don't need Teams Phone at all. SMS for Microsoft Teams sends a text notification into Teams through the Virtual Front Desk SMS app whenever a visitor presses a button that calls that employee or signs in to see them. It costs nothing extra on the Microsoft side and takes minutes to set up:

1. Connect your Microsoft Entra ID directory in Virtual Front Desk and import your users.
2. Install the Virtual Front Desk SMS app in Microsoft Teams.
3. Each user turns on Teams text notification in their Notifications & calls settings.

One setting to watch: leave Teams video call turned off for anyone without a Teams Phone Standard license. Turning it on without the license makes calls fail. The [SMS for Microsoft Teams guide](https://help.virtualfrontdesk.com/en/article/sms-for-microsoft-teams) has the screenshots.

## Call queues and auto attendants

For a team rather than one person, there are two routes.

**Virtual Front Desk groups.** A group lets one station button reach several people. Groups that contain Teams users use the Queue mode (one person after another, 30 seconds each by default) or the List mode (the visitor picks the person). Broadcast, where everyone rings at once, isn't available for Teams users, and a group can't mix people who answer in Teams with people who answer in the dashboard.

**Microsoft Teams call queues and auto attendants.** You can also import a call queue or auto attendant you've built in the Teams admin center, and calls follow the routing already set up in Teams. Each one needs a resource account with the free Microsoft Teams Phone Resource Account license, and call queues need conference mode turned on. Auto attendants handle audio calls only.

For most station buttons, a call queue is the better fit. It routes to whoever is available and scales as more people join. An auto attendant makes sense when you want the station to behave exactly like your company's main phone number.

## What do you give up when you answer in Teams?

Microsoft Teams reception is convenient for people who live in Teams all day. The trade-off is that a call answered in Teams doesn't include the Virtual Front Desk call tools: ID capture, screenshots, sending PDFs to the screen or the printer, card payments and QR codes. Live translated closed captions do work in Teams calls.

In practice that leads to a simple split. Employees who are being told their visitor has arrived answer in Teams. A receptionist who checks IDs, collects signatures or takes payments during calls answers from the Virtual Front Desk dashboard, where those tools are. A global manufacturer running [22 lobbies on Microsoft Teams](https://www.virtualfrontdesk.com/post/22-lobbies-one-modern-front-desk-how-a-global-manufacturer-runs-reception-on-microsoft-teams) uses exactly this model: hosts greet their own visitors in Teams, and the sign-in flow handles NDAs, ID photos and badges.

## Replacing Microsoft Teams Displays

Microsoft ended support for Teams Displays on September 3, 2025. If your reception ran on one, Virtual Front Desk keeps the Teams calling workflow and adds what Teams Displays never had: visitor sign-in, document signing, badge printing and branded screens, on supported hardware such as the Neat Frame. The [Teams Displays upgrade guide](https://www.virtualfrontdesk.com/post/how-to-upgrade-from-microsoft-teams-displays-to-virtual-front-desk-on-neat-frame) walks through the switch.

## What IT needs to set up for Microsoft Teams reception

The Teams integration is a one-time setup, and most of it happens in Microsoft admin centers:

- **Grant consent in Microsoft Entra ID.** A Microsoft administrator approves the Virtual Front Desk permissions request.
- **Choose directory visibility.** Decide whether Virtual Front Desk sees your full directory or only selected groups.
- **Allow external access.** Add the Virtual Front Desk Azure Communication Services resource under External access in the Teams admin center, and turn on Enterprise Voice for every user who will answer calls.
- **Assign licenses.** Teams Phone Standard for anyone answering video calls in Teams. Everyone else can use SMS for Microsoft Teams or the Virtual Front Desk app.
- **Import users and check them.** Virtual Front Desk flags anyone missing a Teams Phone license, and you can recheck everyone at once after licenses are assigned.
- **Allow time.** Some Microsoft settings take up to 24 hours to apply.

The Microsoft Teams integration is part of the Professional plan ($49 per station per month, plus $0.07 per video call) and the Enterprise plan ($109 per station per month, unlimited video calls). Built-in call queues and an on-station employee directory synced from Entra ID groups are part of Enterprise. Full instructions are in the guide to [set up the Microsoft Teams integration](https://help.virtualfrontdesk.com/en/article/ms-teams-integration-for-video-calls-call-queue-auto-attendant).

## Frequently asked questions

### Do I need a Teams Phone license to use Virtual Front Desk with Microsoft Teams?

Only for employees who answer visitor video calls inside Microsoft Teams. That's a Microsoft requirement. Employees without Teams Phone Standard can receive visitor alerts in Teams through SMS for Microsoft Teams, or answer video calls from the Virtual Front Desk dashboard or mobile app.

### Can visitors reach a Microsoft Teams call queue?

Yes. You can import a call queue or auto attendant from the Teams admin center, and calls follow the routing already set up in Teams. The call queue needs a resource account with the free Teams Phone Resource Account license and conference mode turned on.

### What do I lose when I answer a visitor call in Teams?

Calls answered in Microsoft Teams don't include the Virtual Front Desk call tools, such as ID capture, screenshots, sending PDFs to the screen or printer, payments and QR codes. Live translated captions still work. Receptionists who need those tools should answer from the Virtual Front Desk dashboard.

### Does Virtual Front Desk work without Microsoft Teams?

Yes. Microsoft Teams is optional. Employees can answer visitor video calls from the Virtual Front Desk web dashboard or the iOS and Android apps, and receive alerts by SMS, email, Slack or WhatsApp.

### Are visitor video calls recorded?

No. Virtual Front Desk video calls are live only and are never recorded, whether they're answered in Microsoft Teams or in Virtual Front Desk.

## Try it with your own Teams tenant

The fastest way to see how this fits your setup is to connect your Entra ID directory, import two or three users and place a test call from a station. Every new account starts with a [30-day free trial](https://www.virtualfrontdesk.com/free-demo-trial) of the Enterprise plan, so you can test Teams calls, call queues and the employee directory before choosing a plan. For a lobby with nobody at the desk, see how to [greet walk-in visitors at an unstaffed desk](/blog/greet-visitors-unstaffed-front-desk).
