import {
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
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
import Search from "../../../components/Search";
import Modal from "react-native-modal";
import ModalFilter from "../../../components/ModalFilter";
import { Card, Button, CheckBox } from "react-native-elements";
import RNPickerSelect from "react-native-picker-select";
import { Ionicons } from "@expo/vector-icons";

const apiKey = process.env.EXPO_PUBLIC_API_URL;

const DepartmentHead = () => {
  const authToken = useRecoilValue(authTokenState);
  const userPasscode = useRecoilValue(userPassword);
  const [data, setData] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [units, setUnits] = useState([]);
  const [selectedCardData, setSelectedCardData] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [filterModal, setFilterModal] = useState(false);
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});
  const [page, setPage] = useState(1);

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

  // FETCH DATA
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://10.4.15.12:8004/api/purchase-request?page=${page}&per_page=10&tab=1`,
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
  }, [authToken, page]);

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
        <ModalFilter />
        <Button
          title={"Filter"}
          buttonStyle={{
            backgroundColor: "orange",
            paddingHorizontal: 20,
            margin: 7,
            borderRadius: 10,
          }}
          onPress={() => setFilterModal(false)}
        />
        <Button
          title={"Back"}
          buttonStyle={{
            backgroundColor: "#2596BE",
            paddingHorizontal: 20,
            margin: 7,
            borderRadius: 10,
          }}
          onPress={() => setFilterModal(false)}
        />
      </Modal>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
      />
      {/* ITEM CARD DISPLAY MODAL */}
      <Modal isVisible={modalVisible} style={styles.modalContainer}>
        <View style={{ marginLeft: 16, marginTop: 15 }}>
          <Text style={styles.modalTextInfo}>
            PR No:
            <Text style={{ fontWeight: "400" }}>
              {" "}
              {selectedCardData?.pr_Document_Number}
            </Text>
          </Text>
          <Text style={styles.modalTextInfo}>
            Name:
            <Text style={{ fontWeight: "400" }}>
              {" "}
              {selectedCardData?.user?.branch?.name}
            </Text>
          </Text>
          <Text style={styles.modalTextInfo}>
            Department:
            <Text style={{ fontWeight: "400" }}>
              {" "}
              {selectedCardData?.warehouse?.warehouse_description}
            </Text>
          </Text>
          <Text style={styles.modalTextInfo}>
            Requested By:
            <Text style={{ fontWeight: "400" }}>
              {" "}
              {selectedCardData?.user?.name}
            </Text>
          </Text>
          <Text style={styles.modalTextInfo}>
            Date Requested:
            <Text style={{ fontWeight: "400" }}>
              {" "}
              {new Date(
                selectedCardData?.pr_Transaction_Date
              ).toLocaleDateString()}
            </Text>
          </Text>
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
            <Card key={index} containerStyle={styles.cardContainer}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputText}>Item Name: </Text>
                <Text style={styles.dataInput}>
                  {item?.item_master?.item_name}
                </Text>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputText}>Preferred Supplier:</Text>
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
                  style={{
                    inputIOS: {
                      fontSize: 16,
                      borderBottomWidth: 0.5,
                      paddingBottom: 6,
                    },
                    inputAndroid: {
                      fontSize: 16,
                      borderBottomWidth: 0.5,
                      paddingBottom: 6,
                    },
                  }}
                  Icon={() => {
                    return (
                      <Ionicons name="chevron-down" size={18} color="gray" />
                    );
                  }}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputText}>Approved Quantity: </Text>
                <TextInput
                  keyboardType="numeric"
                  placeholder={item?.item_Request_Qty}
                  placeholderTextColor={"gray"}
                  style={styles.dataInput}
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
              <View style={styles.inputContainer}>
                <Text style={styles.inputText}>
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
                  style={{
                    inputIOS: {
                      fontSize: 16,
                      borderBottomWidth: 0.5,
                      paddingBottom: 6,
                    },
                    inputAndroid: {
                      fontSize: 16,
                      borderBottomWidth: 0.5,
                      paddingBottom: 6,
                    },
                  }}
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
  modalTextInfo: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
  },
  cardContainer: {
    borderRadius: 10,
    borderColor: "#66B5D1",
    marginBottom: 5,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5.5,
    },
    shadowOpacity: 0.7,
    borderRadius: 12,
    marginBottom: 10,
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

export default DepartmentHead;
