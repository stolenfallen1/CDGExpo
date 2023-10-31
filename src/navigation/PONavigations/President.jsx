import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { authTokenState } from "../../atoms/authTokenState";
import SelectDropdown from "react-native-select-dropdown";
import Search from "../../components/Search";
import POCard from "../../components/Cards/POCard";
import { customStyles } from "../../styles/customStyles";
import { Ionicons } from "@expo/vector-icons";
import Modal from "react-native-modal";
import FilterOptions from "../../screens/dashboard/PurchaseOrder/FilterOptions";
import TransactionHistory from "../../screens/dashboard/PurchaseOrder/TransactionHistory";
import axios from "axios";

const apiKey = process.env.EXPO_PUBLIC_API_URL;
const President = () => {
  // Auth states
  const authToken = useRecoilValue(authTokenState);
  // Data states
  const [data, setData] = useState([]);
  const [branch, setBranch] = useState([]);
  const [selectedID, setSelectedID] = useState();
  // Filter states
  const [selectedBranchId, setSelectedBranchId] = useState(1);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedItemGroup, setSelectedItemGroup] = useState("");
  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  // Loading states
  const [isLoading, setIsLoading] = useState(false);

  const handleCardPress = (id) => {
    setSelectedID(id);
    toggleModal();
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
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
        `${apiKey}/purchase-orders?page=1&per_page=10&branch=${selectedBranchId}&department=${selectedDepartment}&item_group=${selectedItemGroup}&tab=5`,
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

  return (
    <View>
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
        <Text style={customStyles.emptyText}>No results found</Text>
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      )}
      <Modal isVisible={modalVisible} style={customStyles.modalContainer}>
        <TransactionHistory
          selectedID={selectedID}
          toggleModal={() => setModalVisible(false)}
        />
      </Modal>
    </View>
  );
};

export default President;
