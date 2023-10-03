import { View, Text } from "react-native";
import React, { useState, useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import { authTokenState } from "../../../atoms/authTokenState";
import { useRecoilValue } from "recoil";
import axios from "axios";

const apiKey = process.env.EXPO_PUBLIC_API_URL;

const SupplierList = () => {
  const route = useRoute();
  const authToken = useRecoilValue(authTokenState);
  const { item_id } = route.params;
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${apiKey}/canvas?details_id=${item_id}`,
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
  }, [item_id, authToken]);

  return (
    <View style={{ flex: 1 }}>
      {data.map((item) => (
        <View key={item.id}>
          <Text>{item.vendor?.vendor_Name}</Text>
          <Text>{item.canvas_item_amount}</Text>
          <Text>{item.canvas_Item_Qty}</Text>
          <Text>{item.unit?.name}</Text>
          <Text>{item.canvas_item_discount_percent}</Text>
          <Text>{item.canvas_item_vat_rate}</Text>
          <Text>{item.canvas_lead_time}</Text>
        </View>
      ))}
    </View>
  );
};

export default SupplierList;
