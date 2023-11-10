import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { authTokenState } from "../../../atoms/authTokenState";
import { useRecoilValue } from "recoil";
import axios from "axios";
import { Card } from "react-native-elements";
import { customStyles } from "../../../styles/customStyles";
import { useRoute } from "@react-navigation/native";

const apiKey = process.env.EXPO_PUBLIC_API_URL;

const ConsultantLogs = () => {
  const authToken = useRecoilValue(authTokenState);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const route = useRoute();
  const { id } = route.params;

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${apiKey}/purchase-request/${id}?tab=10`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setData(response.data);
      } catch (error) {
        if (error.response.status === 401) {
          navigation.navigate("Login");
          alert("Session expired or another user has logged in.");
        } else {
          alert(
            "Something went wrong. Please try again.",
            error.response.status
          );
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, authToken]);

  return (
    <View
      style={{ flex: 1, height: "100%", paddingLeft: 12, paddingVertical: 15 }}
    >
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ScrollView>
          {/* Purchase Request */}
          <View>
            <View style={customStyles.inputContainer}>
              <Text style={customStyles.headerText}>Purchase Request</Text>
              <Text style={customStyles.inputText}>
                Created by: {data?.pr_RequestedBy}
              </Text>
              <Text style={customStyles.inputText}>
                Request date:{" "}
                {new Date(data?.pr_Transaction_Date).toLocaleString({
                  hour12: true,
                })}
              </Text>
            </View>
            <ScrollView horizontal={true}>
              {data?.purchase_request_details?.map((item, index) => (
                <Card
                  key={index}
                  containerStyle={customStyles.cardLogsContainer}
                >
                  <Text style={customStyles.dataInput}>
                    Item Description: {item?.item_master?.item_name}
                  </Text>
                  <Text style={customStyles.dataInput}>
                    Requested Quantity: {item?.item_Request_Qty}
                  </Text>
                  <Text style={customStyles.dataInput}>
                    Requested UOM: {item?.unit?.name}
                  </Text>
                </Card>
              ))}
            </ScrollView>
          </View>
          {/* Pharma Dep Head */}
          <View>
            <View style={customStyles.inputContainer}>
              <Text style={customStyles.headerText}>Department Head</Text>
              <Text style={customStyles.inputText}>
                Approved by: {data?.pr_DepartmentHead_ApprovedBy}
              </Text>
              <Text style={customStyles.inputText}>
                Approved on:{" "}
                {new Date(data?.pr_DepartmentHead_ApprovedDate).toLocaleString({
                  hour12: true,
                })}
              </Text>
            </View>
            <ScrollView horizontal={true}>
              {data?.purchase_request_details?.map((item, index) => (
                <Card
                  key={index}
                  containerStyle={customStyles.cardLogsContainer}
                >
                  <Text style={customStyles.dataInput}>
                    Item Description: {item?.item_master?.item_name}
                  </Text>
                  <Text style={customStyles.dataInput}>
                    Approved Quantity:{" "}
                    {item?.item_Request_Department_Approved_Qty}
                  </Text>
                  <Text style={customStyles.dataInput}>
                    Approved UOM: {item?.unit?.name}
                  </Text>
                </Card>
              ))}
            </ScrollView>
          </View>
          {/* Consultant */}
          <View>
            <View style={customStyles.inputContainer}>
              <Text style={customStyles.headerText}>Consultant</Text>
              <Text style={customStyles.inputText}>
                Approved By: {data?.pr_Branch_Level2_ApprovedBy}
              </Text>
              <Text style={customStyles.inputText}>
                Approved on:{" "}
                {new Date(data?.pr_Branch_Level1_ApprovedDate).toLocaleString({
                  hour12: true,
                })}
              </Text>
            </View>
            <ScrollView horizontal={true}>
              {data?.purchase_request_details?.map((item, index) => (
                <Card
                  key={index}
                  containerStyle={customStyles.cardLogsContainer}
                >
                  <Text style={customStyles.dataInput}>
                    Item Description: {item?.item_master?.item_name}
                  </Text>
                  <Text style={customStyles.dataInput}>
                    Approved Quantity:{" "}
                    {item?.item_Request_Department_Approved_Qty}
                  </Text>
                  <Text style={customStyles.dataInput}>
                    Approved UOM: {item?.unit?.name}
                  </Text>
                </Card>
              ))}
            </ScrollView>
          </View>
          {/* Purchase Order */}
          <View>
            <View style={customStyles.inputContainer}>
              <Text style={customStyles.headerText}>Purchase Order</Text>
            </View>
            <ScrollView horizontal={true}>
              {data?.purchase_request_details
                ?.filter((item) => item?.purchase_order_details !== null)
                .map((item, index) => (
                  <Card
                    key={index}
                    containerStyle={customStyles.cardLogsContainer}
                  >
                    <Text style={customStyles.dataInput}>
                      Item Description: {item?.item_master?.item_name}
                    </Text>
                    <Text style={customStyles.dataInput}>
                      Quantity: {item?.item_Request_Qty}
                    </Text>
                    <Text style={customStyles.dataInput}>
                      UOM: {item?.unit?.name}
                    </Text>
                    <Text style={customStyles.dataInput}>
                      Price:{" "}
                      {item?.purchase_order_details?.po_Detail_item_listcost}
                    </Text>
                    <Text style={customStyles.dataInput}>
                      Vendor: {item?.recommended_canvas?.vendor?.vendor_Name}
                    </Text>
                    <Text style={customStyles.dataInput}>
                      PO by:{" "}
                      {item?.purchase_order_details?.purchase_order?.user?.name}
                    </Text>
                    <Text style={customStyles.dataInput}>
                      PO Date:{" "}
                      {new Date(
                        item?.purchase_order_details?.purchase_order?.po_Document_transaction_date
                      ).toLocaleString({
                        hour12: true,
                      })}
                    </Text>
                  </Card>
                ))}
            </ScrollView>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default ConsultantLogs;
