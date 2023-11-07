import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { authTokenState } from "../../atoms/authTokenState";
import { userBranchID } from "../../atoms/userBranchId";
import { vendorsData } from "../../atoms/vendorsData";
import { unitsData } from "../../atoms/unitsData";
import axios from "axios";
import Search from "../../components/Search";
import PRCard from "../../components/Cards/PRCard";
import { customStyles } from "../../styles/customStyles";
import { Ionicons } from "@expo/vector-icons";
import Modal from "react-native-modal";
import { Button, Card } from "react-native-elements";
import ModalFilter from "../../components/ModalFilter";
import ModalHeader from "../../components/Modals/PRModalHeader";

const apiKey = process.env.EXPO_PUBLIC_API_URL;

const DepartmentHeadHistory = () => {
  // Auth states
  const authToken = useRecoilValue(authTokenState);
  const branchID = useRecoilValue(userBranchID);
  const vendors = useRecoilValue(vendorsData);
  const units = useRecoilValue(unitsData);
  // Data states
  const [data, setData] = useState([]);
  const [selectedCardData, setSelectedCardData] = useState({});
  // Pagination states
  const [page, setPage] = useState(1);
  // Modal states
  const [filterModal, setFilterModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedItemGroup, setSelectedItemGroup] = useState("");
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");
  // Loading states
  const [isLoading, setIsLoading] = useState(false);

  const handleCardPress = (cardData) => {
    setSelectedCardData({ ...cardData });
    toggleModal();
  };

  const toggleFilter = () => {
    setFilterModal(true);
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleFilterApply = ({
    category,
    item_group,
    start_date,
    end_date,
  }) => {
    setSelectedCategory(category);
    setSelectedItemGroup(item_group);
    setSelectedStartDate(start_date);
    setSelectedEndDate(end_date);
    setFilterModal(false);
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${apiKey}/purchase-request?page=${page}&per_page=15&tab=2&branch=${branchID}&item_group=${selectedItemGroup}&category=${selectedCategory}&requested_date=${selectedStartDate}&required_date=${selectedEndDate}`,
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

  const getVendor = (id) => {
    const vendor = vendors.find((vendor) => vendor.id == id);
    return vendor?.vendor_Name ? vendor.vendor_Name : "";
  };

  const getUnit = (id) => {
    const unit = units.find((unit) => unit.id == id);
    return unit?.name;
  };

  useEffect(() => {
    fetchData();
  }, [
    authToken,
    page,
    branchID,
    selectedItemGroup,
    selectedCategory,
    selectedStartDate,
    selectedEndDate,
  ]);

  const handleLoadMore = () => {
    setPage(page + 1);
  };

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity onPress={() => handleCardPress(item)}>
        <PRCard
          prId={item?.pr_Document_Number}
          transactionDate={item?.pr_Transaction_Date}
          requestingName={item?.pr_RequestedBy}
          warehouse={item?.warehouse?.warehouse_description}
          itemGroup={item?.item_group?.name}
          category={item?.category?.name}
          quantity={item?.purchase_request_details?.item_Request_Qty}
          pr_status={item?.status?.Status_description}
          dateApproved={item?.pr_DepartmentHead_ApprovedDate}
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
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      )}
      <Modal isVisible={modalVisible} style={customStyles.modalContainer}>
        <View style={{ marginLeft: 16, marginTop: 15 }}>
          <ModalHeader
            prNum={selectedCardData?.pr_Document_Number}
            name={selectedCardData?.user?.name}
            warehouse={selectedCardData?.warehouse?.warehouse_description}
            requestedBy={selectedCardData?.user?.name}
            dateRequested={new Date(
              selectedCardData?.pr_Transaction_Date
            ).toLocaleDateString()}
          />
        </View>
        <ScrollView style={{ borderTopWidth: 1, borderTopColor: "lightgrey" }}>
          {selectedCardData?.purchase_request_details?.map((item, index) => (
            <Card key={index} containerStyle={customStyles.cardContainer}>
              <View style={customStyles.inputContainer}>
                <Text style={customStyles.inputText}>Item Name: </Text>
                <Text style={customStyles.dataInput}>
                  {item?.item_master?.item_name}
                </Text>
              </View>
              <View style={customStyles.inputContainer}>
                <Text style={customStyles.inputText}>Preferred Supplier: </Text>
                <Text style={customStyles.dataInput}>
                  {getVendor(item?.prepared_supplier_id)}
                </Text>
              </View>
              <View style={customStyles.inputContainer}>
                <Text style={customStyles.inputText}>Quantity: </Text>
                <Text style={customStyles.dataInput}>
                  {item?.item_Request_Department_Approved_Qty}
                </Text>
              </View>
              <View style={customStyles.inputContainer}>
                <Text style={customStyles.inputText}>Unit of Measurement:</Text>
                <Text style={customStyles.dataInput}>
                  {getUnit(
                    item?.item_Request_Department_Approved_UnitofMeasurement_Id
                  )}
                </Text>
              </View>
            </Card>
          ))}
        </ScrollView>
        <Button
          title={"Back"}
          buttonStyle={customStyles.cancelButton}
          onPress={toggleModal}
        />
      </Modal>
    </SafeAreaView>
  );
};

export default DepartmentHeadHistory;
