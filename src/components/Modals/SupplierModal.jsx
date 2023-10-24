import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useState, useEffect } from "react";
import { customStyles } from "../../styles/customStyles";
import Modal from "react-native-modal";
import { Button, Card } from "react-native-elements";
import { authTokenState } from "../../atoms/authTokenState";
import { useRecoilValue } from "recoil";
import axios from "axios";

const apiKey = process.env.EXPO_PUBLIC_API_URL;

const SupplierModal = ({ modalVisible, closeModal, selectedID }) => {
  // Auth states
  const authToken = useRecoilValue(authTokenState);
  // Data states
  const [data, setData] = useState([]);
  // Loading states
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${apiKey}/canvas?details_id=${selectedID}`,
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
    fetchData();
  }, [authToken, selectedID]);

  return (
    <View style={{ paddingBottom: 200 }}>
      <Modal isVisible={modalVisible} style={customStyles.modalContainer}>
        <View>
          {isLoading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : data.length === 0 ? (
            <Text style={customStyles.emptyText}>No suppliers found</Text>
          ) : (
            <>
              <ScrollView>
                {data?.map((item) => (
                  <Card
                    key={item.id}
                    containerStyle={customStyles.cardContainer}
                  >
                    <View style={customStyles.inputContainer}>
                      <Text style={styles.inputTextBold}>Supplier Name: </Text>
                      <Text style={styles.inputText}>
                        {item?.vendor?.vendor_Name}
                      </Text>
                    </View>
                    <View style={customStyles.inputContainer}>
                      <Text style={styles.inputTextBold}>Price: </Text>
                      <Text style={styles.inputText}>
                        {item?.canvas_item_amount}
                      </Text>
                    </View>
                    <View style={customStyles.inputContainer}>
                      <Text style={styles.inputTextBold}>Quantity: </Text>
                      <Text style={styles.inputText}>
                        {item?.canvas_Item_Qty}
                      </Text>
                    </View>
                    <View style={customStyles.inputContainer}>
                      <Text style={styles.inputTextBold}>
                        Unit of Measurement:{" "}
                      </Text>
                      <Text style={styles.inputText}>{item?.unit?.name}</Text>
                    </View>
                    <View style={customStyles.inputContainer}>
                      <Text style={styles.inputTextBold}>Discount: </Text>
                      <Text style={styles.inputText}>
                        {item?.canvas_item_discount_percent}%
                      </Text>
                    </View>
                    <View style={customStyles.inputContainer}>
                      <Text style={styles.inputTextBold}>Vat Rate: </Text>
                      <Text style={styles.inputText}>
                        {item?.canvas_item_vat_rate}%
                      </Text>
                    </View>
                    <View style={customStyles.inputContainer}>
                      <Text style={styles.inputTextBold}>Lead Time: </Text>
                      <Text style={styles.inputText}>
                        {parseInt(item?.canvas_lead_time)}
                        {" (in days)"}
                      </Text>
                    </View>
                  </Card>
                ))}
              </ScrollView>
              <Button
                title={"Back"}
                buttonStyle={customStyles.cancelButton}
                onPress={closeModal}
              />
            </>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  inputTextBold: {
    fontSize: 14,
    fontWeight: "bold",
  },
  inputText: {
    fontSize: 16,
    textDecorationLine: "underline",
    textDecorationColor: "lightgrey",
  },
});

export default SupplierModal;
