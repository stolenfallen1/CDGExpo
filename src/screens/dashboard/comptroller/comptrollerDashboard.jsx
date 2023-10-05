import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { authTokenState } from "../../../atoms/authTokenState";
import CardData from "../../../components/CardData";
import Search from "../../../components/Search";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const apiKey = process.env.EXPO_PUBLIC_API_URL;

const ComptrollerDashboard = () => {
  const navigation = useNavigation();
  const authToken = useRecoilValue(authTokenState);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);

  const handleCardPress = (pr_id) => {
    navigation.navigate("ComptrollerApproveItems", { pr_id, isStatus: true });
  };

  const handlePress = () => {
    navigation.navigate("FilterModal");
  };

  const fetchData = async () => {
    // For now change back to static url instead of using .env file
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
          prId={item?.pr_Document_Number}
          transactionDate={item?.pr_Transaction_Date}
          requestingName={item?.user?.name}
          warehouse={item?.warehouse?.warehouse_description}
          itemGroup={item?.item_group?.name}
          category={item?.category?.name}
          pr_status={item?.status?.Status_description}
          dateApproved={item?.pr_Branch_Level1_ApprovedDate}
          justification={item?.pr_Justication}
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
    <View style={{ paddingBottom: 185 }}>
      <View style={styles.utilsContainer}>
        <Search />
        <TouchableOpacity style={styles.filterButton} onPress={handlePress}>
          <Ionicons name="md-filter" size={16} color="#000" />
          <Text style={styles.filterText}>&nbsp;Filter</Text>
        </TouchableOpacity>
      </View>
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

const styles = StyleSheet.create({
  utilsContainer: {
    flexDirection: "row",
    marginTop: 30,
    marginBottom: 13,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  filterButton: {
    width: "20%",
    flexDirection: "row",
    backgroundColor: "#50C878",
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  filterText: {
    fontSize: 17,
  },
});

export default ComptrollerDashboard;
