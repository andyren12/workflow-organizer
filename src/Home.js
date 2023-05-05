import { GoogleLogin } from './GoogleLogin'
import styles from './Home.module.scss';

export default function Home() {
  const { session, supabase, isLoading, user } = GoogleLogin();

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
    <div className={styles.bg}>
        <div className={styles.welcomeBox}>
            {session ? 
                <>
                    <h2>Welcome {user.user_metadata.name.substr(0, user.user_metadata.name.indexOf(" "))}</h2>
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
  )
}
