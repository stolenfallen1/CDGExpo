import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { authTokenState } from "../../atoms/authTokenState";
import axios from "axios";
import Search from "../../components/Search";
import PRCard from "../../components/Cards/PRCard";
import Modal from "react-native-modal";
import { customStyles } from "../../styles/customStyles";
import { Ionicons } from "@expo/vector-icons";
import ModalFilter from "../../components/ModalFilter";
import { useNavigation } from "@react-navigation/native";

const apiKey = process.env.EXPO_PUBLIC_API_URL;

const CanvasHitory = () => {
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
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");
  // Loading states
  const [isLoading, setIsLoading] = useState(false);

  const handleCardPress = (pr_id) => {
    navigation.navigate("CanvasHistoryDetails", { pr_id });
  };

  const toggleFilter = () => {
    setFilterModal(true);
  };

  const handleFilterApply = ({
    branch,
    department,
    category,
    item_group,
    start_date,
    end_date,
  }) => {
    setSelectedBranch(branch);
    setSelectedDepartment(department);
    setSelectedCategory(category);
    setSelectedItemGroup(item_group);
    setSelectedStartDate(start_date);
    setSelectedEndDate(end_date);
    setFilterModal(false);
  };

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${apiKey}/purchase-request?page=${page}&per_page=15&tab=7&branch=${selectedBranch}&department=${selectedDepartment}&category=${selectedCategory}&item_group=${selectedItemGroup}&requested_date=${selectedStartDate}&required_date=${selectedEndDate}`,
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
    page,
    selectedBranch,
    selectedDepartment,
    selectedCategory,
    selectedItemGroup,
    selectedStartDate,
    selectedEndDate,
  ]);

  const handleLoadMore = () => {
    setPage(page + 1);
  };

  const renderItem = ({ item, index }) => {
    return (
      // To Continue since no data to test to
      <TouchableOpacity onPress={() => handleCardPress(item.id)}>
        <PRCard
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
        {index === data.length - 1 && data.length >= 15 && (
          <TouchableOpacity
            onPress={handleLoadMore}
            style={customStyles.loadMoreButton}
          >
            <Text style={customStyles.loadMoreText}>Load More...</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      )}
    </SafeAreaView>
  );
};

export default CanvasHitory;
