import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Grid } from "@mui/material";
import ModelView from "./ModelView";

function App() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <ModelView />
      </Grid>
    </Grid>
  );
}

export default App;
