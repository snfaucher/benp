import {
  Box,
  CssBaseline,
  Divider,
  Drawer,
  Grid,
  Toolbar,
  Typography,
} from "@mui/material";
import ModelViewForm from "./ModelViewForm";
import ModelViewResult from "./ModelViewResult";
import Viewer from "./Viewer";

const drawerWidth = 500;

export default function ModelView() {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Divider />
      <Grid container>
        <Grid item sm={8}>
          <Viewer />
        </Grid>
        <Grid item sm={4}>
          <Box
            sx={{
              width: "100%",
              height: "100%",
              // flexShrink: 0,
              // "& .MuiBox-paper": {
              //   width: drawerWidth,
              //   boxSizing: "border-box",
              // },
            }}
            // variant="permanent"
            // anchor="right"
          >
            <Toolbar>
              <Typography variant="body1">Paramètres du fût</Typography>
            </Toolbar>
            <Divider />
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <ModelViewForm />
              </Grid>
              <Grid item xs={6}>
                <ModelViewResult />
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
