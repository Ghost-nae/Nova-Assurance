# Nova-Assurance
Customer journey assurance for WhatsApp bots and CRM integrations.

Nova Assurance is an early-stage portfolio project exploring how businesses can detect failures across automated customer journeys, from a customer submitting details to the correct record appearing in a CRM.
Project status
The project currently has a published marketing website and a proposed service model. It is not yet an operational testing or monitoring platform.

Live CRM connectors, automated test execution, scheduled monitoring, customer onboarding, checkout and report delivery are not confirmed as implemented. Any illustrative journeys on the website should be treated as demonstrations, not evidence of live integration testing.
Website
Visit TraceKestrel Assurance
https://tracekestrel-assurance.polsia.io/
The problem
A chatbot can confirm that a request was submitted while the downstream workflow fails. Examples include:
- A lead never reaching the CRM.
- Duplicate contact or case records.
- Requests being assigned to the wrong queue.
- Invalid input being accepted.
- An update breaking a previously working journey.
TraceKestrel explores checking business outcomes as well as the visible conversation.
Intended users
- Agencies building and maintaining WhatsApp bots.
- Teams integrating customer conversations with CRM systems.
- QA teams validating automated onboarding and support workflows.
Planned capabilities
Capability	Intended behaviour	Status
Journey definitions	Document inputs, steps and expected outcomes	Planned
Input validation tests	Check required fields and invalid inputs	Planned
CRM verification	Confirm the expected record was created correctly	Planned
Duplicate checks	Detect unintended duplicate records	Planned
Regression testing	Repeat critical checks after updates	Planned
Scheduled monitoring	Execute agreed checks and flag failures	Planned
Evidence reports	Show expected results, actual results and supporting evidence	Planned


Proposed workflow
1. Define a customer journey and its expected outcome.
2. Prepare synthetic test data in an approved test environment.
3. Execute the journey through a supported integration.
4. Compare the downstream result with the expected outcome.
5. Record evidence and produce a pass/fail report.
6. Notify the responsible team when a check fails.
This describes the intended product workflow, not currently available functionality.
Roadmap
- [x] Establish the product concept and positioning.
- [x] Publish the initial marketing website.
- [ ] Build a synthetic demonstration with a mock CRM.
- [ ] Demonstrate successful creation, failed creation and duplicate handling.
- [ ] Add repeatable test execution and evidence reports.
- [ ] Validate the service with agency interviews and a scoped pilot.
- [ ] Implement one authorised sandbox integration.
- [ ] Add scheduling, alerts and operational monitoring.
Development and setup
The initial website was created using Polsia. Repository contents and dependency files should be inspected before documenting the technology stack or installation commands. This README does not claim a verified local setup procedure.
Responsible testing
- Use synthetic data for demonstrations.
- Obtain authorisation before testing external systems.
- Keep credentials out of source control and reports.
- Clearly distinguish simulated outcomes from verified live results.
- Design checks to avoid unintended messages, charges or production records.
Portfolio context
This project connects my interests in software testing, API integration and full-stack development. It explores product scoping, customer journey design and the distinction between a working demonstration and a production assurance service.
Author
Nkosinathi Manda — Software Engineer | Full Stack Java Developer
- GitHub
- LinkedIn
License
No license has been selected for this project. Add a LICENSE file before offering it under a specific open-source license.
