import { Form } from 'react-router-dom'
import Price from './price'

function AddMaterials() {
  return (
    <div className="flex min-w-0 justify-center">
      <div className="relative min-w-0 mx-4 my-8 mb-16 md:my-20">
        <div className="block absolute min-w-0 inset-0 bg-gradient-to-r from-purple-200 via-green-200 to-pink-300 animate-gradient blur-lg lg:blur-2xl" />
        <div className="relative min-w-0 border border-slate-200 rounded-lg bg-white p-10 shadow-2xl">
          <Form className="flex min-w-0 flex-col gap-4" method="post" encType="multipart/form-data">
            <div className="flex flex-col gap-8 w-full sm:w-96 mx-auto">
              <div className="relative md:mb-10 mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-emerald-500 to-purple-800 animate-gradient rounded-full blur-md" />
                <div className="relative flex items-center h-64 w-64 shadow-sm border border-slate-200 rounded-full bg-white p-4">
                  <input
                    className="w-full h-fit py-2 px-4 rounded-md border border-slate-200 min-w-0"
                    type="file"
                    name="file"
                    accept="application/pdf"
                  />
                </div>
              </div>
              <div className="flex-1 flex flex-col md:grid grid-cols-[.2fr_1fr] md:gap-5">
                <label className="p-2" htmlFor="title">Titel</label>
                <input id="title" className="rounded-md border border-slate-200 shadow-sm py-2 px-4 min-w-0" type="text" name="title" />
                <label className="p-2" htmlFor="description">Beschreibung</label>
                <textarea id="description" className="p-2 rounded-md border border-slate-200 shadow-sm min-w-0" name="description" />
                <label className="p-2" htmlFor="price">Preis</label>
                <Price />
              </div>
            </div>
            <button className="border border-slate-200 bg-emerald-500 shadow-sm mt-10 hover:bg-emerald-600 rounded-lg px-4 py-2" type="submit">Erstellen</button>
          </Form>
        </div>
      </div>
    </div>

  )
}

export default AddMaterials
