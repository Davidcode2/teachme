function SignUpForm() {
  return (
    <>
      <div className="h-[80vh] xl:grid grid-cols-[40vw_60vw] justify-center items-center">
      <div>
      <h1 className="m-4 md:m-20 text-9xl font-extrabold">SIGN UP</h1>
      </div>
        <div className="border border-slate-400 rounded-xl p-10 md:p-20 shadow-md xl:w-[30vw] md:m-20 m-4">
          <form className="flex flex-col">
            <div className="grid grid-cols-[100px_1fr]">
              <label className="p-2" htmlFor="email">E-Mail</label>
              <input className="p-2 border-b" id="email" type="email" name="email" />
              <label className="p-2" htmlFor="password">Password</label>
              <input className="p-2 border-b" id="password" type="password" name="password" />
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default SignUpForm;

