import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <div>
        <Link to='/'>Home </Link>
        <Link to='/calendar'>Calendar </Link>
        <Link to='/timer'>Timer</Link>
    </div>
  )
}
