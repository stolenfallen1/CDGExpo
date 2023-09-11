import { View, Text } from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { authTokenState } from "../../../atoms/authTokenState";
import CardData from "../../../components/CardData";
import SearchFilter from "../../../components/SearchFilter";

const AdminDashboard = () => {
  const [purchaseRequests, setPurchaseRequests] = useState([]);
  const authToken = useRecoilValue(authTokenState);

  useEffect(() => {
    const config = {
      headers: { Authorization: `Bearer ${authToken}` },
    };

    axios
      .get(
        "http://10.4.15.206:8004/api/purchase-request?page=1&per_page=1&tab=1",
        config
      )
      .then((response) => {
        setPurchaseRequests(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [authToken]);

  return (
    <View>
      <SearchFilter />
      {purchaseRequests}
      {/* {purchaseRequests &&
        purchaseRequests(item) => ({

          item
        })
        // <CardData
        //   key={item.id}
        //   prNo={item.prNo}
        //   dateRequest={item.dateRequest}
        //   requesting={item.requesting}
        //   itemGroup={item.itemGroup}
        //   category={item.category}
        //   prStatus={item.prStatus}
        //   dateApproved={item.dateApproved}
        //   remarks={item.remarks}
        // />
      } */}
    </View>
  );
};

export default AdminDashboard;
