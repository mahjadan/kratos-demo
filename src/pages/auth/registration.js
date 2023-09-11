import { useEffect, useState } from 'react';
import { kratos } from '../../kratos/kratos';

export default function RegistrationPage() {
  const [flowResponse, setFlowResponse] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const flowId = params.get('flow');
    const initRedirect = () => {
      window.location.href = 'http://127.0.0.1:4433/self-service/registration/browser';
    };

    if (!flowId) {
      initRedirect();
    }

    kratos
      .getSelfServiceRegistrationFlow(flowId)
      .then(flow => {
        if ([403, 404, 410].includes(flow.status)) {
          initRedirect();
        }
        if (flow.status !== 200) {
          initRedirect();
        }
        setFlowResponse(flow.data);
      })
      .catch(err => {
        initRedirect();
      });
  }, []);

  return (
    <div>
      <h1>Registration</h1>

      {flowResponse && flowResponse?.ui?.messages && (
        <pre style={{ color: 'red' }}>{JSON.stringify(flowResponse.ui.messages, null, 2)}</pre>
      )}

      {flowResponse?.ui?.nodes?.length > 0 && (
        <form
          id='registration'
          name='registration'
          action={`${flowResponse.ui.action}`}
          method='post'
          encType='application/x-www-form-urlencoded'
          style={{ display: 'grid', gap: '1rem', maxWidth: 400, justifyItems: 'start' }}
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
          <input
            required
            type='text'
            id='traits.name.first'
            name='traits.name.first'
            placeholder='First Name'
            value={firstname}
            onChange={({ target }) => {
              setFirstname(target.value);
            }}
          />
          <input
            required
            type='text'
            id='traits.name.last'
            name='traits.name.last'
            placeholder='Last Name'
            value={lastname}
            onChange={({ target }) => {
              setLastname(target.value);
            }}
          />
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
          <button form='registration' formAction={flowResponse.ui.action} formMethod='post' type='submit'>
            REGISTER
          </button>
        </form>
      )}
    </div>
  );
}

// import { useEffect, useState } from 'react';
// import { kratos } from '../../kratos/kratos';
// import { config } from '../../kratos/config';

// export default function RegistrationPage() {
//   const [flowResponse, setFlowResponse] = useState(null);

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [firstname, setFirstname] = useState('');
//   const [lastname, setLastname] = useState('');

//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const flowId = params.get('flow');
//     const initRedirect = () => {
//       window.location.href = config.routes.registration.selfServiceUrl;
//     };

//     console.log('[REGISTER] flowId: ', flowId);

//     if (!flowId) {
//       initRedirect();
//     }

//     if (flowId) {
//       kratos
//         .getSelfServiceRegistrationFlow(flowId)
//         .then(flow => {
//           console.log('[REGISTER] flow: ', flow);

//           if ([403, 404, 410].includes(flow.status)) {
//             console.log('[REGISTER] status = 403 | 404 | 410: ', flow.status);
//             initRedirect();
//           }

//           if (flow.status !== 200) {
//             console.log('[REGISTER] status !== 200: ', flow.status);
//             initRedirect();
//           }

//           setFlowResponse(flow.data);
//           console.log('[REGISTER] flow success: ', flow);
//         })
//         .catch(err => {
//           console.error('[REGISTER] err: ', err);
//           initRedirect();
//         });
//     }
//   }, []);

//   return (
//     <div>
//       <h1>Registration</h1>

//       {flowResponse && flowResponse?.ui?.messages && (
//         <pre style={{ color: 'red' }}>{JSON.stringify(flowResponse.ui.messages, null, 2)}</pre>
//       )}

//       <pre>{JSON.stringify({ action: flowResponse?.ui?.action }, null, 2)}</pre>

//       <pre>
//         {JSON.stringify(
//           {
//             firstname,
//             lastname,
//             email,
//             password,
//             // @ts-ignore
//             csrf_token:
//               flowResponse?.ui?.nodes?.find(n => n.attributes.name === 'csrf_token')?.attributes?.value || null,
//           },
//           null,
//           2
//         )}
//       </pre>

//       {flowResponse?.ui?.nodes?.length > 0 && (
//         <form
//           id='registration'
//           name='registration'
//           action={`${flowResponse.ui.action}`}
//           method='post'
//           encType='application/x-www-form-urlencoded'
//           style={{ display: 'grid', gap: '1rem', maxWidth: 400, justifyItems: 'start' }}
//         >
//           <input
//             id='csrf_token'
//             name='csrf_token'
//             type='hidden'
//             required
//             readOnly
//             // @ts-ignore
//             defaultValue={flowResponse.ui.nodes.find(n => n.attributes.name === 'csrf_token')?.attributes.value}
//           />
//           <input
//             required
//             type='text'
//             id='traits.name.first'
//             name='traits.name.first'
//             placeholder='First Name'
//             value={firstname}
//             onChange={({ target }) => {
//               setFirstname(target.value);
//             }}
//           />
//           <input
//             required
//             type='text'
//             id='traits.name.last'
//             name='traits.name.last'
//             placeholder='Last Name'
//             value={lastname}
//             onChange={({ target }) => {
//               setLastname(target.value);
//             }}
//           />
//           <input
//             required
//             type='email'
//             id='traits.email'
//             name='traits.email'
//             placeholder='Email'
//             value={email}
//             onChange={({ target }) => {
//               setEmail(target.value);
//             }}
//           />
//           <input
//             required
//             type='password'
//             id='password'
//             name='password'
//             placeholder='Password'
//             value={password}
//             onChange={({ target }) => {
//               setPassword(target.value);
//             }}
//           />
//           <button form='registration' formAction={flowResponse.ui.action} formMethod='post' type='submit'>
//             REGISTER
//           </button>
//         </form>
//       )}
//     </div>
//   );
// }
