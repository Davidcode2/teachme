import { Link, redirect } from 'react-router-dom';
import ArrowIcon from '../../assets/icons/icons8-logout-50.png';

export const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const form = e.target;
    const formData = new FormData(form);
    const response = await fetch('http://localhost:3000/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(Object.fromEntries(formData))
    });

    const responseData = await response.json();
    if (responseData === true) {
      return redirect('/');
    }
  } catch (error) {
  }
};


function SignUpForm() {

  return (
    <>
      <div className="lg:h-[80vh] xl:grid grid-cols-[40vw_60vw] justify-center items-center">
        <div>
          <h1 className="m-4 md:m-20 text-9xl font-extrabold">Will<br />kom<br />men Lehrkraft</h1>
        </div>
        <div className="border border-slate-400 rounded-xl shadow-md xl:w-[30vw] md:m-20 m-4">
          <form onSubmit={handleSubmit} className="flex flex-col">
            <button className="ml-auto p-4 invisible"><img src={ArrowIcon} width="30" alt="" /></button>
            <div className="grid grid-cols-[100px_1fr] px-10 2xl:px-20 py-4">
              <label className="p-2" htmlFor="email">E-Mail</label>
              <input className="p-2 rounded-md border-b" id="email" type="email" name="email" />
              <label className="p-2" htmlFor="password">Password</label>
              <input className="p-2 rounded-md border-b" id="password" type="password" name="password" />
            </div>
            <button type="submit" className="ml-auto p-4"><img src={ArrowIcon} width="30" alt="" /></button>
          </form>
        </div>
      </div>
      <div className="flex justify-center">
        <Link to="../login"><button>Already Signed up? Login here!</button></Link>
      </div>
    </>
  )
}

export default SignUpForm;

