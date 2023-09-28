import { View, Text } from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRoute } from "@react-navigation/native";
import { useRecoilValue } from "recoil";
import { authTokenState } from "../../../atoms/authTokenState";
import { userPassword } from "../../../atoms/userPassword";
import { Card, Button, CheckBox } from "react-native-elements";

// http://10.4.15.12:8004/api/purchase-request/{id}?tab=6 (pr id)

// Display data
// Approve data

const ApproveItems = () => {
  const route = useRoute();
  const { id } = route.params;
  const { isStatus } = route.params;
  const authToken = useRecoilValue(authTokenState);
  const userPasscode = useRecoilValue(userPassword);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://10.4.15.12:8004/api/purchase-request/${id}?tab=6`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        const newData = { ...response.data, isStatus };
        console.log(newData);
        setData(newData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [id, authToken]);

  return (
    <View>
      <Text>{id}</Text>
      <Text>{isStatus ? "True" : "False"}</Text>
    </View>
  );
};

export default ApproveItems;
