# TICKET-142: Add email format validation to the registration form

**Reporter:** support team
**Priority:** medium

## Description
Users can currently submit the registration form with an obviously invalid
email (e.g. `test@`, `notanemail`). Add client-side validation that rejects
malformed emails before the request reaches the backend, with a clear inline
error message under the email field.

## Acceptance criteria
- Invalid email formats are rejected with an inline error, no request sent.
- Valid emails submit normally, no behavior change.
- Error message is localized (ua/en), consistent with the rest of the form.
