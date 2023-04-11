import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { createClient } from '@supabase/supabase-js';
import { SessionContextProvider } from '@supabase/auth-helpers-react';

const supabase = createClient(
  "https://xpdqyzszorntzkrorvdx.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwZHF5enN6b3JudHprcm9ydmR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODExNjAxMjIsImV4cCI6MTk5NjczNjEyMn0.aJYgDjJhF50qzGxfU2oA-LaR2U_Fk50GTmGaURiOWlY"
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SessionContextProvider supabaseClient={supabase}>
      <App />
    </SessionContextProvider>
  </React.StrictMode>
);