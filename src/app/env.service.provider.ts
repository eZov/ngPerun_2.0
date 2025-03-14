import { EnvService } from './env.service';

export const EnvServiceFactory = () => {
  // Create env
  const env: { [key: string]: any } = new EnvService();

  // Read environment variables from browser window
  const browserWindow = window;
  const browserWindowEnv: { [key: string]: any } = (browserWindow as any)['__env'];
  console.log("browserWindowEnv: " + JSON.stringify(browserWindowEnv));    

  // Assign environment variables from browser window to env
  for (const key in browserWindowEnv) {
    if (browserWindowEnv.hasOwnProperty(key)) {
      env[key] = browserWindowEnv[key];
      console.log("browser loop: " + JSON.stringify(key)); 
      console.log("browser loop 1: " + JSON.stringify(env)); 
    }
  }
  return env;
};

export const EnvServiceProvider = {
  provide: EnvService,
  useFactory: EnvServiceFactory,
  deps: [],
};
