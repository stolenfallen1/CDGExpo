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

    axios.get("http://10.4.15.206:8004/api/purchase-request?page=1&per_page=1&tab=1",config)
      .then((response) => {
        setPurchaseRequests(response.data.data);
        console.log(purchaseRequests, "test")
      })
      .catch((error) => {
        console.error(error);
      });
  }, [authToken]);

  return (
    <View>
      <SearchFilter />
      {purchaseRequests.map((purchaseRequest)=>{
        <CardData
          key={purchaseRequest.id}
          prNo={'7467346746'}
        />
      })}
      <CardData
        key={'1'}
        prNo={'7467346746'}
      />
    </View>
  );
};

export default AdminDashboard;
