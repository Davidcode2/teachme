import { Link, NavLink } from 'react-router-dom';
import CheckMarkIcon from '../../assets/icons/icons8-checkmark-48.png';
import TrashBin from '../../assets/icons/icons8-trash-48.png';
import EditIcon from '../../assets/icons/icons8-edit-48.png';
import SpinnerGif from '../../assets/icons/icons8-spinner.gif';
import addToShoppingCartIcon from '../../assets/icons/icons8-add-shopping-cart-50.png';
import arrowIcon from '../../assets/icons/icons8-arrow-50.png';
import { useAccessTokenStore, useCartStore, useUserStore } from '../../store';
import { useState } from 'react';

interface ActionButtonsProps {
  id: string;
  isMine: string;
  authorId: string;
}

function ActionButtons({ id, isMine, authorId }: ActionButtonsProps) {
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { user } = useUserStore();
  if (!user) return (
    <div className="flex">
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

  const deleteMaterial = () => {
    return async () => {
      setLoading(true);
      const res = await fetch(`/api/materials/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${useAccessTokenStore.getState().accessToken}`,
        }
      });
      if (res.status === 200) {
        setLoading(false);
        window.location.reload();
      }
    }
  }

  return (
    <>
      <div className="flex">
        <div className="hover:cursor-pointer hover:bg-gray-100 rounded-full">
          {!isMine && <img className="" onClick={addToShoppingCart} src={addToShoppingCartIcon} width="30" alt="" />}
        </div>
        <div className="hover:cursor-pointer hover:bg-gray-100 rounded-full">
          {isMine && <a href={`/api/materials/download?id=${id}`} download={id}><img className="rotate-90" src={arrowIcon} width="30" alt="" /></a>}
        </div>
        <div className="">
          {user.author && authorId === user.author.id
            && <div className="flex">
              <a href={`/api/materials/download?id=${id}`} download={id} className="hover:cursor-pointer hover:bg-gray-100 rounded-full"><img className="rotate-90" src={arrowIcon} width="30" alt="" /></a>
              <button className="hover:cursor-pointer hover:bg-gray-100 rounded-full" onClick={deleteMaterial()}><img className="" src={TrashBin} width="30" alt="" /></button>
              <NavLink to={`/materials/${id}/edit`}><img className="hover:cursor-pointer hover:bg-gray-100 rounded-full" src={EditIcon} width="30" alt="" /></NavLink>
            </div>}
        </div>
        <div className="mx-2">
          {loading && <div className=""><img src={SpinnerGif} alt="" width="30" /></div>}
          {showSuccess && <div className=""><img src={CheckMarkIcon} alt="" width="30" /></div>}
        </div>
      </div>
    </>
  )
}

export default ActionButtons;

