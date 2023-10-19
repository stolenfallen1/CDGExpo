import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { authTokenState } from "../../atoms/authTokenState";
import RNPickerSelect from "react-native-picker-select";
import Search from "../../components/Search";
import POCard from "../../components/Cards/POCard";
import { customStyles } from "../../styles/customStyles";
import { Ionicons } from "@expo/vector-icons";
import FilterOptions from "../../screens/dashboard/PurchaseOrder/FilterOptions";
import axios from "axios";

const apiKey = process.env.EXPO_PUBLIC_API_URL;

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

const CorporateAdmin = () => {
  // Auth states
  const authToken = useRecoilValue(authTokenState);
  // Data states
  const [data, setData] = useState([]);
  const [branch, setBranch] = useState([]);
  // Filter states
  const [selectedBranchId, setSelectedBranchId] = useState(1);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedItemGroup, setSelectedItemGroup] = useState("");
  // Loading states
  const [isLoading, setIsLoading] = useState(false);

  const fetchBranches = async () => {
    try {
      const response = await axios.get(`${apiKey}/branches`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setBranch(response.data.branches);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFilterApply = ({ department, item_group }) => {
    setSelectedDepartment(department);
    setSelectedItemGroup(item_group);
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${apiKey}/purchase-orders?page=1&per_page=10&branch=${selectedBranchId}&department=${selectedDepartment}&item_group=${selectedItemGroup}&tab=4`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setData(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchBranches();
    fetchData();
  }, [authToken, selectedBranchId, selectedDepartment, selectedItemGroup]);

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity>
        <POCard
          poId={item?.po_Document_number}
          prId={item?.pr_Request_id}
          supplier={item?.vendor?.vendor_Name}
          warehouse={item?.warehouse?.warehouse_description}
          transactionDate={item?.po_Document_transaction_date}
          requestingName={item?.user?.name}
          justification={item?.purchase_request?.pr_Justication}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <FilterOptions
        selectedBranchID={selectedBranchId}
        onClose={handleFilterApply}
      />
      <View style={customStyles.utilsContainer}>
        <Search />
        {branch?.length > 0 && (
          <RNPickerSelect
            value={selectedBranchId}
            items={branch?.map((branches) => ({
              label: branches?.abbreviation,
              value: branches?.id,
            }))}
            onValueChange={(value) => setSelectedBranchId(value)}
            style={DROPDOWN_STYLES}
            Icon={() => {
              return <Ionicons name="chevron-down" size={18} color="black" />;
            }}
          />
        )}
      </View>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : data.length === 0 ? (
        <Text style={customStyles.emptyText}>No results found</Text>
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};

export default CorporateAdmin;
