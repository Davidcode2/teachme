import userIcon from "../../../assets/icons/icons8-user-48.png";
import { useEffect, useState } from "react";
import { UserService } from "../../../services/userService";
import CardService from "../../../services/cardService";

type AppProps = {
  authorId: string;
  published: Date;
};

function Author(props: AppProps) {
  const [loading, setLoading] = useState(true);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [author, setAuthor] = useState<string | null>(null);
  const cardService = new CardService();

  const getAvatar = async (userId: string) => {
    const avatarData = await UserService.getAvatar(userId!);
    setAvatar(avatarData ? URL.createObjectURL(avatarData) : null);
  };

  useEffect(() => {
    const getAuthor = async () => {
      const authorIn = await cardService.getAuthor(props.authorId);
      await getAvatar(authorIn.id);
      setAuthor(authorIn.displayName);
      setLoading(false);
    };
    if (!author) {
      getAuthor();
    }
    if (author) {
      setLoading(false);
    }
  }, [author]);

  if (loading) {
    return <></>;
  }

  return (
    <div className="flex items-center gap-2">
      <img className="w-7 sm:w-9" src={avatar ? avatar : userIcon} alt="" />
      <div>
        <div className="font-bold">{author}</div>
        <div className="text-xs sm:text-sm">
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
