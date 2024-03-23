import ArrowIcon from '../../assets/icons/icons8-logout-50.png';
import ChevronIcon from '../../assets/icons/icons8-chevron-24.png';
import { Form, Link } from "react-router-dom";

function LoginForm() {

  return (
    <>
    <Link to="/materials"><img className="p-4 md:px-20" src={ChevronIcon} alt=""/></Link>
      <div className="lg:h-[80vh] xl:grid grid-cols-[40vw_60vw] justify-center items-center">
        <div>
          <h1 className="m-4 md:m-20 text-7xl md:text-9xl font-extrabold">Schön, dass du wieder da bist</h1>
        </div>
        <div className="border border-slate-400 rounded-xl shadow-md xl:w-[30vw] md:m-20 m-4">
          <Form method="post" className="flex flex-col">
            <button className="ml-auto p-4 invisible"><img src={ArrowIcon} width="30" alt="" /></button>
            <div className="grid grid-cols-[.2fr_1fr] gap-y-1 px-4 sm:px-10 2xl:px-20 py-4">
              <label className="p-2" htmlFor="email">E-Mail</label>
              <input className="p-2 rounded-md border-b" id="email" type="email" name="email" maxLength="80" required/>
              <label className="p-2" htmlFor="password">Password</label>
              <input className="p-2 rounded-md border-b" id="password" type="password" name="password" minLength="6" maxLength="20" required />
            </div>
            <button type="submit" className="ml-auto p-4"><img src={ArrowIcon} width="30" alt="" /></button>
          </Form>
        </div>
      </div>
      <div className="flex justify-center my-10">
        <Link to="../signup"><button>Not yet signed up? Join here!</button></Link>
      </div>
    </>
  )
}

export default LoginForm;
