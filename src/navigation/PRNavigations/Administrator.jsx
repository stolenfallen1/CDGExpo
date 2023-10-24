import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { authTokenState } from "../../atoms/authTokenState";
import axios from "axios";
import Search from "../../components/Search";
import PRCard from "../../components/Cards/PRCard";
import { customStyles } from "../../styles/customStyles";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Modal from "react-native-modal";
import ModalFilter from "../../components/ModalFilter";

const apiKey = process.env.EXPO_PUBLIC_API_URL;

const AdminHistory = () => {
  const navigation = useNavigation();
  // Auth states
  const authToken = useRecoilValue(authTokenState);
  // Data states
  const [data, setData] = useState([]);
  // Modal states
  const [filterModal, setFilterModal] = useState(false);
  // Filter states
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedItemGroup, setSelectedItemGroup] = useState("");
  // Loading states
  const [isLoading, setIsLoading] = useState(false);

  const handlePress = (id) => {
    navigation.navigate("AdminLogs", { id });
  };

  const toggleFilter = () => {
    setFilterModal(true);
  };

  const handleFilterApply = ({ branch, department, category, item_group }) => {
    setSelectedBranch(branch);
    setSelectedDepartment(department);
    setSelectedCategory(category);
    setSelectedItemGroup(item_group);
    setFilterModal(false);
  };

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${apiKey}/purchase-request?page=1&per_page=10&tab=4&branch=${selectedBranch}&department=${selectedDepartment}&category=${selectedCategory}&item_group=${selectedItemGroup}`,
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

    fetchData();
  }, [
    authToken,
    selectedBranch,
    selectedDepartment,
    selectedCategory,
    selectedItemGroup,
  ]);

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => handlePress(data[item].id)}>
        <PRCard
          prId={data[item]?.pr_Document_Number}
          transactionDate={data[item]?.pr_Transaction_Date}
          requestingName={data[item]?.pr_RequestedBy}
          warehouse={data[item]?.warehouse?.warehouse_description}
          itemGroup={data[item]?.item_group?.name}
          category={data[item]?.category?.name}
          pr_status={data[item]?.status?.Status_description}
          dateApproved={data[item]?.pr_Branch_Level1_ApprovedDate}
          justification={data[item]?.pr_Justication}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ paddingBottom: 110 }}>
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
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : data.length === 0 ? (
        <Text style={customStyles.emptyText}>No results found</Text>
      ) : (
        <FlatList
          data={Object.keys(data)}
          keyExtractor={(key) => key}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

export default AdminHistory;
