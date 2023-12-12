import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { green, red, blue ,grey} from "@material-ui/core/colors";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";

const useStyles = makeStyles({
    dot: {
        fontSize: 13,
        background: 'none',
        border: '2px solid', 
        borderRadius: '50%', 
        padding: '2px', 
        marginRight:'5px'
      },
});

const StatusDot = ({ status }) => {

  const classes = useStyles();
  let color;
  if (status === "Approved") {
    color = green[500];
  } else if (status === "Declined") {
    color = red[500];
  }else if (status === "New") {
    color = blue[500];
  } else {
    color = grey[500];
  }
  return <FiberManualRecordIcon className={classes.dot} style={{ color }} />;
};

export default StatusDot;
