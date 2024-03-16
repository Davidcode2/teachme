import { Link, NavLink } from 'react-router-dom';
import hamburgerIcon from "../../assets/icons/icons8-hamburger-50.png"
import UserIcon from '../../assets/icons/icons8-user-32.png';
import { useSidebarStore, useUserStore } from '../../store';

function Header() {
  const user = useUserStore((state) => state.user);
  if (!user) return (
    <>
      <div className="p-4">
        <div className="flex justify-between gap-1">
          <div className="hidden md:flex items-center gap-2">
            <NavLink to="materials" end
              className={({ isActive, isPending }) =>
                isPending ? "border-b border-slate-200" : isActive ? "border-b border-blue-800" : "border-none"
              }
            >Browse</NavLink>
            <NavLink to="login" end
              className={({ isActive, isPending }) =>
                isPending ? "border-b border-slate-200" : isActive ? "border-b border-blue-800" : "border-none"
              }
            >Mine</NavLink>
          </div>
          <div className="flex gap-2">
            <input className="min-w-0 rounded-full border border-slate-200 shadow-sm py-2 px-4" type="text" />
            <NavLink
              to="login"><button className="border border-slate-200 shadow-sm rounded-lg px-4 py-2">Add</button></NavLink>
          </div>
          <div className="flex items-center gap-2">
            <Link to="login" className="" ><img className="min-w-5" src={UserIcon} width="30" alt="User" /></Link>
            <button className="" onClick={useSidebarStore().toggleSidebar}><img src={hamburgerIcon} width="30" alt="" /></button>
          </div>
        </div>
        <div className="flex md:hidden mt-4 gap-2">
          <NavLink to="materials" end
            className={({ isActive, isPending }) =>
              isPending ? "border-b border-slate-200" : isActive ? "border-b border-blue-800" : "border-none"
            }
          >Browse</NavLink>
          <NavLink to="login" end
            className={({ isActive, isPending }) =>
              isPending ? "border-b border-slate-200" : isActive ? "border-b border-blue-800" : "border-none"
            }
          >Mine</NavLink>
        </div>
      </div>
    </>
  );

  let initials = '';
  if (user.firstName && user.lastName) {
    initials = user.firstName.split('.')[0] + user.lastName.split('.')[1];
  } else {
    initials = '##';
  }

  return (
    <>
      <div className="p-4">
        <div className="flex justify-between gap-1">
          <div className="hidden md:flex items-center gap-2">
            <NavLink to="materials" end
              className={({ isActive, isPending }) =>
                isPending ? "border-b border-slate-200" : isActive ? "border-b border-blue-800" : "border-none"
              }
            >Browse</NavLink>
            <NavLink to="materials/mine" end
              className={({ isActive, isPending }) =>
                isPending ? "border-b border-slate-200" : isActive ? "border-b border-blue-800" : "border-none"
              }
            >Mine</NavLink>
          </div>
          <div className="flex gap-2">
            <input className="min-w-0 rounded-full border border-slate-200 shadow-sm py-2 px-4" type="text" />
            <NavLink className={({ isActive }) => isActive ? "text-blue-400 border-blue-400 border rounded-lg" : "border-none"}
              to="materials/add"><button className="border border-slate-200 shadow-sm rounded-lg px-4 py-2">Add</button></NavLink>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-slate-400 hidden sm:block">{initials}</div>
            <Link to="login" className="" ><img className="min-w-5" src={UserIcon} width="30" alt="User" /></Link>
          </div>
        </div>
        <div className="flex md:hidden mt-4 gap-2">
          <NavLink to="materials" end
            className={({ isActive, isPending }) =>
              isPending ? "border-b border-slate-200" : isActive ? "border-b border-blue-800" : "border-none"
            }
          >Browse</NavLink>
          <NavLink to="materials/mine" end
            className={({ isActive, isPending }) =>
              isPending ? "border-b border-slate-200" : isActive ? "border-b border-blue-800" : "border-none"
            }
          >Mine</NavLink>
        </div>
      </div>
    </>
  )
}

export default Header;
