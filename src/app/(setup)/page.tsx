import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthNav } from '@/components/custom/auth-nav';

const email = 'tracekestrel-assurance@polsia.app';

export const metadata: Metadata = {
  title: { absolute: 'TraceKestrel Assurance | Managed workflow assurance' },
  description:
    'Managed testing and monitoring for South African agencies that build WhatsApp bots and CRM integrations. Find journey failures before customers do.',
  alternates: { canonical: '/' },
};

function Mark() {
  return (
    <span className="tk-mark" aria-hidden="true">
      <svg viewBox="0 0 36 36" fill="none" aria-hidden="true">
        <path d="M7 25.5 15.2 10l3.1 6.3L28.5 8l-6.2 12.8-6.5-3.1L7 25.5Z" />
        <path d="M8 29h18" />
      </svg>
    </span>
  );
}

function Wordmark() {
  return (
    <a className="tk-wordmark" href="#top" aria-label="TraceKestrel Assurance home">
      <Mark />
      <span>
        TraceKestrel <b>Assurance</b>
      </span>
    </a>
  );
}

export default function HomePage() {
  return (
    <main className="tk-site" id="top">
      <header className="tk-header">
        <div className="tk-header-inner">
          <Wordmark />
          <nav className="tk-nav" aria-label="Main navigation">
            <Link href="/services">Services</Link>
            <a href="#coverage">Coverage</a>
            <a href="#approach">How it works</a>
            <a href="#agencies">For agencies</a>
          </nav>
          <AuthNav />
        </div>
      </header>

      <section className="tk-hero" aria-labelledby="hero-title">
        <div className="tk-hero-inner">
          <div className="tk-hero-copy">
            <p className="tk-eyebrow">
              <span className="tk-eyebrow-mark" /> Managed assurance for South African agencies
            </p>
            <h1 id="hero-title">Catch broken customer journeys before customers do.</h1>
            <p className="tk-hero-lede">
              Your WhatsApp bot can look fine on the surface while a lead goes missing in the CRM.
              We test the whole handoff, then keep watch on the failure points you agree matter.
            </p>
            <div className="tk-hero-actions">
              <Link className="tk-button tk-button-primary" href="/services">
                View service options
              </Link>
              <a className="tk-text-link" href="#coverage">
                See what we check
              </a>
            </div>
            <p className="tk-hero-note">
              A managed service for the agencies behind the automation.
            </p>
          </div>

          <div
            className="tk-hero-art"
            role="img"
            aria-label="Illustrative view of a workflow assurance review"
          >
            <div className="tk-dots" aria-hidden="true" />
            <div className="tk-paper-note tk-note-top">
              <span>TRACE</span>
              <i>journey review</i>
            </div>
            <div className="tk-review-window">
              <div className="tk-window-bar">
                <div className="tk-window-controls" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </div>
                <span>ASSURANCE / SCOPE EXAMPLE</span>
                <span className="tk-window-corner" aria-hidden="true">
                  ↗
                </span>
              </div>
              <div className="tk-window-title">
                <span>Illustrative journey check</span>
                <small>Sample format · no customer data</small>
              </div>
              <div className="tk-journey-path">
                <div className="tk-path-line" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="tk-journey-step">
                  <b>01</b>
                  <div>
                    <strong>WhatsApp input</strong>
                    <small>Required fields &amp; validation</small>
                  </div>
                  <em>01</em>
                </div>
                <div className="tk-journey-step">
                  <b>02</b>
                  <div>
                    <strong>Contact + CRM</strong>
                    <small>Lookup, duplicate guard, record</small>
                  </div>
                  <em>02</em>
                </div>
                <div className="tk-journey-step">
                  <b>03</b>
                  <div>
                    <strong>Queue handover</strong>
                    <small>Routing, agent &amp; timeout</small>
                  </div>
                  <em>03</em>
                </div>
              </div>
              <div className="tk-evidence-strip">
                <span className="tk-evidence-symbol" aria-hidden="true">
                  ↳
                </span>
                <p>
                  <b>Useful evidence</b>
                  <br />
                  The step, what happened and what to investigate next.
                </p>
              </div>
            </div>
            <div className="tk-paper-note tk-note-bottom">
              <span>01—03</span>
              <i>from input to handover</i>
            </div>
          </div>
        </div>
      </section>

      <div className="tk-intro-line">
        <div className="tk-container tk-intro-inner">
          <span>WHEN THE BACK END FAILS QUIETLY</span>
          <p>A message sent is not proof the customer journey finished.</p>
        </div>
      </div>

      <section className="tk-failure" aria-labelledby="failure-title">
        <div className="tk-container tk-failure-layout">
          <div className="tk-failure-heading">
            <p className="tk-eyebrow tk-eyebrow-light">The break is often downstream</p>
            <h2 id="failure-title">
              Small misses.
              <br />
              Real customer friction.
            </h2>
            <p>
              We trace the journey across the systems involved, so your team has a clear place to
              start.
            </p>
          </div>
          <div className="tk-failure-list">
            <article className="tk-failure-row">
              <span className="tk-index">01</span>
              <div>
                <h3>Details accepted. No CRM record.</h3>
                <p>A customer thinks their request is in motion. The team never sees it.</p>
              </div>
              <span className="tk-failure-stroke" aria-hidden="true" />
            </article>
            <article className="tk-failure-row">
              <span className="tk-index">02</span>
              <div>
                <h3>One person. Two lead records.</h3>
                <p>Follow-up splits across duplicates, muddying ownership and reporting.</p>
              </div>
              <span className="tk-failure-stroke" aria-hidden="true" />
            </article>
            <article className="tk-failure-row">
              <span className="tk-index">03</span>
              <div>
                <h3>Conversation routed to the wrong queue.</h3>
                <p>A good enquiry waits while the right agent stays unaware.</p>
              </div>
              <span className="tk-failure-stroke" aria-hidden="true" />
            </article>
          </div>
        </div>
      </section>

      <section className="tk-coverage tk-container" id="coverage" aria-labelledby="coverage-title">
        <div className="tk-section-head">
          <div>
            <p className="tk-eyebrow">Journey coverage</p>
            <h2 id="coverage-title">
              Follow the handoff
              <br />
              all the way through.
            </h2>
          </div>
          <p className="tk-section-summary">
            Checks are scoped to the platforms, test data and failure points agreed with your team.
            Coverage and cadence are made clear for each deployment.
          </p>
        </div>
        <div className="tk-coverage-list">
          <article className="tk-coverage-row">
            <span className="tk-coverage-number">01</span>
            <h3>Conversation &amp; validation</h3>
            <p>Follow WhatsApp flows and verify required details, formats and edge cases.</p>
            <span className="tk-row-rule" aria-hidden="true" />
          </article>
          <article className="tk-coverage-row">
            <span className="tk-coverage-number">02</span>
            <h3>Contact &amp; CRM records</h3>
            <p>Check contact lookup, duplicate prevention and the record created downstream.</p>
            <span className="tk-row-rule" aria-hidden="true" />
          </article>
          <article className="tk-coverage-row">
            <span className="tk-coverage-number">03</span>
            <h3>Routing &amp; agent handover</h3>
            <p>Verify queue destinations, handover behaviour and agreed timeout paths.</p>
            <span className="tk-row-rule" aria-hidden="true" />
          </article>
          <article className="tk-coverage-row">
            <span className="tk-coverage-number">04</span>
            <h3>Changes &amp; regression</h3>
            <p>
              Recheck critical journeys after updates, before small changes grow into incidents.
            </p>
            <span className="tk-row-rule" aria-hidden="true" />
          </article>
          <article className="tk-coverage-row">
            <span className="tk-coverage-number">05</span>
            <h3>Agreed monitoring &amp; reporting</h3>
            <p>
              Track selected failure points, send clear alerts and provide scheduled reliability
              reports.
            </p>
            <span className="tk-row-rule" aria-hidden="true" />
          </article>
        </div>
        <p className="tk-coverage-footnote">
          Scope, access prerequisites and check cadence are agreed before work begins.
        </p>
      </section>

      <section className="tk-approach" id="approach" aria-labelledby="approach-title">
        <div className="tk-container">
          <div className="tk-approach-head">
            <p className="tk-eyebrow">The assurance loop</p>
            <h2 id="approach-title">Clear checks. Useful next steps.</h2>
          </div>
          <div className="tk-steps">
            <article className="tk-step">
              <span className="tk-step-index">
                01 <i>— define</i>
              </span>
              <h3>Choose the critical journeys.</h3>
              <p>
                Agree on the client deployment, high-value flows, access prerequisites and what
                should happen at each step.
              </p>
            </article>
            <article className="tk-step">
              <span className="tk-step-index">
                02 <i>— verify</i>
              </span>
              <h3>Test beyond the message.</h3>
              <p>
                Check the resulting contact, record and handover. Capture the failure evidence your
                delivery team needs.
              </p>
            </article>
            <article className="tk-step">
              <span className="tk-step-index">
                03 <i>— keep watch</i>
              </span>
              <h3>Stay ready for change.</h3>
              <p>
                Run agreed checks, report exceptions clearly and recheck critical paths after
                updates.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="tk-agency" id="agencies" aria-labelledby="agency-title">
        <div className="tk-container tk-agency-layout">
          <div className="tk-agency-aside">
            <span className="tk-agency-asterisk" aria-hidden="true">
              ✳
            </span>
            <p>BUILT AROUND THE AGENCY RELATIONSHIP</p>
          </div>
          <div className="tk-agency-copy">
            <h2 id="agency-title">One agency. Several client journeys to keep dependable.</h2>
            <p>
              Start with one integration and a focused set of critical workflows. Give your team
              clear findings to act on, then expand coverage client by client as needs grow.
            </p>
            <a
              className="tk-agency-link"
              href={`mailto:${email}?subject=Agency%20assurance%20enquiry`}
            >
              Talk about agency coverage <span aria-hidden="true">↗</span>
            </a>
          </div>
          <ol className="tk-agency-index" aria-label="A practical way to grow coverage">
            <li>
              <span>01</span>
              <p>One integration</p>
              <small>Agree the first scope</small>
            </li>
            <li>
              <span>02</span>
              <p>Critical journeys</p>
              <small>Prioritise what matters</small>
            </li>
            <li>
              <span>03</span>
              <p>More deployments</p>
              <small>Extend coverage over time</small>
            </li>
          </ol>
        </div>
      </section>

      <section className="tk-contact tk-container" aria-labelledby="contact-title">
        <div className="tk-contact-copy">
          <p className="tk-eyebrow">Start with the workflow that matters most</p>
          <h2 id="contact-title">Let’s find the quiet failure before your customer does.</h2>
        </div>
        <div className="tk-contact-action">
          <a
            className="tk-button tk-button-primary"
            href={`mailto:${email}?subject=TraceKestrel%20pilot%20enquiry`}
          >
            Scope a pilot <span aria-hidden="true">↗</span>
          </a>
          <a className="tk-email" href={`mailto:${email}`}>
            {email}
          </a>
        </div>
      </section>

      <footer className="tk-footer">
        <div className="tk-container tk-footer-inner">
          <Wordmark />
          <p>Managed WhatsApp &amp; CRM journey assurance · South Africa</p>
          <a href={`mailto:${email}`}>{email}</a>
          <span>© {new Date().getFullYear()} TraceKestrel Assurance</span>
        </div>
      </footer>
    </main>
  );
}
