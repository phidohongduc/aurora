import { Container, Typography, Box } from '@mui/material'

export default function MainPage() {
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 120px)',
          textAlign: 'center',
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
          Welcome to Aurora
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Your intelligent job requisition management system
        </Typography>
      </Box>
    </Container>
  )
}
