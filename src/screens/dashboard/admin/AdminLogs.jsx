import { View, Text } from "react-native";
import React, { useState, useEffect } from "react";
import { authTokenState } from "../../../atoms/authTokenState";
import { useRecoilValue } from "recoil";
import { useRoute } from "@react-navigation/native";
import axios from "axios";

const AdminLogs = () => {
  const authToken = useRecoilValue(authTokenState);
  const [data, setData] = useState([]);
  const route = useRoute();
  const { id } = route.params;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://10.4.15.12:8004/api/purchase-request/${id}/?tab=10`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [id, authToken]);

  return (
    <View>
      <Text>{data.pr_Document_Number}</Text>
    </View>
  );
};

export default AdminLogs;
