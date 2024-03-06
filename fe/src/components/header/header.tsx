import UserIcon from '../../assets/icons/icons8-user-32.png';

function Header() {
  return (
    <>
      <div className="p-4">
        <img className="ml-auto" src={UserIcon} alt="User" />
      </div>
    </>
  )
}

export default Header;
