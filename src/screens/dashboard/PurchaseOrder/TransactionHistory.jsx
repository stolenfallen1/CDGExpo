import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { authTokenState } from "../../../atoms/authTokenState.js";
import { useRecoilValue } from "recoil";
import { Button, Card } from "react-native-elements";
import { customStyles } from "../../../styles/customStyles";
import ModalHeader from "../../../components/Modals/POModalHeader.jsx";
import axios from "axios";

const apiKey = process.env.EXPO_PUBLIC_API_URL;
const TransactionHistory = ({ selectedID, toggleModal }) => {
  // Auth states
  const authToken = useRecoilValue(authTokenState);
  // Data states
  const [data, setData] = useState([]);
  // Loading states
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    if (!selectedID) return;
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [authToken, selectedID]);

  return (
    <>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : data.length === 0 ? (
        <Text style={customStyles.emptyText}>No results found</Text>
      ) : (
        <>
          <View style={{ marginLeft: 16, marginTop: 15 }}>
            <ModalHeader
              prNum={data?.po_Document_number}
              warehouse={
                data?.purchase_request?.user?.warehouse?.warehouse_description
              }
              item_group={data?.purchase_request?.item_group?.name}
              supplier={data?.vendor?.vendor_Name}
              requestedBy={data?.user?.name}
              dateRequested={new Date(
                data?.po_Document_transaction_date
              ).toLocaleDateString()}
            />
          </View>
          <ScrollView
            style={{ borderTopWidth: 1, borderTopColor: "lightgrey" }}
          >
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
                  <Text style={customStyles.inputText}>Price: </Text>
                  <Text style={customStyles.dataInput}>
                    {item?.purchase_request_detail?.item_ListCost}
                  </Text>
                </View>
                <View style={customStyles.inputContainer}>
                  <Text style={customStyles.inputText}>Total Cost: </Text>
                  <Text style={customStyles.dataInput}>
                    {item?.po_Detail_net_amount}
                  </Text>
                </View>
              </Card>
            ))}
          </ScrollView>
          <Button
            title={"Back"}
            buttonStyle={customStyles.cancelButton}
            onPress={toggleModal}
          />
        </>
      )}
    </>
  );
};

export default TransactionHistory;
