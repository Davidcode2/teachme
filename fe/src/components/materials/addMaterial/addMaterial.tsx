import { Form } from 'react-router-dom'
import Price from './price'

function AddMaterials() {
  return (
    <div className="my-10 md:my-40 mx-4 sm:mx-32 xl:mx-60">
      <Form className="flex flex-col gap-4" method="post" encType="multipart/form-data">
        <div className="flex flex-col gap-8 w-full md:w-96 mx-auto">
          <div className="relative md:mb-10">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-emerald-500 to-purple-800 animate-gradient rounded-full blur-md" />
            <div className="relative shadow-sm border border-slate-200 rounded-lg bg-white p-4">
              <input
                className="w-full py-2 px-4 rounded-md border border-slate-200 min-w-0"
                type="file"
                name="file"
              />
            </div>
          </div>
          <div className="flex-1 flex flex-col md:grid grid-cols-[.2fr_1fr] md:gap-10">
            <label className="p-2" htmlFor="title">Titel</label>
            <input id="title" className="rounded-md border border-slate-200 shadow-sm py-2 px-4 min-w-0" type="text" name="title" />
            <label className="p-2" htmlFor="description">Beschreibung</label>
            <textarea id="description" className="p-2 rounded-md border border-slate-200 shadow-sm min-w-0" name="description" />
            <label className="p-2" htmlFor="price">Preis</label>
            <Price />
          </div>
        </div>
        <button className="ml-auto border border-slate-200 shadow-sm rounded-lg px-4 py-2" type="submit">Erstellen</button>
      </Form>
    </div>

  )
}

export default AddMaterials
