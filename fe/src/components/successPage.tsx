import { Link } from "react-router-dom"

export default function SuccessPage() {
  return (
    <>
      <div className="flex gap-10 justify-center items-center h-screen">
        <Link to="/materials">Weiter shoppen</Link>
        <div className="text-5xl">
          Yay! Du hast es geschafft!
        </div>
      <Link to="/materials/mine">Zu meinen Materialien</Link>
      </div>
    </>
  )
}
