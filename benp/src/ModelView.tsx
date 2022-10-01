import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import React from "react";
import ModelViewForm from "./ModelViewForm";
import ModelViewResult from "./ModelViewResult";

const drawerWidth = 500;

export default function ModelView() {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
      >
        <Toolbar />
      </Box>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="right"
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
      </Drawer>
    </Box>
  );
}
