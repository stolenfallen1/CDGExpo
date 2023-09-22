import { View, Text, TouchableOpacity } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { authTokenState } from "../../atoms/authTokenState";
import axios from "axios";
import SearchFilter from "../../components/SearchFilter";
import { StyleSheet } from "react-native";
import CardData from "../../components/CardData";

const DepartmentHeadHistory = () => {
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
    <View>
      <SearchFilter />
      <FlatList
        data={Object.keys(data)}
        keyExtractor={(key) => key}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity>
              <CardData
                prId={data[item].pr_Document_Number}
                transactionDate={data[item].pr_Transaction_Date}
                requestingName={data[item].pr_RequestedBy}
                warehouse={data[item].warehouse.warehouse_description}
                itemGroup={data[item].item_group.name}
                category={data[item].category.name}
                quantity={data[item].purchase_request_details.item_Request_Qty}
                pr_status={data[item].status.Status_description}
                dateApproved={data[item].pr_DepartmentHead_ApprovedDate}
                justification={data[item].pr_Justication}
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
});

export default DepartmentHeadHistory;
