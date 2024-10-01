import SpinnerGif from './assets/icons/icons8-spinner.gif'
import { useEffect, useState } from 'react';
import { UserService } from '../../services/userService';
import { useAvatarStore } from '../../store';
import AuthorDTO from '../../DTOs/author';

type AppProps = {
  author: AuthorDTO
  published: Date
}

function Author(props: AppProps) {
  const [loading, setLoading] = useState(true);
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    const getAvatar = async () => {
      const avatarData = await UserService.getAvatar(props.author.userId!);
      setAvatar(avatarData
        ? URL.createObjectURL(avatarData)
        : null)
    }
    if (props.author) {
      setLoading(false);
      getAvatar();
    }
  }, [props.author]);


  if (loading) {
    return <><img src="SpinnerGif" /></>
  }

  return (
    <div className="flex items-center gap-2">
      <img src={avatar} alt="" width="40" />
      <div>
        <div className="font-bold">
          {props.author.name}
        </div>
        <div>
          {new Date(props.published).toLocaleString("de-DE", { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>
    </div>
  )

}

export default Author
