import { PublicApi, Configuration } from '@ory/kratos-client';
import { config } from './config';

const kratosConfiguration = new Configuration({
  basePath: config.kratos.publicUrl,
  baseOptions: {
    withCredentials: true,
    timeout: 5000,
  },
});

export const kratos = new PublicApi(kratosConfiguration);
