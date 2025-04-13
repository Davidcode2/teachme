import { customFetch } from "../../../actions/customFetch";
import CenteredModal from "../../styling/centeredModal";

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
      const res = await customFetch(`/api/materials/${props.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
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
      <CenteredModal>
        <div
          id="deleteModal"
          className="flex flex-row gap-5 rounded-lg border border-slate-200 bg-white p-10 shadow-lg dark:bg-slate-800"
        >
          <div className="h-[25vh]"></div>
          <div className="flex flex-col justify-between">
            <div className="text-2xl xl:text-4xl">
              Sind Sie sicher, dass Sie
              <div className="font-bold">
                {props.title || "dieses Material"}
              </div>{" "}
              löschen möchten?
            </div>
            <hr className="text-slate-200" />
            <div className="flex gap-10">
              <button
                className="rounded-lg bg-sky-300 p-4 hover:bg-sky-400 dark:text-slate-900"
                onClick={() => props.setShowDeleteModal(false)}
              >
                Abbrechen
              </button>
              <button
                className="rounded-lg bg-purple-200 p-4 hover:bg-purple-300 dark:text-slate-900"
                onClick={deleteMaterial()}
              >
                Ja, löschen
              </button>
            </div>
          </div>
        </div>
      </CenteredModal>
    </>
  );
}
