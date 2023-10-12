import { View, FlatList, TouchableOpacity, Text } from "react-native";
import React, { useState, useEffect } from "react";
import FilterOptions from "./FilterOptions";
import CardData from "../../../components/CardData";
import RNPickerSelect from "react-native-picker-select";
import Search from "../../../components/Search";
import { authTokenState } from "../../../atoms/authTokenState";
import { useRecoilValue } from "recoil";
import { customStyles } from "../../../styles/customStyles";
import { Ionicons } from "@expo/vector-icons";
import CorporateAdminModal from "../../../components/Modals/CorporateAdminModal";
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

const CorporateAdminDash = () => {
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
    try {
      const response = await axios.get(
        `${apiKey}/purchase-orders?page=${page}&per_page=10&branch=${selectedBranchId}&department=${selectedDepartment}&item_group=${selectedItemGroup}`,
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
        <CardData
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
    <View style={{ paddingBottom: 185 }}>
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
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
      />
      <CorporateAdminModal
        modalVisible={modalVisible}
        selectedID={selectedID}
        closeModal={() => setModalVisible(false)}
      />
    </View>
  );
};

export default CorporateAdminDash;
