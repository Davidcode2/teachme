import { Form } from "react-router";
import { customFetch } from "../../actions/customFetch";
import CheckMarkIcon from "../../assets/icons/icons8-checkmark-48.png";
import { useUserStore } from "../../store";

type PropTypes = { 
  setEditUserName: any,
  displayName: string,
  editNameRef: any,
  user: any 
}
export default function EditUserName({ setEditUserName, displayName, editNameRef, user }: PropTypes) {

  const handleDisplayNameSubmit = async (e: any) => {
    setEditUserName(false);
    const res = await customFetch("/api/users", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ displayName: e.target.displayName.value }),
    });
    if (res.status === 200) {
      useUserStore.getState().setUser({
        ...user,
        displayName: e.target.displayName.value,
      });
    }
  };

  return (
    <Form
      className="userMenu flex justify-center gap-1"
      onSubmit={handleDisplayNameSubmit}
    >
      <input
        className="userMenu max-w-40 min-w-0 rounded-full border border-slate-200 p-1 px-4 text-stone-900 shadow-sm"
        type="text"
        placeholder={displayName || "Dein Name hier! Wow!"}
        name="displayName"
        ref={editNameRef}
      />
      <button
        className="userMenu min-w-0 rounded-lg border border-slate-200 bg-green-200 p-1 shadow-sm hover:bg-green-300"
        type="submit"
      >
        <img className="userMenu" src={CheckMarkIcon} width="20" />
      </button>
      <button
        className="userMenu font-handwriting min-w-0 rounded-lg border border-slate-200 bg-red-200 p-1 px-2 text-sm shadow-sm hover:bg-red-300"
        onClick={() => setEditUserName(false)}
      >
        X
      </button>
    </Form>
  );
}
