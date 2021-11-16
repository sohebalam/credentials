import SyncIcon from "@mui/icons-material/Sync"
import UserRoute from "../../components/routes/UserRoute"
import { Grid, Typography } from "@material-ui/core"

const StripeCancel = () => {
  // const classes = useStyles()
  return (
    <UserRoute>
      <Grid container>
        <Grid item xs={9} style={{ padding: "2rem" }}>
          <SyncIcon style={{ fontSize: 50 }} />
          <Typography variant="body1">Payment failed. Try again.</Typography>
        </Grid>
        <Grid item xs={3}></Grid>
      </Grid>
    </UserRoute>
  )
}

export default StripeCancel
