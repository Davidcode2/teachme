import { NavLink } from "react-router";
import { Check, Trash2, Pencil, ShoppingCart, ArrowDown, Loader2 } from "lucide-react";
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
        <ShoppingCart className="h-6 w-6" />
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
            <button onClick={addToShoppingCart}>
              <ShoppingCart className="h-6 w-6 cursor-pointer" />
            </button>
          )}
        </div>
        <div className="rounded-full transition-transform duration-100 ease-in hover:-translate-y-1 hover:cursor-pointer">
          {isMine && !isAuthor && (
            <button onClick={downloadMaterial}>
              <ArrowDown className="h-6 w-6" />
            </button>
          )}
        </div>
        <div className="">
          {isAuthor && (
            <div className="flex">
              <button
                onClick={downloadMaterial}
                className="rounded-full transition-transform duration-100 ease-in hover:-translate-y-1 hover:cursor-pointer"
              >
                <ArrowDown className="h-6 w-6" />
              </button>
              <button
                id="deleteMaterialButton"
                className="rounded-full transition-transform duration-100 ease-in hover:-translate-y-1 hover:cursor-pointer"
                onClick={showDeleteMaterialModal}
              >
                <Trash2 className="h-6 w-6" />
              </button>
              <NavLink to={`/materials/${id}/edit`}>
                <Pencil className="h-6 w-6 rounded-full transition-transform duration-100 ease-in hover:-translate-y-1 hover:cursor-pointer" />
              </NavLink>
            </div>
          )}
        </div>
        <div className="mx-2">
          {loading && (
            <div className="">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          )}
          {showSuccess && (
            <div className="">
              <Check className="h-6 w-6" />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ActionButtons;
