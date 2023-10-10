import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { authTokenState } from "../../../atoms/authTokenState";
import CardData from "../../../components/CardData";
import Search from "../../../components/Search";
import Modal from "react-native-modal";
import ModalFilter from "../../../components/ModalFilter";
import { customStyles } from "../../../styles/customStyles";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const apiKey = process.env.EXPO_PUBLIC_API_URL;

const ComptrollerDashboard = () => {
  const navigation = useNavigation();
  // Auth states
  const authToken = useRecoilValue(authTokenState);
  // Data states
  const [data, setData] = useState([]);
  // Pagination states
  const [page, setPage] = useState(1);
  // Modal states
  const [filterModal, setFilterModal] = useState(false);
  // Filter states
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedItemGroup, setSelectedItemGroup] = useState("");

  const handleCardPress = (pr_id) => {
    navigation.navigate("ComptrollerApproveItems", { pr_id, isStatus: true });
  };

  // FILTER MODAL
  const toggleFilter = () => {
    setFilterModal(true);
  };

  // FILTER DATA
  const handleFilterApply = ({ branch, department, category, item_group }) => {
    setSelectedBranch(branch);
    setSelectedDepartment(department);
    setSelectedCategory(category);
    setSelectedItemGroup(item_group);
    setFilterModal(false);
  };

  const fetchData = async () => {
    // For now change back to static url instead of using .env file
    try {
      const response = await axios.get(
        `http://10.4.15.12:8004/api/purchase-request?page=${page}&per_page=10&tab=6&branch=${selectedBranch}&department=${selectedDepartment}&category=${selectedCategory}&item_group=${selectedItemGroup}`,
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
    fetchData();
  }, [
    authToken,
    page,
    selectedBranch,
    selectedDepartment,
    selectedCategory,
    selectedItemGroup,
  ]);

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => handleCardPress(item.id)}>
        <CardData
          prId={item?.pr_Document_Number}
          transactionDate={item?.pr_Transaction_Date}
          requestingName={item?.user?.name}
          warehouse={item?.warehouse?.warehouse_description}
          itemGroup={item?.item_group?.name}
          category={item?.category?.name}
          pr_status={item?.status?.Status_description}
          dateApproved={item?.pr_Branch_Level1_ApprovedDate}
          justification={item?.pr_Justication}
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
      <View style={customStyles.utilsContainer}>
        <Search />
        <TouchableOpacity
          style={customStyles.filterButton}
          onPress={toggleFilter}
        >
          <Ionicons name="md-filter" size={16} color="#000" />
          <Text style={customStyles.filterText}>&nbsp;Filter</Text>
        </TouchableOpacity>
      </View>
      {/* FILTER MODAL */}
      <Modal isVisible={filterModal} style={customStyles.filterModalContainer}>
        <ModalFilter
          onSubmit={handleFilterApply}
          handleClose={() => setFilterModal(false)}
        />
      </Modal>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};

export default ComptrollerDashboard;
