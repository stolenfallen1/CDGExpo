import { View, Text, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import { customStyles } from "../../styles/customStyles";
import Modal from "react-native-modal";
import { Button, Card } from "react-native-elements";
import { authTokenState } from "../../atoms/authTokenState";
import { useRecoilValue } from "recoil";
import ModalHeader from "./POModalHeader";
import axios from "axios";

const apiKey = process.env.EXPO_PUBLIC_API_URL;

const POModal = ({ modalVisible, closeModal, selectedID }) => {
  const authToken = useRecoilValue(authTokenState);
  const [data, setData] = useState([]);

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
      setData(response.data);
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
            </Card>
          ))}
        </ScrollView>
        <Button
          title={"Submit"}
          buttonStyle={customStyles.submitButton}
          onPress={closeModal}
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
