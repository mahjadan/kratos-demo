import { useEffect, useState } from 'react';
import { navigate } from 'gatsby';
import { config } from '../kratos/config';
import { kratos } from '../kratos/kratos';

export default function DashboardPage() {
  const [userIdentity, setUserIdentity] = useState(null);

  useEffect(() => {
    kratos
      .whoami()
      .then(resp => {
        setUserIdentity(resp.data);
      })
      .catch(err => {
        console.error('[DASHBOARD] err: ', err);
        navigate(config.routes.login.path);
      });
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <pre>{JSON.stringify({ userIdentity }, null, 2)}</pre>
    </div>
  );
}
