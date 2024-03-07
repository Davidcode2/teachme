import { Link } from 'react-router-dom';
import UserIcon from '../../assets/icons/icons8-user-32.png';
import fetcher from '../../lib/fetcher';
import useSwr from 'swr';
import { useUserStore } from '../../store';

function Header() {
  const user = useUserStore((state) => state.user);
  if (!user) return (
    <div className="flex p-4">
      <div className="ml-auto">
        <Link to="login" ><img className="" src={UserIcon} alt="User" /></Link>
      </div>
    </div>
  );

  let initials = '';
  if (user.firstName && user.lastName) {
    initials = user.firstName.split('.')[0] + user.lastName.split('.')[1];
  } else {
    initials = '##';
  }

  return (
    <>
      <div className="flex p-4">
        <div className="flex ml-auto gap-2">
          <div className="text-slate-400 relative top-1">{initials}</div>
          <Link to="login" ><img className="" src={UserIcon} alt="User" /></Link>
        </div>
      </div>
    </>
  )
}

export default Header;
