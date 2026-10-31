# EZ Follow: law firm partner view iteration

This is a real iteration made with ChatGPT/Codex from the original prototype.
It is a front-end view simulation using fictional records. All sample data
remains in the HTML file; it does not implement backend authorization.

## Request

Add a “View as Law Firm Partner” switch. The law firm partner's case list
should contain only cases assigned to that partner. Keep the change small
and retain the actual request, code, checks, and correction as video material.

## Implementation

- Added a labeled View as selector: HR / Emily Chen and Law Firm Partner / Alex Morgan.
- Added explicit fictional law firm assignments, separate from the HR next-action owner.
- Alex is assigned Michael Zhang, Sarah Johnson, and Kevin Park: 3 of the 8 sample cases.
- Scoped the Cases list, its search/type/status filters, Today, and recent activity.
- Returning to HR restores all eight cases. Switching resets filters and opens Cases.
- Opening an unassigned case is rejected in the simulated UI. Switching away
  from an open unassigned case returns to the scoped list.
- Modules outside this small partner simulation are hidden; Settings opens
  Roles & Permissions. This is not a complete law firm workspace.
- Only `EZ-Follow-Website-Final-EN.html` was changed; the separate App HTML is unchanged.

## Actual issue found and corrected

The first implementation called `toggleMoreSheet(false)` when changing views.
The desktop HTML has no `more-sheet-overlay` element. The helper attempted to
read `classList` on null, interrupting the switch before cases and Today were
rerendered. Automated tests failed, and browser inspection showed the partner
name with the old HR dashboard's other cases still visible.

The correction adds an early return when the optional mobile sheet is absent.
The tests were rerun and browser inspection confirmed the assigned-only list.
The one-item Today summary was also corrected from “1 item need” to “1 item needs.”


Screenshots from the actual iteration are retained in the recording guide.

## Verified results

Run `npm ci` then `npm test` (Node.js 18 or newer).

All four integration tests pass:

1. HR sees all eight cases; Alex sees exactly his three assigned cases.
2. Search/type/status filters do not expand that scope; HR restores all cases.
3. Switching from an unassigned case removes the detail view; direct opening
   is rejected. An assigned case opens and retains its separate HR action owner.
4. Today and recent activity are scoped; unrelated modules and case creation
   are outside the partner simulation.

These are automated implementation checks and a browser walkthrough by the
assistant, not usability tests or evidence of real workplace use.



## Suggested video sequence

1. Show HR Cases: the count is 8, with explicit law firm assignments.
2. Choose Law Firm Partner / Alex Morgan in View as: the list changes to 3.
3. Briefly show the actual first-iteration screenshot or test output and
   explain the desktop-only issue; do not recreate it as a staged new failure.
4. Show the corrected three-case result and passing tests.
5. Return to HR and show that the eight-case list returns.

Suggested narration, based on this actual iteration:

> For this iteration, I used ChatGPT and Codex to add a law firm partner view.
> HR sees all eight sample cases; Alex sees only his three assigned cases.
> The first version had a bug: after switching to Alex, Today still showed
> other people’s cases. Codex’s tests caught it. After the fix, Codex checked
> the filters, case details, and dashboard. This is a
> front-end view simulation, not backend access control.

This example was made with ChatGPT/Codex, not Claude. Do not attribute this
specific change or its tests to a different tool. The user can retain this
conversation as the actual requirement-and-implementation record.
