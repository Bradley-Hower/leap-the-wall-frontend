import { useAuth0 } from "@auth0/auth0-react";

const Username = () => {
  const { user, isAuthenticated } = useAuth0();

  return (
    isAuthenticated && (
      <div>
        {user.name}
      </div>
    )
  );
};

export default Username;
