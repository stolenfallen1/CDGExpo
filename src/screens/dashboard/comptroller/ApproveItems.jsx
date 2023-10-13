import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useRecoilValue } from "recoil";
import { authTokenState } from "../../../atoms/authTokenState";
import { userPassword } from "../../../atoms/userPassword";
import { Card, Button, CheckBox } from "react-native-elements";
import { customStyles } from "../../../styles/customStyles";
import ItemHeader from "../../../components/ItemHeader";
import { Ionicons } from "@expo/vector-icons";

const apiKey = process.env.EXPO_PUBLIC_API_URL;

// http://10.4.15.12:8004/api/purchase-request/{id}?tab=6 (pr id)

// Display data
// Approve data

const ApproveItems = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { pr_id } = route.params;
  const { isStatus } = route.params;
  const authToken = useRecoilValue(authTokenState);
  const userPasscode = useRecoilValue(userPassword);
  const [data, setData] = useState([]);
  const [units, setUnits] = useState([]);
  const [isUnChecked, setIsUnchecked] = useState(true);

  const handlePress = (item_id) => {
    navigation.navigate("SupplierCanvasList", { item_id });
  };

  const getUnit = (id) => {
    const unit = units.find((unit) => unit.id == id);
    return unit?.name;
  };

  // handle all item approval checkbox state
  const handleAllItemApproval = () => {
    setIsUnchecked(!isUnChecked);
    const newData = data.purchase_request_details.map((item) => {
      return { ...item, status: !isUnChecked };
    });
    setData({
      ...data,
      purchase_request_details: newData,
    });
  };

  // handle single item approval checkbox state
  const handleItemApproval = (itemId) => {
    const newData = data?.purchase_request_details?.map((item) => {
      if (item.id === itemId) {
        return { ...item, status: !item.status };
      }
      return item;
    });
    setData({
      ...data,
      purchase_request_details: newData,
    });
  };

  // handle submit button event /api/approve-canvas
  const handleSubmit = async () => {
    Alert.prompt("Please enter your password:", "", (password) => {
      if (password === userPasscode) {
        try {
          const selectedItems = data.purchase_request_details.filter(
            (item) => item.status
          );
          if (selectedItems.length === 0) {
            Alert.prompt(
              "Please provide remarks for declining the items:",
              "",
              (remarks) => {
                if (remarks) {
                  const payload = {
                    items: data.purchase_request_details.map((item) => ({
                      item_id: item.item_Id,
                      status: item.status,
                      remarks: remarks,
                    })),
                  };
                  axios
                    .post(`${apiKey}/approve-canvas`, payload, {
                      headers: {
                        Authorization: `Bearer ${authToken}`,
                      },
                    })
                    .then((response) => {
                      console.log(response.data);
                      alert("Remarks Submitted Successfully");
                      navigation.goBack();
                    })
                    .catch((error) => {
                      console.error(error);
                    });
                }
              }
            );
          } else {
            const payload = {
              items: data.purchase_request_details.map((item) => ({
                item_id: item.item_Id,
                status: item.status,
                remarks: null,
              })),
            };
            axios
              .post(`${apiKey}/approve-canvas`, payload, {
                headers: {
                  Authorization: `Bearer ${authToken}`,
                },
              })
              .then((response) => {
                console.log(response.data);
                alert("Canvas Approved Successfully");
                navigation.goBack();
              })
              .catch((error) => {
                console.error(error);
              });
          }
        } catch (error) {
          console.error(error);
        }
      } else {
        alert("Wrong Password");
        return;
      }
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      // For now change back to static url instead of using .env file
      try {
        const response = await axios.get(
          `${apiKey}/purchase-request/${pr_id}?tab=6`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        const newData = { ...response.data, status: isStatus };
        newData.purchase_request_details = newData.purchase_request_details.map(
          (item) => ({ ...item, status: true })
        );
        setData(newData);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchUnits = async () => {
      // For now change back to static url instead of using .env file
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
    fetchData();
  }, [pr_id, authToken, isStatus]);

  return (
    <View style={{ paddingBottom: 245 }}>
      <View style={{ marginLeft: 16, marginTop: 15 }}>
        <ItemHeader
          prNum={data?.pr_Document_Number}
          name={data?.user?.branch?.name}
          warehouse={data?.warehouse?.warehouse_description}
          requestedBy={data?.user?.name}
          dateRequested={new Date(
            data?.pr_Transaction_Date
          ).toLocaleDateString()}
        />
        <CheckBox
          title={"Approve All Request"}
          containerStyle={{
            marginRight: 30,
            backgroundColor: "lightgreen",
            borderRadius: 10,
          }}
          checked={isUnChecked}
          onPress={() => handleAllItemApproval()}
        />
      </View>
      <ScrollView>
        {data?.purchase_request_details?.map((item, index) => (
          <Card key={index} containerStyle={customStyles.cardContainer}>
            <View>
              <View style={customStyles.inputContainer}>
                <Text style={customStyles.inputText}>Item Name: </Text>
                <Text style={styles.textValue}>
                  {item?.item_master?.item_name}
                </Text>
              </View>
              <View style={customStyles.inputContainer}>
                <Text style={customStyles.inputText}>Quantity: </Text>
                <Text style={styles.textValue}>
                  {item?.item_Branch_Level1_Approved_Qty}
                </Text>
              </View>
              <View style={customStyles.inputContainer}>
                <Text style={customStyles.inputText}>
                  Unit of Measurement:{" "}
                </Text>
                <Text style={styles.textValue}>
                  {getUnit(
                    item?.item_Branch_Level1_Approved_UnitofMeasurement_Id
                  )}
                </Text>
              </View>
              <View style={customStyles.inputContainer}>
                <Text style={customStyles.inputText}>Price: </Text>
                <Text style={styles.textValue}>
                  {item?.recommended_canvas?.canvas_item_amount}
                </Text>
              </View>
              <View style={customStyles.inputContainer}>
                <Text style={customStyles.inputText}>Total: </Text>
                <Text style={styles.textValue}>
                  {item?.recommended_canvas?.canvas_item_total_amount}
                </Text>
              </View>
              <View style={customStyles.inputContainer}>
                <Text style={customStyles.inputText}>
                  Recommended Supplier:{" "}
                </Text>
                <Text style={styles.textValue}>
                  {item?.recommended_canvas?.vendor?.vendor_Name}
                </Text>
              </View>
              <TouchableOpacity
                style={customStyles.inputContainer}
                onPress={() => handlePress(item.id)}
              >
                <Ionicons
                  name="eye"
                  color={"green"}
                  size={18}
                  style={{ marginTop: 8 }}
                />
              </TouchableOpacity>
              <CheckBox
                title={"Approved Canvas"}
                containerStyle={{ borderRadius: 10 }}
                checked={item.status}
                onPress={() => handleItemApproval(item.id)}
              />
            </View>
          </Card>
        ))}
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
            onPress={() => handleSubmit()}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  textValue: {
    fontSize: 16,
    textDecorationLine: "underline",
    textDecorationColor: "lightgrey",
  },
});

export default ApproveItems;
