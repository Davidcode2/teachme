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
          className="border-border bg-surface-base dark:bg-surface-raised flex flex-row gap-5 rounded-lg border p-10 shadow-lg"
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
            <hr className="text-border" />
            <div className="flex gap-10">
              <button
                className="bg-tone-informative hover:bg-tone-informative-muted dark:text-text-inverse cursor-pointer rounded-lg p-4"
                onClick={() => props.setShowDeleteModal(false)}
              >
                Abbrechen
              </button>
              <button
                className="bg-accent-muted hover:bg-accent-weak dark:text-text-inverse cursor-pointer rounded-lg p-4"
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
