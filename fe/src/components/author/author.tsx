import userIcon from '../../assets/icons/icons8-user-32.png';

type AppProps = {
  author: string
  published: Date
}

function Author(props: AppProps) {

  return (
    <div className="flex items-center gap-2">
      <img src={userIcon} alt="" width="40"/>
      <div>
        <div className="font-bold">
          {props.author}
        </div>
        <div>
          {new Date(props.published).toLocaleString("de-DE", { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>
    </div>
  )

}

export default Author
