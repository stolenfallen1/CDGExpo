import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Card } from "react-native-elements";
import React from "react";
import { useRecoilValue } from "recoil";
import { userRoleState } from "../atoms/userRoleState";

const CardData = ({
  cardKey,
  prId,
  transactionDate,
  requestingName,
  warehouse,
  itemGroup,
  category,
  pr_status = "Pending",
  dateApproved = "Pending",
  justification,
}) => {
  const userRole = useRecoilValue(userRoleState);

  const renderCard = () => {
    if (userRole === "department head" || userRole === "administrator") {
      return (
        <Card containerStyle={styles.cardContainer}>
          <Text style={styles.prId}>PR No: {prId} </Text>
          <Text style={styles.cardText}>
            Date Request: {new Date(transactionDate).toLocaleDateString()}
          </Text>
          <Text style={styles.cardText}>Requestee: {requestingName} </Text>
          <Text style={styles.cardText}>Department: {warehouse} </Text>
          <Text style={styles.cardText}>Item group: {itemGroup} </Text>
          <Text style={styles.cardText}>Category: {category} </Text>
          <Text style={styles.cardText}>PR Status: {pr_status} </Text>
          <Text style={styles.cardText}>Date approved: {dateApproved}</Text>
          <Text style={styles.cardText}>Remarks: {justification} </Text>
        </Card>
      );
    }
  };

  return <>{renderCard()}</>;
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 10,
    borderColor: "#66B5D1",
  },
  prId: {
    fontWeight: "bold",
    fontSize: 20,
  },
  cardText: {
    fontSize: 18,
  },
  modalContainer: {
    paddingHorizontal: 15,
  },
  approveBtn: {
    position: "absolute",
    bottom: 20,
    paddingVertical: 10,
    alignSelf: "center",
    backgroundColor: "#66B5D1",
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  approveTxt: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CardData;
