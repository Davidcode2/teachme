import { Link } from 'react-router-dom';
import UserIcon from '../../assets/icons/icons8-user-32.png';
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
      <div className="flex p-4 justify-between gap-1">
        <h1 className="hidden md:block text-xl">TeachMe</h1>
        <div className="flex gap-2">
          <input className="min-w-0 rounded-full border border-slate-200 shadow-sm py-2 px-4" type="text" />
          <Link to="materials/add"><button className="border border-slate-200 shadow-sm rounded-lg px-4 py-2">Add</button></Link>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-slate-400 hidden sm:block">{initials}</div>
          <Link to="login" className="" ><img className="min-w-5" src={UserIcon} width="30" alt="User" /></Link>
        </div>
      </div>
    </>
  )
}

export default Header;
