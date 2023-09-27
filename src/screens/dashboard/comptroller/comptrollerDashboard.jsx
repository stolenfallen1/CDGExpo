import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { authTokenState } from "../../../atoms/authTokenState";
import CardData from "../../../components/CardData";
import SearchFilter from "../../../components/SearchFilter";
import { useNavigation } from "@react-navigation/native";

const ComptrollerDashboard = () => {
  const navigation = useNavigation();
  const authToken = useRecoilValue(authTokenState);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);

  const handleCardPress = (id) => {
    navigation.navigate("ComptrollerApproveItems", { id });
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://10.4.15.12:8004/api/purchase-request?page=${page}&per_page=10&tab=6`,
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

  useEffect(() => {
    fetchData();
  }, [authToken, page]);

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => handleCardPress(item.id)}>
        <CardData
          prId={item.pr_Document_Number}
          transactionDate={item.pr_Transaction_Date}
          requestingName={item.user.name}
          warehouse={item.warehouse.warehouse_description}
          itemGroup={item.item_group.name}
          category={item.category.name}
          pr_status={item.status.Status_description}
          dateApproved={item.pr_Branch_Level1_ApprovedDate}
          justification={item.pr_Justication}
        />
      </TouchableOpacity>
    );
  };

  const handleEndReached = () => {
    if (data.length >= 10) {
      setPage(page + 1);
    }
  };

  return (
    <View>
      <SearchFilter />
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};

export default ComptrollerDashboard;
