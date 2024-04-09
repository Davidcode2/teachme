import { Link } from 'react-router-dom';
import CheckMarkIcon from '../../assets/icons/icons8-checkmark-48.png';
import SpinnerGif from '../../assets/icons/icons8-spinner.gif';
import addToShoppingCartIcon from '../../assets/icons/icons8-add-shopping-cart-50.png';
import arrowIcon from '../../assets/icons/icons8-arrow-50.png';
import { useCartStore, useUserStore } from '../../store';
import { useState } from 'react';

function ActionButtons({ id, path }) {
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { user } = useUserStore();
  if (!user) return (
    <div className="flex">
      <div className="hidden">rating</div>
      <div className="hidden">downloads</div>
      <Link to="/login"><img src={addToShoppingCartIcon} width="30" alt="" /></Link>
    </div>
  )

  const addToShoppingCart = async () => {
    setLoading(true);
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 'userId': user.id, 'materialId': id })
    });
    const data = await res.json();
    setLoading(false);
    showSuccessIndication();
    useCartStore.setState({ cart: data });
  }

  const showSuccessIndication = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 5000);
  }

  return (
    <>
      <div className="flex gap-x-2">
        <div className="hidden">rating</div>
        <div className="hidden">downloads</div>
        <div className="hover:cursor-pointer hover:bg-gray-100 rounded-full">
          <img className="" onClick={addToShoppingCart} src={addToShoppingCartIcon} width="30" alt="" />
        </div>
        {loading ? <div className=""><img src={SpinnerGif} alt="" width="30"/></div> : <></>}
        {showSuccess ? <div className=""><img src={CheckMarkIcon} alt="" width="30" /></div> : <></>}
        {path ?
          <div className="hover:cursor-pointer hover:bg-gray-100 rounded-full">
            <a href={`/api/materials/download?id=${id}`} download={id}><img className="rotate-90" src={arrowIcon} width="30" alt="" /></a>
          </div>
          : <></>
        }
      </div>
    </>
  )
}

export default ActionButtons;

