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

  const buyMaterial = async () => {
    const res = await fetch('http://localhost:3000/consumer/buy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 'materialId': materialId, 'consumerId': consumerId })
    });
    console.log(user);
    console.log(consumerId);
    const body = await res.json()
    window.location.href = body.url
  }

  return (
    <>
      <div className="flex">
        <div className="hidden">rating</div>
        <div className="hidden">downloads</div>
        <img onClick={buyMaterial} src={addToShoppingCartIcon} width="30" alt="" />
      </div>
    </>
  )
}

export default ActionButtons;

