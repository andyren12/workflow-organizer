import { useSession, useSupabaseClient, useSessionContext, useUser } from '@supabase/auth-helpers-react';

export function GoogleLogin() {
    const session = useSession(); //tokens
    const supabase = useSupabaseClient(); //talk to supabase
    const { isLoading } = useSessionContext();
    const user = useUser();

  return {
    session,
    supabase,
    isLoading,
    user
    }
}
