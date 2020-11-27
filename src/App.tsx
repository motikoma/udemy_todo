import {
  Container,
  FormControl,
  List,
  TextField,
  Grid,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import styles from "./App.module.css";
import { db } from "./firebase";
import AddToPhotosIcon from "@material-ui/icons/AddToPhotos";
import TaskItem from "./TaskItem";
import { makeStyles } from "@material-ui/styles";

import { auth } from "./firebase";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

const useStyles = makeStyles({
  field: {
    marginTop: 30,
    marginBottom: 20,
  },
  list: {
    width: "100%",
  },
});

const App: React.FC = (props: any) => {
  const [tasks, setTasks] = useState([{ id: "", title: "" }]);
  const [input, setInput] = useState("");
  const classes = useStyles();

  useEffect(() => {
    const unSub = auth.onAuthStateChanged((user) => {
      !user && props.history.push("login");
    });
    return () => unSub();
  });

  useEffect(() => {
    const unSub = db.collection("tasks").onSnapshot((snapshot) => {
      setTasks(
        snapshot.docs.map((doc) => ({ id: doc.id, title: doc.data().title }))
      );
    });
    return () => unSub();
  }, []);

  const newTask = () => {
    db.collection("tasks").add({ title: input });
    setInput("");
  };

  return (
    <Container maxWidth="sm">
      <Grid container alignItems="center" justify="center">
        <h1>Todo App by React/Firebase</h1>
        <button
          className={styles.app__logout}
          onClick={async () => {
            try {
              await auth.signOut();
              props.history.push("/login");
            } catch (error) {
              alert(error.message);
            }
          }}
        >
          {" "}
          <ExitToAppIcon />
        </button>
        <FormControl>
          <TextField
            className={classes.field}
            InputLabelProps={{ shrink: true }}
            label="New Task ?"
            value={input}
            onChange={(
              e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
            ) => setInput(e.target.value)}
          />
        </FormControl>
        <button
          disabled={!input}
          onClick={newTask}
          className={styles.app__icon}
        >
          <AddToPhotosIcon />
        </button>
      </Grid>
      <List className={classes.list}>
        {tasks.map((task) => (
          <TaskItem key={task.id} id={task.id} title={task.title} />
        ))}
      </List>
    </Container>
  );
};

export default App;
