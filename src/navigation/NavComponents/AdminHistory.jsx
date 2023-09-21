import { View, Text, TouchableOpacity } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { authTokenState } from "../../atoms/authTokenState";
import axios from "axios";
import SearchFilter from "../../components/SearchFilter";
import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const AdminHistory = () => {
  const authToken = useRecoilValue(authTokenState);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://10.4.15.206:8004/api/purchase-request?page=1&per_page=10&tab=4",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setData(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [authToken]);

  return (
    <View>
      <SearchFilter />
      <FlatList
        data={Object.keys(data)}
        keyExtractor={(key) => key}
        renderItem={({ item }) => {
          return (
            <>
              <View style={styles.container}>
                <Text>{data[item].code}</Text>
                <Text>
                  {data[item].warehouse?.warehouse_description.length > 20
                    ? `${data[item].warehouse?.warehouse_description.substring(
                        0,
                        20
                      )}...`
                    : data[item].warehouse?.warehouse_description}
                </Text>
                <TouchableOpacity>
                  <Ionicons name="eye" size={16} color="black" />
                </TouchableOpacity>
              </View>
            </>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    borderWidth: 0.5,
    borderColor: "#66B5D1",
    borderRadius: 5,
    paddingVertical: 15,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
    marginHorizontal: 15,
  },
});

export default AdminHistory;
