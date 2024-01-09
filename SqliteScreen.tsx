import { addDatabaseChangeListener, useSQLiteContext } from "expo-sqlite/next";
import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  FlatList,
  Pressable,
} from "react-native";
import { generateRandomTodo, nanoid } from "./utils";

type Todo = {
  id: string;
  text: string;
  completed: number;
};

export function SqliteScreen() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const db = useSQLiteContext();

  useEffect(() => {
    (async () => {
      const res: Todo[] = await db.getAllAsync(`SELECT * FROM todo`);
      setTodos(res);
    })();

    const sub = addDatabaseChangeListener(async () => {
      const res: Todo[] = await db.getAllAsync(`SELECT * FROM todo`);
      setTodos(res);
    });

    return () => sub.remove();
  }, []);

  const add = useCallback(async () => {
    await db.getAllAsync(
      `INSERT INTO todo (id, text, completed) VALUES (?, ?, ?)`,
      [nanoid(10), generateRandomTodo(), false]
    );
  }, []);

  const remove = useCallback(async (id: string) => {
    await db.getAllAsync(`DELETE FROM todo WHERE id = ?`, id);
  }, []);

  const toggle = useCallback(async (id: string, completed: boolean) => {
    await db.getAllAsync(
      `UPDATE todo SET completed = ${completed ? 0 : 1} WHERE id = ?`,
      id
    );
  }, []);

  const clear = useCallback(async () => {
    await db.runAsync("DELETE FROM todo");
  }, []);

  return (
    <View style={[styles.screen, { paddingVertical: 50 }]}>
      <FlatList
        data={todos}
        style={{ flex: 1, width: "100%" }}
        contentContainerStyle={{ padding: 10 }}
        renderItem={({ item }) => {
          return (
            <Pressable
              style={({ pressed }) => [
                styles.row,
                {
                  backgroundColor: pressed ? "lightgray" : "gainsboro",
                  borderColor: item.completed ? "lime" : "black",
                },
              ]}
              onPress={() => toggle(item.id, Boolean(item.completed))}
            >
              <Text
                style={{
                  flex: 1,
                }}
              >
                {item.text}
              </Text>
              <Button title="Remove" onPress={() => remove(item.id)} />
            </Pressable>
          );
        }}
      />
      <Button title="Add" onPress={add} />
      <Button title="Clear" onPress={clear} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "off-white",
  },
  row: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "gainsboro",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    borderWidth: 1,
  },
});
