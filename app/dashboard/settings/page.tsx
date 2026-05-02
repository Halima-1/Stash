export default function Settings() {
  return (
    <section className="dashboard-page surface">
      <header className="page-heading">
        <div>
          <h2 className="protocol-heading">Settings</h2>
          <p>Manage account preferences, approvals, and notification channels.</p>
        </div>
      </header>

      <div className="settings-grid">
        <section className="panel surface-soft stack">
          <h3>Security Controls</h3>
          <ul className="settings-list">
            <li>
              <div>
                <strong>Wallet verification on login</strong>
                <p className="inline-note">Require signature challenge before session access.</p>
              </div>
              <span className="tag">Enabled</span>
            </li>
            <li>
              <div>
                <strong>Transfer allowlist</strong>
                <p className="inline-note">Restrict outbound transfers to approved wallets.</p>
              </div>
              <span className="tag">Active</span>
            </li>
            <li>
              <div>
                <strong>Session timeout</strong>
                <p className="inline-note">Auto-lock dashboard after 15 minutes of inactivity.</p>
              </div>
              <span className="tag">15m</span>
            </li>
          </ul>
        </section>

        <section className="panel surface-soft stack">
          <h3>Communication Preferences</h3>
          <ul className="settings-list">
            <li>
              <div>
                <strong>Settlement alerts</strong>
                <p className="inline-note">Immediate notifications for transfer confirmations.</p>
              </div>
              <span className="tag">On</span>
            </li>
            <li>
              <div>
                <strong>Weekly treasury digest</strong>
                <p className="inline-note">Vault utilization and yield summaries each week.</p>
              </div>
              <span className="tag">On</span>
            </li>
            <li>
              <div>
                <strong>Protocol incident notices</strong>
                <p className="inline-note">Urgent maintenance and contract status updates.</p>
              </div>
              <span className="tag">On</span>
            </li>
          </ul>
        </section>
      </div>

      <section className="panel surface-soft stack">
        <h3>Connected Account</h3>
        <div className="row-between">
          <span className="label">Primary wallet</span>
          <span className="value mono">0x04f2...c918</span>
        </div>
        <div className="row-between">
          <span className="label">Preferred network</span>
          <span className="value mono">Base Sepolia</span>
        </div>
        <div className="row-between">
          <span className="label">Default stablecoin</span>
          <span className="value mono">USDC</span>
        </div>
      </section>
    </section>
  )
}
