import { View, Text, TouchableOpacity } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { authTokenState } from "../../atoms/authTokenState";
import axios from "axios";
import SearchFilter from "../../components/SearchFilter";
import CardData from "../../components/CardData";
import { useNavigation } from "@react-navigation/native";

const apiKey = process.env.EXPO_PUBLIC_API_URL;

const AdminHistory = () => {
  const navigation = useNavigation();
  const authToken = useRecoilValue(authTokenState);
  const [data, setData] = useState([]);

  const handlePress = (id) => {
    navigation.navigate("AdminLogs", { id });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${apiKey}/purchase-request?page=1&per_page=10&tab=4`,
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

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => handlePress(data[item].id)}>
        <CardData
          prId={data[item]?.pr_Document_Number}
          transactionDate={data[item]?.pr_Transaction_Date}
          requestingName={data[item]?.pr_RequestedBy}
          warehouse={data[item]?.warehouse?.warehouse_description}
          itemGroup={data[item]?.item_group?.name}
          category={data[item]?.category?.name}
          pr_status={data[item]?.status.Status_description}
          dateApproved={data[item]?.pr_Branch_Level1_ApprovedDate}
          justification={data[item]?.pr_Justication}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ paddingBottom: 110 }}>
      <SearchFilter />
      <FlatList
        data={Object.keys(data)}
        keyExtractor={(key) => key}
        renderItem={renderItem}
      />
    </View>
  );
};

export default AdminHistory;
