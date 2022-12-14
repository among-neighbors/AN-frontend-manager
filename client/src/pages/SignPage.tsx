import { Box } from '@mui/system';
import SignIn from '~/components/organisms/SignIn';

const SignPage: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', height: 'calc(100vh - 70px)' }}>
      <SignIn />
    </Box>
  );
};

export default SignPage;
