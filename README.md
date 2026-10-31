# EZ Follow prototype

Open [EZ Follow Prototype](https://zelongjin0516-art.github.io/ez-follow-prototype/EZ-Follow-Prototype.html) in a browser. The sign-in is a demo;
sample values are prefilled. No real account is required.

## Law firm partner view

After Sign In, use **View as** at the top of the workspace:

- **HR · Emily Chen** shows all 8 fictional cases.
- **Law Firm Partner · Alex Morgan** shows Michael Zhang, Sarah Johnson,
  and Kevin Park (3 cases), and a scoped Today dashboard.

Switching views opens Cases and resets search/type/status filters. The law
firm assignment is separate from the next-action owner, who can still be HR.
Some modules are outside this limited partner simulation and are hidden there.

**This is client-side view filtering, not authentication or backend access
control.** All sample records remain in the downloaded HTML. The prototype
has not been deployed for real workplace use.

The separate `EZ-Follow-App-Final-EN.html` is unchanged by this iteration.

## Checks

With Node.js 18 or newer:

```sh
npm ci
npm test
```

See [the actual AI iteration record](docs/ai-iteration.md) for the real issue
found during implementation, its correction, verification, and video material.

The previous desktop URL, `EZ-Follow-Website-Final-EN.html`, redirects to this page.
