import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
const styles = theme => ({
  root: {
    margin: "16px 8px",
    backgroundColor: theme.palette.background.paper
  }
});

class InstallmentDetail extends React.Component {

  render() {
    const { installments } = this.props;
    console.log(installments, "Nero Here in comp")
    return installments && installments.map((item, index) => {
      return (
        <Grid
          container="true"
        >
          <Grid item sm={5} md={5}>{item.taxHeadCode}</Grid>:  <Grid style={{textAlign: "right"}} item sm={2} md={2}>Rs. {item.taxAmount}</Grid>
        </Grid>
      );
    })
    
  }
}

export default withStyles(styles)(InstallmentDetail);
