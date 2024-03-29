import { Link } from 'react-router-dom';
import addToShoppingCartIcon from '../../assets/icons/icons8-add-shopping-cart-50.png';
import { useUserStore } from '../../store';

function ActionButtons({ materialId }) {

  const user = useUserStore.getState().user;
  if (!user) return (
    <div className="flex">
      <div className="hidden">rating</div>
      <div className="hidden">downloads</div>
      <Link to="/login"><img src={addToShoppingCartIcon} width="30" alt="" /></Link>
    </div>
  )
  const consumerId = user.consumerId;


  const addToShoppingCart = async () => {
    const res = await fetch('api/consumer/addToCart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 'materialId': materialId, 'consumerId': consumerId })
    });
    console.log(user);
    console.log(consumerId);
  }

  return (
    <>
      <div className="flex">
        <div className="hidden">rating</div>
        <div className="hidden">downloads</div>
        <div className="hover:cursor-pointer hover:bg-gray-100 rounded-full">
          <img className="" onClick={addToShoppingCart} src={addToShoppingCartIcon} width="30" alt="" />
        </div>
      </div>
    </>
  )
}

export default ActionButtons;

