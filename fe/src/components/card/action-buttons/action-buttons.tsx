import { NavLink } from "react-router";
import CheckMarkIcon from "../../../assets/icons/icons8-checkmark-48.png";
import TrashBin from "../../../assets/icons/icons8-trash-48.png";
import EditIcon from "../../../assets/icons/icons8-edit-48.png";
import SpinnerGif from "../../../assets/icons/icons8-spinner.gif";
import addToShoppingCartIcon from "../../../assets/icons/icons8-add-shopping-cart-50.png";
import arrowIcon from "../../../assets/icons/icons8-arrow-50.png";
import { useState } from "react";
import DeleteMaterialModal from "./deleteMaterialModal";
import CartService from "../../../services/cart.service";
import { useAuth } from "react-oidc-context";
import { customFetch } from "../../../actions/customFetch";

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
  const auth = useAuth();

  if (!auth.isAuthenticated)
    return (
      <button
        onClick={() => auth.signinRedirect()}
        className="flex rounded-full transition-transform duration-100 ease-in hover:-translate-y-1 hover:cursor-pointer"
      >
        <img src={addToShoppingCartIcon} width="25" alt="" />
      </button>
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

  const downloadMaterial = async () => {
    const res = await customFetch(`/api/materials/download?id=${id}`);
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = id; // Set the download filename
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const isAuthor =
    auth.isAuthenticated && authorId === sessionStorage.getItem("authorId");

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
        <div className="rounded-full transition-transform duration-100 ease-in hover:-translate-y-1 hover:cursor-pointer">
          {!isMine && (
            <button>
              <img
                className=""
                onClick={addToShoppingCart}
                src={addToShoppingCartIcon}
                width="25"
                alt=""
              />
            </button>
          )}
        </div>
        <div className="rounded-full transition-transform duration-100 ease-in hover:-translate-y-1 hover:cursor-pointer">
          {isMine && !isAuthor && (
            <button onClick={downloadMaterial}>
              <img className="rotate-90" src={arrowIcon} width="25" alt="" />
            </button>
          )}
        </div>
        <div className="">
          {isAuthor && (
            <div className="flex">
              <button
                onClick={downloadMaterial}
                className="rotate-90 rounded-full transition-transform duration-100 ease-in hover:-translate-y-1 hover:cursor-pointer"
              >
                <img className="" src={arrowIcon} width="25" alt="" />
              </button>
              <button
                id="deleteMaterialButton"
                className="rounded-full transition-transform duration-100 ease-in hover:-translate-y-1 hover:cursor-pointer"
                onClick={showDeleteMaterialModal}
              >
                <img className="" src={TrashBin} width="25" alt="" />
              </button>
              <NavLink to={`/materials/${id}/edit`}>
                <img
                  className="rounded-full transition-transform duration-100 ease-in hover:-translate-y-1 hover:cursor-pointer"
                  src={EditIcon}
                  width="25"
                  alt=""
                />
              </NavLink>
            </div>
          )}
        </div>
        <div className="mx-2">
          {loading && (
            <div className="">
              <img src={SpinnerGif} alt="" width="25" />
            </div>
          )}
          {showSuccess && (
            <div className="">
              <img src={CheckMarkIcon} alt="" width="25" />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ActionButtons;
