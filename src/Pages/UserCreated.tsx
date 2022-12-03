import Snackbar from '@mui/material/Snackbar';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';

const UserCreated = ({ isOpen }) => {
  const navigate = useNavigate();
  const action = (
    <Button
      color='secondary'
      size='small'
      onClick={() => {
        navigate(`/`);
      }}
    >
      Go to Login Page
    </Button>
  );

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={isOpen}
      autoHideDuration={3000}
      message={`Account Created successfully. Please Sign in from login page`}
      action={action}
    />
  );
};

export default UserCreated;
