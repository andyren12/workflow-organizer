import { useSession, useSupabaseClient, useSessionContext } from '@supabase/auth-helpers-react';

export function GoogleLogin() {
    const session = useSession(); //tokens
    const supabase = useSupabaseClient(); //talk to supabase
    const { isLoading } = useSessionContext();

  return {
    session,
    supabase,
    isLoading
    }
}
