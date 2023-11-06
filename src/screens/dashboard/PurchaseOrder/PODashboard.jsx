import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import FilterOptions from "./FilterOptions";
import POCard from "../../../components/Cards/POCard";
import SelectDropdown from "react-native-select-dropdown";
import Search from "../../../components/Search";
import { authTokenState } from "../../../atoms/authTokenState";
import { useRecoilValue } from "recoil";
import { customStyles } from "../../../styles/customStyles";
import { Ionicons } from "@expo/vector-icons";
import POModal from "../../../components/Modals/POModal";
import axios from "axios";

const apiKey = process.env.EXPO_PUBLIC_API_URL;
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

  const handleFilterApply = ({
    department,
    item_group,
    start_date,
    end_date,
  }) => {
    // The params for dates are below
    // start_date = start_date
    // end_date = end_date
    console.log(start_date);
    console.log(end_date);
    setSelectedDepartment(department);
    setSelectedItemGroup(item_group);
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${apiKey}/purchase-orders?page=${page}&per_page=15&branch=${selectedBranchId}&department=${selectedDepartment}&item_group=${selectedItemGroup}&tab=1`,
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

  const handleLoadMore = () => {
    setPage(page + 1);
  };

  const renderItem = ({ item, index }) => {
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
      <POModal
        modalVisible={modalVisible}
        selectedID={selectedID}
        closeModal={() => setModalVisible(false)}
      />
      <FilterOptions
        selectedBranchID={selectedBranchId}
        onClose={handleFilterApply}
      />
      <View style={customStyles.utilsContainer}>
        <Search />
        {branch?.length > 0 && (
          <SelectDropdown
            data={branch?.map((branches) => ({
              id: branches?.id,
              name: branches?.abbreviation,
            }))}
            defaultValueByIndex={0}
            onSelect={(selectedBranch) =>
              setSelectedBranchId(selectedBranch.id)
            }
            buttonTextAfterSelection={(selectedBranch) => selectedBranch.name}
            rowTextForSelection={(item) => item.name}
            renderDropdownIcon={() => {
              return <Ionicons name="chevron-down" size={18} color="#2596BE" />;
            }}
            buttonStyle={customStyles.branchFilter}
            buttonTextStyle={customStyles.branchFilterText}
          />
        )}
      </View>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : data.length === 0 ? (
        <Text style={customStyles.emptyText}>No purchase order found</Text>
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

export default PODashboard;
