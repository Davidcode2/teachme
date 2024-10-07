import { useAccessTokenStore } from "../../store";

type PropTypes = {
  title: string,
  id: string,
  setShowDeleteModal: (arg0: boolean) => void,
  setLoading: (arg0: boolean) => void
}

export default function DeleteMaterialModal(props: PropTypes) {

  const deleteMaterial = () => {
    console.log("deleteMaterial");
    return async () => {
      props.setLoading(true);
      const res = await fetch(`/api/materials/${props.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${useAccessTokenStore.getState().accessToken}`,
        }
      });
      if (res.status === 200) {
        props.setLoading(false);
        props.setShowDeleteModal(false);
        window.location.reload();
      }
    }
  }

  return (
    <>
      <div className="fixed left-0 top-0 h-screen w-screen backdrop-blur-sm z-50">
        <div className="flex justify-center items-center h-full">
          <div id="deleteModal" className="flex flex-row bg-white p-10 border rounded-lg shadow-lg gap-5">
            <div className="overflow-scroll h-[25vh]">
            </div>
            <div className="flex flex-col justify-between">
              <div className="xl:text-4xl text-2xl">
                Sind Sie sicher, dass Sie
                <div className="font-bold">{props.title || "dieses Material"}</div> löschen möchten?
              </div>
              <hr />
              <div className="flex gap-10">
              <button className="p-4 bg-sky-300 rounded-lg hover:bg-sky-400" onClick={() => props.setShowDeleteModal(false)}>Abbrechen</button>
              <button className="p-4 bg-purple-200 rounded-lg hover:bg-purple-300" onClick={deleteMaterial()}>Ja, löschen</button>
              </div>
            </div>
          </div>
        </div>
      </div >
    </>
  )
}
