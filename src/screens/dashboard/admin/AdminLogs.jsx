import { View, Text, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import { authTokenState } from "../../../atoms/authTokenState";
import { useRecoilValue } from "recoil";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import { Card } from "react-native-elements";

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
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <Card>
          <Text>TEST</Text>
        </Card>
      </ScrollView>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <Card>
          <Text>TEST</Text>
        </Card>
      </ScrollView>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <Card>
          <Text>TEST</Text>
        </Card>
      </ScrollView>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <Card>
          <Text>TEST</Text>
          {/* {data.purchase_request_details?.map((detail) => (
            <View key={detail.id}>
              <Text>Item ID: {detail.item_Id}</Text>
              <Text>Item Description: {detail.item_Description}</Text>
              <Text>Quantity: {detail.quantity}</Text>
            </View>
          ))} */}
        </Card>
      </ScrollView>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <Card>
          <Text>TEST</Text>
        </Card>
      </ScrollView>
    </View>
  );
};

export default AdminLogs;
