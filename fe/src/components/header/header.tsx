import { Link } from 'react-router-dom';
import UserIcon from '../../assets/icons/icons8-user-32.png';

function Header() {

  return (
    <>
      <div className="p-4">
        <Link to="login" ><img className="ml-auto" src={UserIcon} alt="User" /></Link>
      </div>
    </>
  )
}

export default Header;
