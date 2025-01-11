import { Form, useActionData } from "react-router";
import EditIcon from "../../../assets/icons/icons8-edit-48.png";
import { useUserStore } from "../../../store";
import { useEffect, useState } from "react";
import React from "react";
import IconLink from "../../styling/iconLink";

export default function AddMaterialSuccess() {
  const userStore = useUserStore();
  const hasDisplayName = userStore.user?.displayName;
  const [editName, setEditName] = useState(!hasDisplayName);
  const inputRef = React.createRef<HTMLInputElement>();
  const displayName = useActionData();

  const NameForm = (
    <Form method="patch" onSubmit={() => setEditName(false)}>
      <input
        className="mx-auto my-3 w-52 min-w-0 rounded-md border border-slate-200 px-4 py-2 shadow-sm"
        type="text"
        placeholder="Nutzername"
        name="displayName"
        ref={inputRef}
        defaultValue={displayName}
        required
      />
    </Form>
  );

  const focusEditName = () => {
    setEditName(true);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [focusEditName]);

  const getUsername = (
    <div className="flex min-w-0 flex-col justify-center">
      {!displayName && (
        <>
          <p className="mb-4 text-center">
            Damit dein Material von anderen Nutzern gefunden werden kann, füge
            bitte einen Nutzernamen hinzu.
          </p>
          {NameForm}
        </>
      )}
      {displayName && (
        <>
          <p className="py-4 text-lg font-bold">Schön, dass du bei uns bist</p>
          {editName && NameForm}
          {!editName && (
            <div className="grid grid-cols-3 gap-2 py-4 text-2xl font-bold">
              <div className="col-start-2">{displayName}</div>
              <button
                className="w-5 opacity-50"
                onClick={() => focusEditName()}
              >
                <img src={EditIcon} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );

  return (
    <div className="flex min-w-0 justify-center">
      <div className="relative mx-4 my-8 mb-16 min-w-0 md:my-20">
        <div className="animate-gradient absolute inset-0 block min-w-0 bg-gradient-to-r from-purple-200 via-green-200 to-pink-300 blur-lg lg:blur-2xl" />
        <div className="relative flex min-w-0 flex-col gap-y-4 rounded-lg border border-slate-200 bg-white p-10 text-center shadow-2xl">
          <h4 className="pb-4 text-2xl font-bold">Herzlichen Glückwunsch!</h4>
          <p>Dein Material wurde erfolgreich hinzugefügt.</p>
          {!hasDisplayName && getUsername}
          <div>
            <IconLink
              linkText="Weiteres Material hinzufügen"
              link="/materials/add"
            />
            <IconLink
              linkText="Dein Werk bewundern"
              link="/materials/mine/workspace"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
