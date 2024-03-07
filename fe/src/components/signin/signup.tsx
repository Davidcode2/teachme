import { Form, Link, redirect } from 'react-router-dom';
import ChevronIcon from '../../assets/icons/icons8-chevron-24.png';
import ArrowIcon from '../../assets/icons/icons8-logout-50.png';

export async function handleSubmit({ request }) {
  const formData = await request.formData();
  const response = await fetch('http://localhost:3000/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(Object.fromEntries(formData))
  });

  const responseData = await response.json();
  if (responseData === true) {
    return redirect('/login');
  }
  return false;
};

function SignUpForm() {

  return (
    <>
      <Link to="/"><img className="p-4 md:px-20" src={ChevronIcon} alt="" /></Link>
      <div className="lg:h-[80vh] xl:grid grid-cols-[40vw_60vw] justify-center items-center">
        <div>
          <h1 className="m-4 md:m-20 text-9xl font-extrabold">Will<br />kom<br />men Lehrkraft</h1>
        </div>
        <div className="border border-slate-400 rounded-xl shadow-md xl:w-[30vw] md:m-20 m-4">
          <Form method="post" className="flex flex-col">
            <button className="ml-auto p-4 invisible"><img src={ArrowIcon} width="30" alt="" /></button>
            <div className="grid grid-cols-[.2fr_1fr] px-10 2xl:px-20 py-4">
              <label className="p-2" htmlFor="email">E-Mail</label>
              <input className="p-2 rounded-md border-b" id="email" type="email" name="email" />
              <label className="p-2" htmlFor="password">Password</label>
              <input className="p-2 rounded-md border-b" id="password" type="password" name="password" />
            </div>
            <button type="submit" className="ml-auto p-4"><img src={ArrowIcon} width="30" alt="" /></button>
          </Form>
        </div>
      </div>
      <div className="flex justify-center">
        <Link to="../login"><button>Already Signed up? Login here!</button></Link>
      </div>
    </>
  )
}

export default SignUpForm;

