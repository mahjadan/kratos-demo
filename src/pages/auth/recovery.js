import { useEffect, useState } from 'react';
import { kratos } from '../../kratos/kratos';
import { config } from '../../kratos/config';

export default function RecoveryPage() {
  const [flowResponse, setFlowResponse] = useState(null);

  const [email, setEmail] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const flowId = params.get('flow');
    const initRedirect = () => {
      window.location.href = config.routes.recovery.selfServiceUrl;
    };

    console.log('[RECOVERY] flowId: ', flowId);

    if (!flowId) {
      initRedirect();
    }

    if (flowId) {
      kratos
        .getSelfServiceRecoveryFlow(flowId)
        .then(flow => {
          console.log('[RECOVERY] flow: ', flow);

          if ([403, 404, 410].includes(flow.status)) {
            console.log('[RECOVERY] status = 403 | 404 | 410: ', flow.status);
            initRedirect();
          }

          if (flow.status !== 200) {
            console.log('[RECOVERY] status !== 200: ', flow.status);
            initRedirect();
          }

          setFlowResponse(flow.data);
          console.log('[RECOVERY] flow success: ', flow);
        })
        .catch(err => {
          console.error('[RECOVERY] err: ', err);
          initRedirect();
        });
    }
  }, []);

  return (
    <div>
      <h1>Recovery</h1>

      {flowResponse && (
        <form method='post' action={flowResponse.ui.action} style={{ display: 'grid', gap: '1rem', maxWidth: 400 }}>
          {flowResponse.ui.messages && (
            <pre style={{ color: 'red' }}>{JSON.stringify(flowResponse.ui.messages, null, 2)}</pre>
          )}

          <pre>
            {JSON.stringify(
              {
                email,
                csrf_token:
                  flowResponse?.ui?.nodes?.find(n => n.attributes.name === 'csrf_token')?.attributes?.value || null,
              },
              null,
              2
            )}
          </pre>

          <input
            id='csrf_token'
            name='csrf_token'
            type='hidden'
            required
            readOnly
            // @ts-ignore
            defaultValue={flowResponse?.ui?.nodes.find(n => n.attributes.name === 'csrf_token')?.attributes.value}
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

          <button type='submit'>RECOVERY</button>
        </form>
      )}
    </div>
  );
}
