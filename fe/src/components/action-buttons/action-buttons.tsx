import { Link } from 'react-router-dom';
import addToShoppingCartIcon from '../../assets/icons/icons8-add-shopping-cart-50.png';
import arrow from '../../assets/icons/icons8-arrow-50.png';
import { useUserStore } from '../../store';

function ActionButtons({ id, path }) {
  const user = useUserStore.getState().user;
  if (!user) return (
    <div className="flex">
      <div className="hidden">rating</div>
      <div className="hidden">downloads</div>
      <Link to="/login"><img src={addToShoppingCartIcon} width="30" alt="" /></Link>
    </div>
  )

  const addToShoppingCart = async () => {
    const res = await fetch('api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 'userId': user.id, 'materialId': id })
    });
  }

  const downloadMaterial = async () => {
//    const res = await fetch(`api/materials/download?id=${id}`, {
 //     method: 'GET',
  //  });
    const anchorTag = document.createElement('a');
    anchorTag.download = `api/materials/download?id=${id}`;
    anchorTag.click();
  }

  return (
    <>
      <div className="flex">
        <div className="hidden">rating</div>
        <div className="hidden">downloads</div>
        <div className="hover:cursor-pointer hover:bg-gray-100 rounded-full">
          <img className="" onClick={addToShoppingCart} src={addToShoppingCartIcon} width="30" alt="" />
        </div>
        {path ?
          <div className="hover:cursor-pointer hover:bg-gray-100 rounded-full">
            <a href={`api/materials/download?id=${id}`} download={id}><img className="rotate-90" onClick={downloadMaterial} src={arrow} width="30" alt="" /></a>
          </div>
          : <></>
        }
      </div>
    </>
  )
}

export default ActionButtons;

