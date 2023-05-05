import { Link } from 'react-router-dom'
import styles from "./Navbar.module.scss"

export default function Navbar() {
  return (
    <div className={styles.navContainer}>
        <div className={styles.navLinks}>
            <Link to='/' className={styles.navLink}>Home </Link>
            <Link to='/tasks'>Tasks </Link>
            <Link to='/timer'>Timer </Link>
            <Link to='/projects'>Projects </Link>
        </div>
    </div>
  )
}
