import meow_cat from '../../assets/white_cat_happy.webp';
export default function NoData() {
  setTimeout(() => {
    return (
      <div className="flex flex-col justify-center place-items-center h-[85vh]">
        <img src={meow_cat} className="lg:max-w-[50%] max-w-[80%] rounded-xl" />
        <div className="relative bottom-40">Zeit zu shoppen!</div>
      </div>
    )
  }, 100);
}
