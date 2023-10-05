import { View, Text, TouchableOpacity } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { authTokenState } from "../../atoms/authTokenState";
import axios from "axios";
import Search from "../../components/Search";
import { StyleSheet } from "react-native";
import CardData from "../../components/CardData";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const apiKey = process.env.EXPO_PUBLIC_API_URL;

const DepartmentHeadHistory = () => {
  const navigation = useNavigation();
  const authToken = useRecoilValue(authTokenState);
  const [data, setData] = useState([]);

  const handleFitlerPress = () => {
    navigation.navigate("FilterModal");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${apiKey}/purchase-request?page=1&per_page=10&tab=2`,
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
    <View style={{ paddingBottom: 110 }}>
      <View style={styles.utilsContainer}>
        <Search />
        <TouchableOpacity
          style={styles.filterButton}
          onPress={handleFitlerPress}
        >
          <Ionicons name="md-filter" size={16} color="#000" />
          <Text style={styles.filterText}>&nbsp;Filter</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={Object.keys(data)}
        keyExtractor={(key) => key}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity>
              <CardData
                prId={data[item]?.pr_Document_Number}
                transactionDate={data[item]?.pr_Transaction_Date}
                requestingName={data[item]?.pr_RequestedBy}
                warehouse={data[item]?.warehouse?.warehouse_description}
                itemGroup={data[item]?.item_group?.name}
                category={data[item]?.category?.name}
                quantity={
                  data[item]?.purchase_request_details?.item_Request_Qty
                }
                pr_status={data[item]?.status?.Status_description}
                dateApproved={data[item]?.pr_DepartmentHead_ApprovedDate}
                justification={data[item]?.pr_Justication}
              />
            </TouchableOpacity>
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

export default DepartmentHeadHistory;
