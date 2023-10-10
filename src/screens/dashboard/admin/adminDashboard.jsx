import {
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Alert,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { authTokenState } from "../../../atoms/authTokenState";
import { userPassword } from "../../../atoms/userPassword";
import CardData from "../../../components/CardData";
import ItemHeader from "../../../components/ItemHeader";
import Search from "../../../components/Search";
import ModalFilter from "../../../components/ModalFilter";
import Modal from "react-native-modal";
import { Card, Button, CheckBox } from "react-native-elements";
import { customStyles } from "../../../styles/customStyles";
import { Ionicons } from "@expo/vector-icons";

const apiKey = process.env.EXPO_PUBLIC_API_URL;

const AdminDashboard = () => {
  // Auth states
  const authToken = useRecoilValue(authTokenState);
  const userPasscode = useRecoilValue(userPassword);
  // Data states
  const [data, setData] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [units, setUnits] = useState([]);
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

  // GET VENDOR NAME AND UNIT NAME
  const getVendor = (id) => {
    const vendor = vendors.find((vendor) => vendor.id == id);
    return vendor?.vendor_Name ? vendor.vendor_Name : "Select a supplier";
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
            .post(
              `http://10.4.15.12:8004/api/purchase-request-items`,
              selectedCardData,
              {
                headers: {
                  Authorization: `Bearer ${authToken}`,
                },
              }
            )
            .then((response) => {
              console.log(response.data);
              alert("PR Approved on Selected Items");
              setModalVisible(!modalVisible);
            })
            .catch((error) => {
              console.error(error);
            });
        } catch (error) {
          console.error(error);
        }
      } else {
        alert("Wrong Password");
        return;
      }
    });
  };

  // FILTER DATA
  const handleFilterApply = ({ branch, department, category, item_group }) => {
    setSelectedBranch(branch);
    setSelectedDepartment(department);
    setSelectedCategory(category);
    setSelectedItemGroup(item_group);
    setFilterModal(false);
  };

  // FETCH DATA
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://10.4.15.12:8004/api/purchase-request?page=${page}&per_page=10&tab=1&branch=${selectedBranch}&department=${selectedDepartment}&category=${selectedCategory}&item_group=${selectedItemGroup}`,
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

  // FETCH VENDORS AND UNITS
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get(`http://10.4.15.12:8004/api/vendors`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setVendors(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchUnits = async () => {
      try {
        const response = await axios.get(`http://10.4.15.12:8004/api/units`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setUnits(response.data.units);
      } catch (error) {
        console.error(error);
      }
    };
    fetchVendors();
    fetchUnits();
  }, [authToken]);

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleCardPress(item, item.id)}>
      <CardData
        prId={item?.pr_Document_Number}
        transactionDate={item?.pr_Transaction_Date}
        requestingName={item?.user?.name}
        warehouse={item?.warehouse?.warehouse_description}
        itemGroup={item?.item_group?.name}
        category={item?.category?.name}
        justification={item?.pr_Justication}
        cardKey={item?.id}
      />
    </TouchableOpacity>
  );

  const handleEndReached = () => {
    if (data.length >= 10) {
      setPage(page + 1);
    }
  };

  return (
    <View style={{ paddingBottom: 185 }}>
      <View style={styles.utilsContainer}>
        <Search />
        <TouchableOpacity style={styles.filterButton} onPress={toggleFilter}>
          <Ionicons name="md-filter" size={16} color="#000" />
          <Text style={styles.filterText}>&nbsp;Filter</Text>
        </TouchableOpacity>
      </View>
      {/* FILTER MODAL */}
      <Modal isVisible={filterModal} style={styles.filterModalContainer}>
        <ModalFilter
          onSubmit={handleFilterApply}
          handleClose={() => setFilterModal(false)}
        />
      </Modal>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
      />
      <Modal isVisible={modalVisible} style={styles.modalContainer}>
        <View style={{ marginLeft: 16, marginTop: 15 }}>
          <ItemHeader
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
              <View style={styles.inputContainer}>
                <Text style={styles.inputText}>Item Name: </Text>
                <Text style={styles.dataInput}>
                  {item?.item_master?.item_name}
                </Text>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputText}>Preferred Supplier: </Text>
                <Text style={styles.dataInput}>
                  {getVendor(item?.prepared_supplier_id)}
                </Text>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputText}>Approved Quantity: </Text>
                <Text style={styles.dataInput}>
                  {item?.item_Request_Department_Approved_Qty}
                </Text>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputText}>
                  Approved Unit of Measurement:
                </Text>
                <Text style={styles.dataInput}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  utilsContainer: {
    flexDirection: "row",
    marginTop: 30,
    marginBottom: 13,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  filterButton: {
    width: "20%",
    flexDirection: "row",
    backgroundColor: "#50C878",
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  filterText: {
    fontSize: 17,
  },
  filterModalContainer: {
    backgroundColor: "#f7f7f7",
    borderRadius: 10,
    marginTop: 160,
    marginBottom: 160,
  },
  modalContainer: {
    backgroundColor: "#f7f7f7",
    borderRadius: 10,
    marginTop: 50,
    marginBottom: 35,
  },
  inputContainer: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  inputText: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 2,
  },
  dataInput: {
    fontSize: 16,
  },
});

export default AdminDashboard;
