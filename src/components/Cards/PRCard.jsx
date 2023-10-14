import { Text, StyleSheet } from "react-native";
import { Card } from "react-native-elements";
import React from "react";
import { customStyles } from "../../styles/customStyles";
import { useRecoilValue } from "recoil";
import { userRoleState } from "../../atoms/userRoleState";

const PRCard = ({
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
    if (
      userRole === "department head" ||
      userRole === "administrator" ||
      userRole === "consultant" ||
      userRole === "comptroller"
    ) {
      return (
        <Card containerStyle={customStyles.cardContainer}>
          <Text style={styles.prId}>PR No: {prId} </Text>
          <Text style={styles.cardText}>
            Req. Date: {new Date(transactionDate).toLocaleDateString()}
          </Text>
          <Text style={styles.cardText}>Requestee: {requestingName} </Text>
          <Text style={styles.cardText}>Department: {warehouse} </Text>
          <Text style={styles.cardText}>Item group: {itemGroup} </Text>
          <Text style={styles.cardText}>Category: {category} </Text>
          <Text style={styles.cardText}>Status: {pr_status} </Text>
          <Text style={styles.cardText}>Date approved: {dateApproved}</Text>
          <Text style={styles.cardText}>Remarks: {justification} </Text>
        </Card>
      );
    } else {
      null;
    }
  };

  return <>{renderCard()}</>;
};

const styles = StyleSheet.create({
  prId: {
    fontWeight: "bold",
    fontSize: 20,
    paddingBottom: 6,
    textDecorationLine: "underline",
  },
  cardText: {
    fontSize: 18,
  },
});

export default PRCard;
