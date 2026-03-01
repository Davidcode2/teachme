import { Form } from "react-router";
import { customFetch } from "../../actions/customFetch";
import CheckMarkIcon from "../../assets/icons/icons8-checkmark-48.png";
import { useUserStore } from "../../store";

type PropTypes = {
  setEditUserName: any;
  displayName: string;
  editNameRef: any;
  user: any;
};
export default function EditUserName({
  setEditUserName,
  displayName,
  editNameRef,
  user,
}: PropTypes) {
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
        className="userMenu border-border text-text-primary max-w-40 min-w-0 rounded-full border p-1 px-4 shadow-sm"
        type="text"
        placeholder={displayName || "Dein Name hier! Wow!"}
        name="displayName"
        ref={editNameRef}
      />
      <button
        className="userMenu border-border bg-success/20 hover:bg-success/30 min-w-0 rounded-lg border p-1 shadow-sm"
        type="submit"
      >
        <img className="userMenu" src={CheckMarkIcon} width="20" />
      </button>
      <button
        className="userMenu font-handwriting border-border bg-alert/20 hover:bg-alert/30 min-w-0 rounded-lg border p-1 px-2 text-sm shadow-sm"
        onClick={() => setEditUserName(false)}
      >
        X
      </button>
    </Form>
  );
}
