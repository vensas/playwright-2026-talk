import { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { ACCESSIBLE_MODE, COOLDOWN_SECONDS } from './a11yMode';
import './App.css';

interface DeploymentResult {
  success: boolean;
  message: string;
  deployedBy?: string;
  timestamp?: string;
}

/** Calculates the seconds that are left until the given end time. */
function secondsUntil(endTime: number): number {
  return Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
}

function App() {
  const [deployerName, setDeployerName] = useState('');
  const [environment, setEnvironment] = useState('production');
  const [result, setResult] = useState<DeploymentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [cooldownEndsAt, setCooldownEndsAt] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);

  // The cooldown counts down once per second. The Clock API test controls this
  // timer and `Date.now()`, so that the test does not wait for real time.
  useEffect(() => {
    if (cooldownEndsAt === null) {
      return;
    }

    setSecondsLeft(secondsUntil(cooldownEndsAt));

    const timer = setInterval(() => {
      const remaining = secondsUntil(cooldownEndsAt);
      setSecondsLeft(remaining);
      if (remaining === 0) {
        setCooldownEndsAt(null);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldownEndsAt]);

  const cooling = cooldownEndsAt !== null && secondsLeft > 0;

  const handleDeploy = async () => {
    if (!deployerName.trim()) {
      setResult({
        success: false,
        message: '⚠️ Please enter your name before deploying!',
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // Support configurable backend URL for integration tests
      const backendUrl = (window as any).BACKEND_URL || 'http://localhost:5000';
      const response = await fetch(`${backendUrl}/api/deploy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ deployerName, environment }),
      });

      const data = await response.json();
      setResult(data);
      setCooldownEndsAt(Date.now() + COOLDOWN_SECONDS * 1000);
    } catch (error) {
      setResult({
        success: false,
        message: '💥 Failed to connect to the deployment server. Is the backend running?',
      });
    } finally {
      setLoading(false);
    }
  };

  const deployLabel = cooling
    ? `Next deploy in ${secondsLeft}s`
    : loading
      ? 'Deploying...'
      : 'Deploy Now 🚀';

  return (
    <div className="app-container">
      <Card className="deploy-card">
        <div className="card-header">
          <h1>⚡ Deploy or Die</h1>
          <p>Every deployment is a gamble. Are you feeling lucky?</p>
        </div>

        <div className="deploy-form">
          <div className="input-group">
            <label htmlFor="deployer-name">Who dares to deploy?</label>
            <InputText
              id="deployer-name"
              value={deployerName}
              onChange={(e) => setDeployerName(e.target.value)}
              placeholder="Enter your name"
              disabled={loading}
              className="deployer-input"
            />
          </div>

          <div className="input-group">
            {/* Accessibility defect: without ACCESSIBLE_MODE this field has no
                label. A placeholder is not a label. axe-core rule: "label". */}
            {ACCESSIBLE_MODE && <label htmlFor="environment">Target environment</label>}
            <InputText
              id="environment"
              value={environment}
              onChange={(e) => setEnvironment(e.target.value)}
              disabled={loading}
              className="deployer-input"
            />
          </div>

          {/* Accessibility defect: without ACCESSIBLE_MODE this button shows
              only an icon and has no accessible name. axe-core: "button-name". */}
          <Button
            icon="pi pi-history"
            aria-label={ACCESSIBLE_MODE ? 'Show deployment history' : undefined}
            className="history-button"
            text
          />

          <Button
            label={deployLabel}
            onClick={handleDeploy}
            loading={loading}
            disabled={loading || cooling}
            className="deploy-button"
            severity="danger"
            size="large"
          />

          {/* Accessibility defect: without ACCESSIBLE_MODE the contrast of this
              text is too low. axe-core rule: "color-contrast". */}
          <p className={ACCESSIBLE_MODE ? 'deploy-hint' : 'deploy-hint deploy-hint--faint'}>
            Each deployment has a 50% success rate. You must wait {COOLDOWN_SECONDS} seconds
            between two deployments.
          </p>
        </div>

        {result && (
          <div className="result-container">
            <Message
              severity={result.success ? 'success' : 'error'}
              text={result.message}
              className="result-message"
            />
            {result.deployedBy && (
              <div className="deployment-info">
                <p>
                  <strong>Deployed by:</strong> {result.deployedBy}
                </p>
                {result.timestamp && (
                  <p>
                    <strong>Time:</strong> {new Date(result.timestamp).toLocaleString()}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

export default App;
