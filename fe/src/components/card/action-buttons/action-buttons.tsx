import { Link, NavLink } from "react-router-dom";
import CheckMarkIcon from "../../../assets/icons/icons8-checkmark-48.png";
import TrashBin from "../../../assets/icons/icons8-trash-48.png";
import EditIcon from "../../../assets/icons/icons8-edit-48.png";
import SpinnerGif from "../../../assets/icons/icons8-spinner.gif";
import addToShoppingCartIcon from "../../../assets/icons/icons8-add-shopping-cart-50.png";
import arrowIcon from "../../../assets/icons/icons8-arrow-50.png";
import { useUserStore } from "../../../store";
import { useState } from "react";
import DeleteMaterialModal from "./deleteMaterialModal";
import CartService from "../../../services/cart.service";

interface ActionButtonsProps {
  id: string;
  isMine: string;
  authorId: string;
  title: string;
}

function ActionButtons({ id, isMine, authorId, title }: ActionButtonsProps) {
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventListenerRegistered, setEventListenerRegistered] = useState(false);

  const { user } = useUserStore();
  if (!user)
    return (
      <div className="flex">
        <Link to="/login">
          <img src={addToShoppingCartIcon} width="30" alt="" />
        </Link>
      </div>
    );

  const addToShoppingCart = async () => {
    setLoading(true);
    await new CartService().addItem(id);
    setLoading(false);
    showSuccessIndication();
  };

  const showSuccessIndication = () => {
    setShowSuccess(true);
  };

  const showDeleteMaterialModal = () => {
    setShowDeleteModal(true);
  };

  if (!eventListenerRegistered && showDeleteModal === true) {
    document.body.addEventListener("click", (e: any) => {
      if (e.target.closest("#deleteMaterialButton")) return;
      if (e.target.closest("#deleteModal")) return;
      setShowDeleteModal(false);
    });
    setEventListenerRegistered(true);
  }

  const isAuthor = user && authorId === user.authorId;

  return (
    <>
      {showDeleteModal && (
        <DeleteMaterialModal
          title={title}
          setLoading={setLoading}
          setShowDeleteModal={setShowDeleteModal}
          id={id}
        />
      )}
      <div id="main" className="flex">
        <div className="rounded-full hover:cursor-pointer hover:bg-gray-100">
          {!isMine && (
            <img
              className=""
              onClick={addToShoppingCart}
              src={addToShoppingCartIcon}
              width="30"
              alt=""
            />
          )}
        </div>
        <div className="rounded-full hover:cursor-pointer hover:bg-gray-100">
          {isMine && !isAuthor && (
            <a href={`/api/materials/download?id=${id}`} download={id}>
              <img className="rotate-90" src={arrowIcon} width="30" alt="" />
            </a>
          )}
        </div>
        <div className="">
          {isAuthor && (
            <div className="flex">
              <a
                href={`/api/materials/download?id=${id}`}
                download={id}
                className="rotate-90 rounded-full hover:cursor-pointer hover:bg-gray-100"
              >
                <img className="" src={arrowIcon} width="30" alt="" />
              </a>
              <button
                id="deleteMaterialButton"
                className="rounded-full hover:cursor-pointer hover:bg-gray-100"
                onClick={showDeleteMaterialModal}
              >
                <img className="" src={TrashBin} width="30" alt="" />
              </button>
              <NavLink to={`/materials/${id}/edit`}>
                <img
                  className="rounded-full hover:cursor-pointer hover:bg-gray-100"
                  src={EditIcon}
                  width="30"
                  alt=""
                />
              </NavLink>
            </div>
          )}
        </div>
        <div className="mx-2">
          {loading && (
            <div className="">
              <img src={SpinnerGif} alt="" width="30" />
            </div>
          )}
          {showSuccess && (
            <div className="">
              <img src={CheckMarkIcon} alt="" width="30" />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ActionButtons;
