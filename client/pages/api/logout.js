import { useRouter } from "next/router";
import { account } from "../../appwriteConfig";
import Cookies from "js-cookie";

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const authToken = Cookies.get("authToken");
      console.log(authToken);
      if (authToken) {
        await account.deleteSession(authToken);
      }
      Cookies.remove("authToken");
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <button className='logout-button' onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;
