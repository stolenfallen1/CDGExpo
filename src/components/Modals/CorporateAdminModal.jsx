import { View, Text } from "react-native";
import React, { useState, useEffect } from "react";
import { customStyles } from "../../styles/customStyles";
import Modal from "react-native-modal";
import { Button } from "react-native-elements";
import { authTokenState } from "../../atoms/authTokenState";
import { useRecoilValue } from "recoil";
import ItemHeader from "../ItemHeader";
import axios from "axios";

const apiKey = process.env.EXPO_PUBLIC_API_URL;

const CorporateAdminModal = ({ modalVisible, closeModal, selectedID }) => {
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
          <ItemHeader
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
        <Button
          title={"Back"}
          buttonStyle={customStyles.cancelButton}
          onPress={closeModal}
        />
      </Modal>
    </View>
  );
};

export default CorporateAdminModal;
