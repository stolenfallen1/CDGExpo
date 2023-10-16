import { View, Text, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import { customStyles } from "../../styles/customStyles";
import Modal from "react-native-modal";
import { Button, Card, CheckBox } from "react-native-elements";
import { authTokenState } from "../../atoms/authTokenState";
import { userPassword } from "../../atoms/userPassword";
import { useRecoilValue } from "recoil";
import ModalHeader from "./POModalHeader";
import axios from "axios";
import { Alert } from "react-native";
import Toast from "react-native-root-toast";

const apiKey = process.env.EXPO_PUBLIC_API_URL;

const POModal = ({ modalVisible, closeModal, selectedID }) => {
  // Auth states
  const authToken = useRecoilValue(authTokenState);
  const userPasscode = useRecoilValue(userPassword);
  // Data states
  const [data, setData] = useState([]);
  // Checkbox states
  const [isUnchecked, setisUnchecked] = useState(true);

  const handleSelectAllChange = () => {
    // This function will check all the checkboxes
    const updatedData = { ...data };
    updatedData.details.map((item) => (item.isapproved = !isUnchecked));
    setData(updatedData);
    setisUnchecked(!isUnchecked);
  };

  const handleCheckBoxChange = (itemIndex) => {
    const updatedData = { ...data };
    updatedData.details[itemIndex].isapproved =
      !updatedData.details[itemIndex].isapproved;
    setData(updatedData);
  };

  const handleSubmit = async () => {
    // This function will submit the data to the backend
    // approve-purchase-order
    Alert.prompt("Please enter your password:", "", (password) => {
      if (password === userPasscode) {
        try {
          axios
            .post(`${apiKey}/approve-purchase-order`, data, {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            })
            .then((response) => {
              console.log(response.data);
              Toast.show("PO Approved Successfully", {
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
        alert("Wrong Password");
        return;
      }
    });
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${apiKey}/purchase-order/${selectedID}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const isApproved = true;
      const updatedDetails = response.data.details.map((detail) => ({
        ...detail,
        isapproved: isApproved,
      }));
      const updatedData = { ...response.data, details: updatedDetails };
      setData(updatedData);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [authToken, selectedID]);

  return (
    <View>
      <Modal isVisible={modalVisible} style={customStyles.modalContainer}>
        <View style={{ marginLeft: 16, marginTop: 15 }}>
          <ModalHeader
            prNum={data?.po_Document_number}
            warehouse={data?.user?.warehouse?.warehouse_description}
            item_group={data?.purchase_request?.item_group?.name}
            supplier={data?.vendor?.vendor_Name}
            requestedBy={data?.purchase_request?.user?.name}
            dateRequested={new Date(
              data?.po_Document_transaction_date
            ).toLocaleDateString()}
          />
          <CheckBox
            title={"Approve All PO Request"}
            containerStyle={{
              marginRight: 30,
              backgroundColor: "lightgreen",
              borderRadius: 10,
            }}
            checked={isUnchecked}
            onPress={handleSelectAllChange}
          />
        </View>
        <ScrollView>
          {data?.details?.map((item, index) => (
            <Card key={index} containerStyle={customStyles.cardContainer}>
              <View style={customStyles.inputContainer}>
                <Text style={customStyles.inputText}>Item Name: </Text>
                <Text style={customStyles.dataInput}>
                  {item?.item?.item_name}
                </Text>
              </View>
              <View style={customStyles.inputContainer}>
                <Text style={customStyles.inputText}>Quantity: </Text>
                <Text style={customStyles.dataInput}>
                  {item?.po_Detail_item_qty}
                </Text>
              </View>
              <View style={customStyles.inputContainer}>
                <Text style={customStyles.inputText}>
                  Unit of Measurement:{" "}
                </Text>
                <Text style={customStyles.dataInput}>{item?.unit?.name}</Text>
              </View>
              <View style={customStyles.inputContainer}>
                <Text style={customStyles.inputText}>Price:</Text>
                <Text style={customStyles.dataInput}>
                  {item?.purchase_request_detail?.item_ListCost}
                </Text>
              </View>
              <View style={customStyles.inputContainer}>
                <Text style={customStyles.inputText}>Total Cost:</Text>
                <Text style={customStyles.dataInput}>
                  {item?.po_Detail_item_listcost}
                </Text>
              </View>
              <CheckBox
                title={"Approve for Purchase Order"}
                checked={item?.isapproved}
                onPress={() => handleCheckBoxChange(index)}
              />
            </Card>
          ))}
        </ScrollView>
        <Button
          title={"Submit"}
          buttonStyle={customStyles.submitButton}
          onPress={handleSubmit}
        />
        <Button
          title={"Back"}
          buttonStyle={customStyles.cancelButton}
          onPress={closeModal}
        />
      </Modal>
    </View>
  );
};

export default POModal;
