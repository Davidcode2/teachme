import { useAccessTokenStore } from "../../store";

type PropTypes = {
  title: string;
  id: string;
  setShowDeleteModal: (arg0: boolean) => void;
  setLoading: (arg0: boolean) => void;
};

export default function DeleteMaterialModal(props: PropTypes) {
  const deleteMaterial = () => {
    return async () => {
      props.setLoading(true);
      const res = await fetch(`/api/materials/${props.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${useAccessTokenStore.getState().accessToken}`,
        },
      });
      if (res.status === 200) {
        props.setLoading(false);
        props.setShowDeleteModal(false);
        window.location.reload();
      }
    };
  };

  return (
    <>
      <div className="fixed left-0 top-0 z-50 h-screen w-screen backdrop-blur-sm">
        <div className="flex h-full items-center justify-center">
          <div
            id="deleteModal"
            className="flex flex-row gap-5 rounded-lg border bg-white p-10 shadow-lg"
          >
            <div className="h-[25vh] overflow-scroll"></div>
            <div className="flex flex-col justify-between">
              <div className="text-2xl xl:text-4xl">
                Sind Sie sicher, dass Sie
                <div className="font-bold">
                  {props.title || "dieses Material"}
                </div>{" "}
                löschen möchten?
              </div>
              <hr />
              <div className="flex gap-10">
                <button
                  className="rounded-lg bg-sky-300 p-4 hover:bg-sky-400"
                  onClick={() => props.setShowDeleteModal(false)}
                >
                  Abbrechen
                </button>
                <button
                  className="rounded-lg bg-purple-200 p-4 hover:bg-purple-300"
                  onClick={deleteMaterial()}
                >
                  Ja, löschen
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
