import { GoogleLogin } from './GoogleLogin'
export default function Home() {
    const { session, supabase, isLoading } = GoogleLogin();

    if(isLoading) {
        return <></>
      }
      
    async function googleSignIn() {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            scopes: 'https://www.googleapis.com/auth/calendar'
          }
        });
        if(error) {
          alert("error");
          console.log(error);
        }
      }
    
      async function signOut() {
        await supabase.auth.signOut();
      }

  return (
    <div>
      <h1>Home</h1>
      <div>
      {session ? 
        <>
        <h2>Hi {session.user.email}</h2> 
        <button onClick={() => signOut()}>Sign Out</button>
        </> 
        : 
        <>
        <button onClick={() => googleSignIn()}>Sign in with Google</button>
        </> }
    </div>
    </div>
  )
}
