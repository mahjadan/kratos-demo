import { useEffect, useState } from 'react';
import { kratos } from '../../kratos/kratos';
import { config } from '../../kratos/config';

export default function LoginPage() {
  const [flowResponse, setFlowResponse] = useState(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const flowId = params.get('flow');
    const initRedirect = () => {
      window.location.href = config.routes.login.selfServiceUrl;
    };

    console.log('[LOGIN] flowId: ', flowId);

    if (!flowId) {
      initRedirect();
    }

    if (flowId) {
      kratos
        .getSelfServiceLoginFlow(flowId)
        .then(flow => {
          console.log('[LOGIN] flow: ', flow);

          if ([403, 404, 410].includes(flow.status)) {
            console.log('[LOGIN] status = 403 | 404 | 410: ', flow.status);
            initRedirect();
          }

          if (flow.status !== 200) {
            console.log('[LOGIN] status !== 200: ', flow.status);
            initRedirect();
          }

          setFlowResponse(flow.data);
          console.log('[LOGIN] flow success: ', flow);
        })
        .catch(err => {
          console.error('[LOGIN] err: ', err);
          initRedirect();
        });
    }
  }, []);

  return (
    <div>
      <h1>Login</h1>

      {flowResponse?.ui?.messages && (
        <pre style={{ color: 'red' }}>{JSON.stringify(flowResponse.ui.messages, null, 2)}</pre>
      )}

      <pre>{JSON.stringify({ action: flowResponse?.ui?.action }, null, 2)}</pre>

      <pre>
        {JSON.stringify(
          {
            email,
            password,
            // @ts-ignore
            csrf_token:
              flowResponse?.ui?.nodes?.find(n => n.attributes.name === 'csrf_token')?.attributes?.value || null,
          },
          null,
          2
        )}
      </pre>

      {flowResponse && flowResponse?.ui?.action && (
        <form
          id='login'
          method='post'
          action={flowResponse.ui.action}
          encType='application/x-www-form-urlencoded'
          style={{ display: 'grid', gap: '1rem', maxWidth: 400 }}
        >
          <input
            id='csrf_token'
            name='csrf_token'
            type='hidden'
            required
            readOnly
            // @ts-ignore
            defaultValue={flowResponse.ui.nodes.find(n => n.attributes.name === 'csrf_token')?.attributes.value}
          />

          <label htmlFor='traits.email'>
            <input
              required
              type='email'
              id='traits.email'
              name='traits.email'
              placeholder='Email'
              value={email}
              onChange={({ target }) => {
                setEmail(target.value);
              }}
            />
          </label>

          <label htmlFor='password'>
            <input
              required
              type='password'
              id='password'
              name='password'
              placeholder='Password'
              value={password}
              onChange={({ target }) => {
                setPassword(target.value);
              }}
            />
          </label>

          <button form='registration' formAction={flowResponse.ui.action} formMethod='post' type='submit'>
            LOGIN
          </button>
        </form>
      )}
    </div>
  );
}
