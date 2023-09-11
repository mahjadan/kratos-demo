import { Link } from 'gatsby';
import { useEffect, useState } from 'react';
import { kratos } from '../kratos/kratos';
import { config } from '../kratos/config';

export default function HomePage() {
  const [userIdentity, setUserIdentity] = useState(null);

  useEffect(() => {
    kratos
      .whoami()
      .then(resp => {
        setUserIdentity(resp.data);
      })
      .catch(err => {
        console.error('[WhoAmI] err: ', err);
      });
  }, []);

  const s = { display: 'flex', marginBottom: '1rem' };

  return (
    <div>
      <h1>Home page</h1>

      <Link style={s} to={config.routes.registration.path}>
        Registration
      </Link>

      <Link style={s} to={config.routes.login.path}>
        Login
      </Link>

      <Link style={s} to={config.routes.recovery.path}>
        Recovery
      </Link>

      <Link style={s} to={config.routes.verify.path}>
        Verify
      </Link>

      <Link style={s} to={config.routes.dashboard.path}>
        Dashboard
      </Link>

      <Link style={s} to={config.routes.settings.path}>
        Settings
      </Link>

      <pre>{JSON.stringify({ userIdentity }, null, 2)}</pre>
    </div>
  );
}
