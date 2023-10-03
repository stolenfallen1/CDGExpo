import {
  View,
  Text,
  ScrollView,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import CardData from "../../../components/CardData";
import SearchFilter from "../../../components/SearchFilter";
import { useRecoilValue } from "recoil";
import { authTokenState } from "../../../atoms/authTokenState";
import { userPassword } from "../../../atoms/userPassword";
import Modal from "react-native-modal";
import { Card, Button, CheckBox } from "react-native-elements";
import axios from "axios";

const apiKey = process.env.EXPO_PUBLIC_API_URL;

const ConsultantDashboard = () => {
  const authToken = useRecoilValue(authTokenState);
  const userPasscode = useRecoilValue(userPassword);
  const [data, setData] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [units, setUnits] = useState([]);
  const [selectedCardData, setSelectedCardData] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [isUnchecked, setIsUnchecked] = useState(true);
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
              alert("PR Approved on Selected Items");
              toggleModal();
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

  // FETCH DATA
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${apiKey}/purchase-request?page=${page}&per_page=10&tab=1`,
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
  // FETCH DATA ON PAGE CHANGE
  useEffect(() => {
    fetchData();
  }, [authToken, page]);

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
    fetchUnits();
    fetchVendors();
  }, [authToken]);

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleCardPress(item, item.id)}>
      <CardData
        prId={item?.pr_Document_Number}
        transactionDate={item?.pr_Transaction_Date}
        requestingName={item?.user?.name}
        warehouse={item?.warehouse.warehouse_description}
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
          <Text style={styles.modalTextInfo}>
            Approved by Department Head on:
            <Text style={{ fontWeight: "400" }}>
              {" "}
              {new Date(
                selectedCardData?.pr_DepartmentHead_ApprovedDate
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
            checked={isUnchecked}
            onPress={() => handleAllItemApproval()}
          />
        </View>
        <ScrollView>
          {selectedCardData?.purchase_request_details?.map((item, index) => (
            <Card key={index} containerStyle={styles.cardContainer}>
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
  modalContainer: {
    backgroundColor: "#f7f7f7",
    borderRadius: 10,
    marginTop: 50,
    marginBottom: 35,
  },
  cardContainer: {
    borderRadius: 10,
    borderColor: "#66B5D1",
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

export default ConsultantDashboard;
