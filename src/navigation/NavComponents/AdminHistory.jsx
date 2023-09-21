import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { authTokenState } from "../../atoms/authTokenState";
import axios from "axios";

const AdminHistory = () => {
  const authToken = useRecoilValue(authTokenState);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://10.4.15.206:8004/api/purchase-request?page=1&per_page=10&tab=2",
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
    <ScrollView>
      {Object.keys(data).map((key) => (
        <View key={key}>
          <Text>{data[key].code}</Text>
          <Text>{data[key].pr_Transaction_Date}</Text>
          <Text>{data[key].user.name}</Text>
          <Text>{data[key].item_group.name}</Text>
          <Text>{data[key].category.name}</Text>
          <Text>{data[key].code}</Text>
          {/* <Text>
            {data[key].purchase_request_details[key].item_Request_Qty}
          </Text> */}
          <Text>{data[key].pr_Justication}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default AdminHistory;
