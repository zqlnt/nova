Nova starter CSV pack

The bundled app seed (`lib/orgSeed.ts`) mirrors this roster and billing shape for local/Firestore seeding.

What is included
- students.csv: students known so far
- billing_groups.csv: shared/individual billing groups and billing rules
- monthly_billing_dec2025_to_apr2026.csv: starter monthly billing rows for Dec 2025 to Apr 2026
- attendance_template.csv: starter attendance template with all known students
- business_rules.csv: key app rules

Important assumptions
- Reporting period assumed to be December 2025 to April 2026
- Universal Credit invoices should be submitted 21 days before expected payment date
- Universal Credit flagged issue check should happen 5 days before expected payment date
- Unknown amounts or dates are left blank intentionally
- Parent names/contact details are still missing
- Universal Credit monthly amounts are still missing
- Actual paid dates/statuses are still missing

How to use
1. Keep these CSVs as source-of-truth draft data
2. Ask Cursor to create import types and scripts matching these exact columns
3. Once sign-in works, import into org-scoped collections
4. Fill blanks with real parent/contact/payment history next

Recommended next data to add
- actual attendance dates/statuses
- actual UC amounts due
- actual dates invoices were submitted
- actual dates payments were received
- parent/contact details
