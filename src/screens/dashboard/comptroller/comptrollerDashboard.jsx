import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { authTokenState } from "../../../atoms/authTokenState";
import { userPassword } from "../../../atoms/userPassword";
import CardData from "../../../components/CardData";
import SearchFilter from "../../../components/SearchFilter";
import { useNavigation } from "@react-navigation/native";

const ComptrollerDashboard = () => {
  const navigation = useNavigation();
  const authToken = useRecoilValue(authTokenState);
  const userPasscode = useRecoilValue(userPassword);
  const [data, setData] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [units, setUnits] = useState([]);
  const [selectedCardData, setSelectedCardData] = useState({});

  const handleCardPress = () => {
    navigation.navigate("ComptrollerApproveItems");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://10.4.15.12:8004/api/purchase-request?page=1&per_page=10&tab=6",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setData(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [authToken]);

  return (
    <View>
      <SearchFilter />
      <ScrollView>
        <TouchableOpacity onPress={handleCardPress}>
          <Text>TEST</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default ComptrollerDashboard;
