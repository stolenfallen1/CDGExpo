import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import PRCard from "../../../components/Cards/PRCard";
import Search from "../../../components/Search";
import { useRecoilValue } from "recoil";
import { authTokenState } from "../../../atoms/authTokenState";
import { userPassword } from "../../../atoms/userPassword";
import { vendorsData } from "../../../atoms/vendorsData";
import { unitsData } from "../../../atoms/unitsData";
import Modal from "react-native-modal";
import Toast from "react-native-root-toast";
import ModalFilter from "../../../components/ModalFilter";
import { Card, Button, CheckBox } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import { customStyles } from "../../../styles/customStyles";
import axios from "axios";
import ModalHeader from "../../../components/Modals/PRModalHeader";

const apiKey = process.env.EXPO_PUBLIC_API_URL;

const ConsultantDashboard = () => {
  // Auth states
  const authToken = useRecoilValue(authTokenState);
  const userPasscode = useRecoilValue(userPassword);
  // Data states
  const [data, setData] = useState([]);
  const vendors = useRecoilValue(vendorsData);
  const units = useRecoilValue(unitsData);
  const [selectedCardData, setSelectedCardData] = useState({});
  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [filterModal, setFilterModal] = useState(false);
  // Checkbox states
  const [isUnchecked, setIsUnchecked] = useState(true);
  // Pagination states
  const [page, setPage] = useState(1);
  // Filter states
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedItemGroup, setSelectedItemGroup] = useState("");
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");
  // Loading states
  const [isLoading, setIsLoading] = useState(false);

  // METHODS ARE DEFINED HERE
  const handleCardPress = (cardData, cardKey) => {
    setSelectedCardData({ ...cardData, ...{ cardKey, isapproved: true } });
    toggleModal();
  };

  // TOGGLE MODAL
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  // FILTER MODAL
  const toggleFilter = () => {
    setFilterModal(true);
  };

  const getVendor = (id) => {
    const vendor = vendors.find((vendor) => vendor.id == id);
    return vendor?.vendor_Name ? vendor.vendor_Name : "";
  };

  const getUnit = (id) => {
    const unit = units.find((unit) => unit.id == id);
    return unit?.name;
  };

  // handle all item approval checkbox state
  const handleAllItemApproval = () => {
    setIsUnchecked(!isUnchecked);
    const updatedDetails = selectedCardData.purchase_request_details.map(
      (item) => {
        return { ...item, isapproved: !isUnchecked };
      }
    );
    setSelectedCardData({
      ...selectedCardData,
      purchase_request_details: updatedDetails,
    });
  };

  // handle item approval checkbox state
  const handleItemApproval = (itemId) => {
    const updatedDetails = selectedCardData.purchase_request_details.map(
      (item) => {
        if (item.item_Id === itemId) {
          return { ...item, isapproved: !item.isapproved };
        } else {
          return item;
        }
      }
    );
    setSelectedCardData({
      ...selectedCardData,
      purchase_request_details: updatedDetails,
    });
  };

  // handle submit event
  const handleSubmit = async () => {
    Alert.prompt("Please enter your password:", "", (password) => {
      if (password === userPasscode) {
        try {
          axios
            .post(`${apiKey}/purchase-request-items`, selectedCardData, {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            })
            .then((response) => {
              console.log(response.data);
              toggleModal();
              Toast.show("PR Approved on Selected Items", {
                duration: Toast.durations.SHORT,
                position: Toast.positions.TOP,
                backgroundColor: "#5cb85c",
                opacity: 1,
              });
              fetchData();
            })
            .catch((error) => {
              console.error(error);
            });
        } catch (error) {
          console.error(error);
        }
      } else {
        alert("Wrong password");
        return;
      }
    });
  };

  // FILTER DATA
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

  // FETCH DATA
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${apiKey}/purchase-request?page=${page}&per_page=15&tab=1&branch=${selectedBranch}&department=${selectedDepartment}&category=${selectedCategory}&item_group=${selectedItemGroup}&requested_date=${selectedStartDate}&required_date=${selectedEndDate}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const updatedData = response.data.data.map((item) => {
        const updatedDetails = item.purchase_request_details.map((detail) => {
          return { ...detail, isapproved: true };
        });
        return { ...item, purchase_request_details: updatedDetails };
      });
      setData(updatedData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
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
    selectedStartDate,
    selectedEndDate,
  ]);

  const handleLoadMore = () => {
    setPage(page + 1);
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity onPress={() => handleCardPress(item, item.id)}>
      <PRCard
        prId={item?.pr_Document_Number}
        transactionDate={item?.pr_Transaction_Date}
        requestingName={item?.user?.name}
        warehouse={item?.warehouse.warehouse_description}
        itemGroup={item?.item_group?.name}
        category={item?.category?.name}
        justification={item?.pr_Justication}
        cardKey={item?.id}
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
        <Text style={customStyles.emptyText}>No purchase request found</Text>
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
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
            approvedByDate={new Date(
              selectedCardData?.pr_DepartmentHead_ApprovedDate
            ).toLocaleDateString()}
          />
          <CheckBox
            title={"Approve All Request"}
            containerStyle={{
              marginRight: 30,
              backgroundColor: "lightgreen",
              borderRadius: 10,
            }}
            checked={isUnchecked}
            onPress={() => handleAllItemApproval()}
          />
        </View>
        <ScrollView>
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
                <Text style={customStyles.inputText}>Approved Quantity: </Text>
                <Text style={customStyles.dataInput}>
                  {item?.item_Request_Department_Approved_Qty}
                </Text>
              </View>
              <View style={customStyles.inputContainer}>
                <Text style={customStyles.inputText}>
                  Approved Unit of Measurement:
                </Text>
                <Text style={customStyles.dataInput}>
                  {getUnit(
                    item?.item_Request_Department_Approved_UnitofMeasurement_Id
                  )}
                </Text>
              </View>
              <CheckBox
                title={"Approved by Department Head"}
                checked={item.isapproved}
                onPress={() => handleItemApproval(item.item_Id)}
              />
            </Card>
          ))}
        </ScrollView>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            backgroundColor: "transparent",
          }}
        >
          <Button
            title={"Submit"}
            buttonStyle={{
              backgroundColor: "orange",
              paddingHorizontal: 20,
              margin: 7,
              borderRadius: 10,
            }}
            onPress={handleSubmit}
          />
          <Button
            title={"Back"}
            buttonStyle={{
              backgroundColor: "#2596BE",
              paddingHorizontal: 20,
              margin: 7,
              borderRadius: 10,
            }}
            onPress={toggleModal}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ConsultantDashboard;
