import { View, Text, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { authTokenState } from "../../../atoms/authTokenState";
import CardData from "../../../components/CardData";
import SearchFilter from "../../../components/SearchFilter";

const AdminDashboard = () => {
  const authToken = useRecoilValue(authTokenState);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://10.4.15.206:8004/api/purchase-request?page=1&per_page=10&tab=1",
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
    <ScrollView style={{ marginBottom: 20 }}>
      <SearchFilter />
      {Object.keys(data).map((key) => (
        <View key={key}>
          <CardData
            prId={data[key].id}
            transactionDate={data[key].pr_Transaction_Date}
            requestingName={data[key].user.name}
            itemGroup={data[key].item_group.name}
            category={data[key].category.name}
            justification={data[key].pr_Justication}
          />
        </View>
      ))}
    </ScrollView>
  );
};

export default AdminDashboard;
