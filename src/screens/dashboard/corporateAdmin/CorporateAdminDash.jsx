import { View, Text, StyleSheet, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import FilterOptions from "./FilterOptions";
import CardData from "../../../components/CardData";
import RNPickerSelect from "react-native-picker-select";
import Search from "../../../components/Search";
import { authTokenState } from "../../../atoms/authTokenState";
import { useRecoilValue } from "recoil";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

const INPUT_ANDROID_STYLES = {
  width: 76,
  fontSize: 17,
  borderBottomWidth: 2,
  padding: 6,
};

const DROPDOWN_STYLES = {
  inputAndroid: INPUT_ANDROID_STYLES,
  inputIOS: {
    ...INPUT_ANDROID_STYLES,
  },
};

const CorporateAdminDash = () => {
  // FETCH BRANCHES FROM API AND DISPLAY IN A DROPDOWN FIRST
  // THEN FETCH DATA FROM API AND DISPLAY IN A CARD MANNER
  // http://10.4.15.12:8004/api/purchase-orders?page=1&per_page=10&branch=1
  const authToken = useRecoilValue(authTokenState);
  const [branch, setBranch] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState(1);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axios.get(
          `http://10.4.15.12:8004/api/branches`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setBranch(response.data.branches);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBranches();
  }, [authToken]);

  return (
    <View>
      <FilterOptions />
      <View style={styles.utilsContainer}>
        <Search />
        {branch?.length > 0 && (
          <RNPickerSelect
            value={selectedBranchId}
            items={branch?.map((branches) => ({
              label: branches?.abbreviation,
              value: branches?.id,
            }))}
            onValueChange={(value) => setSelectedBranchId(value)}
            onDonePress={() => console.log(selectedBranchId)} // FOR TESTING
            style={DROPDOWN_STYLES}
            Icon={() => {
              return <Ionicons name="chevron-down" size={18} color="gray" />;
            }}
          />
        )}
      </View>
      <CardData />
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
});

export default CorporateAdminDash;
