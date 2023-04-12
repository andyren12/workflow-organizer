import { GoogleLogin } from './GoogleLogin';
import styles from './Home.module.scss';

export default function Home() {
    const { session, supabase, isLoading } = GoogleLogin();
    if (session) {
        var name = session.user.user_metadata.name;
    }

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
        <div className={styles.bg}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                {session ? 
                    <>
                        <h2 className={styles.greeting}>Welcome {name.substr(0, name.indexOf(" "))}</h2>
                        <button className={styles.googleLoginBtn} onClick={() => signOut()}>Sign Out</button>
                    </> 
                    : 
                    <>
                        <h2 className={styles.greeting}>Welcome</h2>
                        <button className={styles.googleLoginBtn} onClick={() => googleSignIn()}>Sign in with Google</button>
                    </> 
                }
            </div>
        </div>
    </div>
  )
}
