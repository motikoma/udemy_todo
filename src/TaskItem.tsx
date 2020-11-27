import React, { useState } from "react";
import * as firebase from "firebase/app";
import { ListItem, TextField, Grid, List } from "@material-ui/core";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/PermDeviceInformationOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import { db } from "./firebase";
import styles from "./TaskItem.module.css";

type Props = {
  id: string;
  title: string;
};

const TaskItem: React.FC<Props> = (props) => {
  const [title, setTitle] = useState(props.title);

  const editTask = () => {
    db.collection("tasks").doc(props.id).set({ title: title }, { merge: true });
  };

  const deleteTask = () => {
    db.collection("tasks").doc(props.id).delete();
  };

  return (
    <ListItem>
      <h2>{props.title}</h2>
      <Grid container justify="flex-end">
        <TextField
          label="Edit task"
          value={title}
          onChange={(
            e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
          ) => setTitle(e.target.value)}
        />
      </Grid>
      <button onClick={editTask} className={styles.taskitem__icon}>
        <EditOutlinedIcon />
      </button>
      <button onClick={deleteTask} className={styles.taskitem__icon}>
        <DeleteOutlineOutlinedIcon />
      </button>
    </ListItem>
  );
};

export default TaskItem;
