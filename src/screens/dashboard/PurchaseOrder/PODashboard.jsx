import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import FilterOptions from "./FilterOptions";
import POCard from "../../../components/Cards/POCard";
import RNPickerSelect from "react-native-picker-select";
import Search from "../../../components/Search";
import { authTokenState } from "../../../atoms/authTokenState";
import { useRecoilValue } from "recoil";
import { customStyles } from "../../../styles/customStyles";
import { Ionicons } from "@expo/vector-icons";
import POModal from "../../../components/Modals/POModal";
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

const PODashboard = () => {
  // Auth states
  const authToken = useRecoilValue(authTokenState);
  // Data states
  const [data, setData] = useState([]);
  const [branch, setBranch] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState(1);
  const [selectedID, setSelectedID] = useState();
  // Pagination states
  const [page, setPage] = useState(1);
  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  // Filter states
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedItemGroup, setSelectedItemGroup] = useState("");
  // Loading states
  const [isLoading, setIsLoading] = useState(false);

  // http://10.4.15.15:8006/api/purchase-order/1
  const handleCardPress = (id) => {
    setSelectedID(id);
    setModalVisible(true);
  };

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
        // tab=1 for approval data
        // tab=2 for approved by comproller
        // tab=3 for approved by administrator
        // tab=4 for approved by corporate_admin
        // tab=5 for approved by president
        `${apiKey}/purchase-orders?page=${page}&per_page=10&branch=${selectedBranchId}&department=${selectedDepartment}&item_group=${selectedItemGroup}&tab=1`,
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
  }, [
    authToken,
    page,
    selectedBranchId,
    selectedDepartment,
    selectedItemGroup,
  ]);

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => handleCardPress(item.id)}>
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

  const handleEndReached = () => {
    if (data.length >= 10) {
      setPage(page + 1);
    }
  };

  return (
    <View style={{ paddingBottom: 150, backgroundColor: "#f7f7f7" }}>
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
              return <Ionicons name="chevron-down" size={18} color="gray" />;
            }}
          />
        )}
      </View>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : data.length === 0 ? (
        <Text style={customStyles.emptyText}>No purchase request found</Text>
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
        />
      )}
      <POModal
        modalVisible={modalVisible}
        selectedID={selectedID}
        closeModal={() => setModalVisible(false)}
      />
    </View>
  );
};

export default PODashboard;
