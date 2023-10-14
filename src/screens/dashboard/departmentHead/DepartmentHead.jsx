import {
  ScrollView,
  TouchableOpacity,
  TextInput,
  Text,
  View,
  Alert,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { authTokenState } from "../../../atoms/authTokenState";
import { userBranchID } from "../../../atoms/userBranchId";
import { userPassword } from "../../../atoms/userPassword";
import PRCard from "../../../components/Cards/PRCard";
import ModalHeader from "../../../components/Modals/PRModalHeader";
import Search from "../../../components/Search";
import Modal from "react-native-modal";
import Toast from "react-native-root-toast";
import ModalFilter from "../../../components/ModalFilter";
import { Card, Button, CheckBox } from "react-native-elements";
import { customStyles } from "../../../styles/customStyles";
import RNPickerSelect from "react-native-picker-select";
import { Ionicons } from "@expo/vector-icons";

const apiKey = process.env.EXPO_PUBLIC_API_URL;

const INPUT_ANDROID_STYLES = {
  fontSize: 16,
  borderBottomWidth: 0.5,
  paddingBottom: 6,
};

const DROPDOWN_STYLES = {
  inputAndroid: INPUT_ANDROID_STYLES,
  inputIOS: {
    ...INPUT_ANDROID_STYLES,
  },
};

const DepartmentHead = () => {
  // Auth states
  const authToken = useRecoilValue(authTokenState);
  const branchID = useRecoilValue(userBranchID);
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
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});
  // Pagination states
  const [page, setPage] = useState(1);
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedItemGroup, setSelectedItemGroup] = useState("");
  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // METHODS ARE DEFINED HERE
  const handleCardPress = (cardData, cardKey) => {
    setSelectedCardData({ ...cardData, ...{ cardKey, isapproved: false } });
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

  // handle check all checkbox state
  const handleCheckAll = () => {
    setIsCheckAll(!isCheckAll);
    const updatedData = { ...selectedCardData };
    updatedData.purchase_request_details.map((item) => {
      item.isapproved = !isCheckAll;
    });
    setSelectedCardData(updatedData);
    setCheckedItems((prevState) => {
      const newState = {};
      updatedData.purchase_request_details.map((item) => {
        newState[item.item_Id] = !isCheckAll;
      });
      return newState;
    });
  };

  // handle item approval checkbox state
  const handleItemApproval = (item) => {
    item.isapproved = !item.isapproved;
    setCheckedItems((prevState) => {
      const newState = {
        ...prevState,
        [item.item_Id]: !prevState[item.item_Id],
      };
      return newState;
    });
  };

  // Submit event handler
  const handleSubmit = async () => {
    let isapproved = false;
    await selectedCardData.purchase_request_details.map((item) => {
      if (item.isapproved == true) isapproved = true;
    });
    selectedCardData.isapproved = isapproved;
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
              setModalVisible(!modalVisible);
              Toast.show("PR Approved on Selected Items", {
                duration: Toast.durations.SHORT,
                position: Toast.positions.TOP,
                backgroundColor: "green",
                opacity: 1,
              });
              fetchData();
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
  const handleFilterApply = ({ category, item_group }) => {
    setSelectedCategory(category);
    setSelectedItemGroup(item_group);
    setFilterModal(false);
  };

  // FETCH DATA
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${apiKey}/purchase-request?page=${page}&per_page=10&tab=1&branch=${branchID}&item_group=${selectedItemGroup}&category=${selectedCategory}`,
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
    fetchData();
  }, [authToken, page, branchID, selectedCategory, selectedItemGroup]);

  // FETCH VENDORS AND UNITS
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get(`${apiKey}/vendors`, {
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
        const response = await axios.get(`${apiKey}/units`, {
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
      <PRCard
        prId={item?.pr_Document_Number}
        transactionDate={item.pr_Transaction_Date}
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
    <View style={{ paddingBottom: 90 }}>
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
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
        />
      )}
      {/* ITEM CARD DISPLAY MODAL */}
      <Modal isVisible={modalVisible} style={customStyles.modalContainer}>
        <View style={{ marginLeft: 16, marginTop: 15 }}>
          <ModalHeader
            prNum={selectedCardData?.pr_Document_Number}
            name={selectedCardData?.user?.branch?.name}
            warehouse={selectedCardData?.warehouse?.warehouse_description}
            requestedBy={selectedCardData?.user?.name}
            dateRequested={new Date(
              selectedCardData?.pr_Transaction_Date
            ).toLocaleDateString()}
          />
          <CheckBox
            title={"Approve All Request"}
            containerStyle={{
              marginRight: 30,
              backgroundColor: "lightgreen",
              borderRadius: 10,
            }}
            checked={isCheckAll}
            onPress={handleCheckAll}
          />
        </View>
        <ScrollView
          style={{
            borderTopWidth: 1,
            borderTopColor: "lightgrey",
          }}
        >
          {selectedCardData?.purchase_request_details?.map((item, index) => (
            <Card key={index} containerStyle={customStyles.cardContainer}>
              <View style={customStyles.inputContainer}>
                <Text style={customStyles.inputText}>Item Name: </Text>
                <Text style={customStyles.dataInput}>
                  {item?.item_master?.item_name}
                </Text>
              </View>
              <View style={customStyles.inputContainer}>
                <Text style={customStyles.inputText}>Preferred Supplier:</Text>
                <RNPickerSelect
                  value={item?.prepared_supplier_id}
                  onValueChange={(value) => {
                    const updatedData = { ...selectedCardData };
                    updatedData.purchase_request_details[
                      index
                    ].prepared_supplier_id = value;
                    setSelectedCardData(updatedData);
                  }}
                  items={vendors.map((vendor) => ({
                    label: vendor.vendor_Name,
                    value: vendor.id,
                  }))}
                  placeholder={{
                    label: getVendor(item.prepared_supplier_id),
                    value: item.prepared_supplier_id,
                  }}
                  style={DROPDOWN_STYLES}
                  Icon={() => {
                    return (
                      <Ionicons name="chevron-down" size={18} color="gray" />
                    );
                  }}
                />
              </View>
              <View style={customStyles.inputContainer}>
                <Text style={customStyles.inputText}>Approved Quantity: </Text>
                <TextInput
                  keyboardType="numeric"
                  placeholder={item?.item_Request_Qty}
                  placeholderTextColor={"gray"}
                  style={customStyles.dataInput}
                  value={item?.item_Request_Department_Approved_Qty}
                  onChangeText={(text) => {
                    const updatedData = { ...selectedCardData };
                    updatedData.purchase_request_details[
                      index
                    ].item_Request_Department_Approved_Qty = text;
                    setSelectedCardData(updatedData);
                  }}
                ></TextInput>
              </View>
              <View style={customStyles.inputContainer}>
                <Text style={customStyles.inputText}>
                  Approved Unit of Measurement:
                </Text>
                <RNPickerSelect
                  value={
                    item?.item_Request_Department_Approved_UnitofMeasurement_Id
                  }
                  onValueChange={(value) => {
                    const updatedData = { ...selectedCardData };
                    updatedData.purchase_request_details[
                      index
                    ].item_Request_Department_Approved_UnitofMeasurement_Id =
                      value;
                    setSelectedCardData(updatedData);
                  }}
                  items={units.map((unit) => ({
                    label: unit.name,
                    value: unit.id,
                  }))}
                  placeholder={{
                    label: getUnit(item.item_Request_UnitofMeasurement_Id),
                    value: item.item_Request_UnitofMeasurement_Id,
                  }}
                  style={DROPDOWN_STYLES}
                  Icon={() => {
                    return (
                      <Ionicons name="chevron-down" size={18} color="gray" />
                    );
                  }}
                />
              </View>
              <CheckBox
                title={"Approve Request"}
                containerStyle={{ borderRadius: 10 }}
                checked={checkedItems[item.item_Id]}
                onPress={() => handleItemApproval(item)}
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
            buttonStyle={customStyles.submitButton}
            onPress={handleSubmit}
          />
          <Button
            title={"Back"}
            buttonStyle={customStyles.cancelButton}
            onPress={toggleModal}
          />
        </View>
      </Modal>
    </View>
  );
};

export default DepartmentHead;
