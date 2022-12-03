import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';

export default function ShipmentInfo({ title, message }) {
  return (
    <>
      {title && message ? (
        <Stack sx={{ width: '100%' }} spacing={2}>
          <Alert severity='info'>
            <AlertTitle>
              <strong>{title}</strong>
            </AlertTitle>
            {message}
          </Alert>
        </Stack>
      ) : null}
    </>
  );
}
