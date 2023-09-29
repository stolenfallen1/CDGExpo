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
import SearchFilter from "../../../components/SearchFilter";
import Modal from "react-native-modal";
import { Card, Button, CheckBox } from "react-native-elements";

const AdminDashboard = () => {
  const authToken = useRecoilValue(authTokenState);
  const userPasscode = useRecoilValue(userPassword);
  const [data, setData] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [units, setUnits] = useState([]);
  const [selectedCardData, setSelectedCardData] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [page, setPage] = useState(1);

  // METHODS ARE DEFINED HERE
  const handleCardPress = (cardData, cardKey) => {
    setSelectedCardData({ ...cardData, ...{ cardKey, isapproved: true } });
    toggleModal();
  };

  // TOGGLE MODAL
  const toggleModal = () => {
    setModalVisible(!modalVisible);
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
              "http://10.4.15.12:8004/api/purchase-request-items",
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
      const updatedData = response.data.data.map((item) => {
        const updatedDetails = item.purchase_request_details.map((detail) => {
          return { ...detail, isapproved: true };
        });
        return { ...item, purchase_request_details: updatedDetails };
      });
      setData([...data, ...updatedData]);
    } catch (error) {
      console.error(error);
    }
  };
  // FETCH DATA ON PAGE CHANGE
  useEffect(() => {
    fetchData();
  }, [authToken, page]);

  // FETCH VENDORS AND UNITS
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get("http://10.4.15.12:8004/api/vendors", {
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
        const response = await axios.get("http://10.4.15.12:8004/api/units", {
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
      <SearchFilter />
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
      />
      <Modal isVisible={modalVisible} style={styles.modalContainer}>
        <ScrollView horizontal={true}>
          {selectedCardData?.purchase_request_details?.map((item, index) => (
            <Card key={index} containerStyle={styles.cardContainer}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputText}>Item Code: </Text>
                <Text style={styles.dataInput}>{item.item_Id}</Text>
              </View>
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
                <Text style={styles.inputText}>Requested Quantity: </Text>
                <Text style={styles.dataInput}>{item?.item_Request_Qty}</Text>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputText}>Approved Quantity: </Text>
                <Text style={styles.dataInput}>
                  {item?.item_Request_Department_Approved_Qty}
                </Text>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputText}>
                  Requested Unit of Measurement:
                </Text>
                <Text style={styles.dataInput}>
                  {getUnit(item?.item_Request_UnitofMeasurement_Id)}
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
        <Button
          title={"Submit"}
          buttonStyle={{
            backgroundColor: "orange",
            paddingHorizontal: 25,
            margin: 10,
            borderRadius: 15,
          }}
          onPress={handleSubmit}
        />
        <Button
          title={"Back"}
          buttonStyle={{
            backgroundColor: "#2596BE",
            paddingHorizontal: 25,
            margin: 10,
            borderRadius: 15,
          }}
          onPress={toggleModal}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "#f7f7f7",
    borderRadius: 10,
    marginTop: 50,
    marginBottom: 35,
  },
  cardContainer: {
    borderRadius: 10,
    borderColor: "#66B5D1",
  },
  inputContainer: {
    paddingHorizontal: 10,
    paddingVertical: 13,
  },
  inputText: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 3,
  },
  dataInput: {
    fontSize: 18,
  },
});

export default AdminDashboard;
