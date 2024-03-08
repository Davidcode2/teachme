import { Form } from 'react-router-dom'
import Card from '../../components/card/card'
import Material from '../../DTOs/material'

function AddMaterials() {
  return (
    <div className="lg:my-40 lg:mx-60">
      <Form className="flex flex-col gap-4" method="post">
        <div className="flex gap-4">
          <div className="border border-slate-200 rounded-lg">
            <input type="file" />
          </div>
          <div className="flex-1 grid grid-cols-[.2fr_1fr] gap-10">
            <label className="p-2" htmlFor="title">Titel</label>
            <input id="title" className="rounded-md border border-slate-200 shadow-sm py-2 px-4" type="text" name="title" />
            <label className="p-2" htmlFor="description">Beschreibung</label>
            <textarea id="description" className="p-2 rounded-md border border-slate-200 shadow-sm" name="description" />
            <label className="p-2" htmlFor="price">Preis</label>
            <input id="price" className="rounded-md border border-slate-200 shadow-sm py-2 px-4" type="number" name="price" />
          </div>
        </div>
        <button className="ml-auto border border-slate-200 shadow-sm rounded-lg px-4 py-2" type="submit">Erstellen</button>
      </Form>
    </div>

  )
}

export default AddMaterials
