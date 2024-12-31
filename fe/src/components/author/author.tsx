import userIcon from "../../assets/icons/icons8-user-48.png";
import { useEffect, useState } from "react";
import { UserService } from "../../services/userService";
import CardService from "../../services/cardService";

type AppProps = {
  authorId: string;
  published: Date;
};

function Author(props: AppProps) {
  const [loading, setLoading] = useState(true);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [author, setAuthor] = useState<string | null>(null);
  const cardService = new CardService();

  useEffect(() => {
    const getAuthor = async () => {
      const authorIn = await cardService.getAuthor(props.authorId);
      await getAvatar(authorIn.id);
      setAuthor(authorIn.email);
    };
    if (!author) {
      getAuthor();
    }
    const getAvatar = async (userId: string) => {
      const avatarData = await UserService.getAvatar(userId!);
      setAvatar(avatarData ? URL.createObjectURL(avatarData) : null);
    };
    if (author) {
      setLoading(false);
    }
  }, [author]);

  if (loading) {
    return <></>;
  }

  return (
    <div className="flex items-center gap-2">
      <img src={avatar ? avatar : userIcon} alt="" width="40" />
      <div>
        <div className="font-bold">{author}</div>
        <div>
          {new Date(props.published).toLocaleString("de-DE", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>
    </div>
  );
}

export default Author;
