// React stuff:
import React from 'react';
import ReactDOM from 'react-dom';

// Sentry stuff:
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

// VH1 stuff:
import './index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';


if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: "https://ac4fccd7346c4547a5a0592a390f1182@o476106.ingest.sentry.io/5516489",
    integrations: [
      new Integrations.BrowserTracing(),
    ],

    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
  });
}


ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
