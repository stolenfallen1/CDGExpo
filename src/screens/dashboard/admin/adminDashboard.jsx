import { ScrollView, TouchableOpacity } from "react-native";
import React, { useState, useEffect, useRef } from "react";
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

  const bottomSheetRef = useRef(null);
  const openBottomSheet = () => {
    bottomSheetRef.current?.present();
  };

  return (
    <ScrollView>
      <SearchFilter />
      {Object.keys(data).map((key) => (
        <TouchableOpacity key={key} onPress={openBottomSheet}>
          <CardData
            prId={data[key].code}
            transactionDate={data[key].pr_Transaction_Date}
            requestingName={data[key].user.name}
            itemGroup={data[key].item_group.name}
            category={data[key].category.name}
            justification={data[key].pr_Justication}
            ref={bottomSheetRef}
          />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default AdminDashboard;
