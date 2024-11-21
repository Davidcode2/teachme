function Skeleton() {

  return (
    <>
      <div className="bg-white border-gray-300 border m-4 md:mb-10 md:mx-10 rounded-lg flex flex-col md:flex-row shadow-lg">
        <div className="bg-white md:w-[400px] lg:w-[600px] rounded-t-lg md:rounded-tr-none md:rounded-l-lg min-h-96">
        </div>
        <div className="bg-white p-10 flex flex-col flex-1 gap-4 overflow-auto md:rounded-r-lg rounded-b-lg md:rounded-bl-none md:border-l md:border-t-0 border-t border-slate-200">
          <div className="flex flex-col gap-2">
            <div className="text-2xl h-8 w-24 bg-gray-300 rounded-xl"></div>
            <div className="text-2xl h-4 w-80 bg-gray-200 rounded-xl"></div>
            <div className="text-2xl h-4 w-36 bg-gray-200 rounded-xl"></div>
            <div className="text-2xl h-4 w-52 bg-gray-200 rounded-xl"></div>
          </div>
          <p className="text-3xl text-emerald-500 bg-emerald-100 h-8 w-28 rounded-xl"></p>
          <div className="flex mt-auto gap-2">
            <div className="text-2xl h-8 w-8 bg-gray-200 rounded-xl"></div>
            <div className="text-2xl h-8 w-8 bg-gray-200 rounded-xl"></div>
            <div className="text-2xl h-8 w-8 bg-gray-200 rounded-xl"></div>
            <div className="ml-auto self-end">
              <div className="text-2xl h-4 w-52 bg-gray-300 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Skeleton
