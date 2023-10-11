import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { useRecoilValue } from "recoil";
import { userRoleState } from "../atoms/userRoleState";

const ItemHeader = ({
  prNum,
  name,
  warehouse,
  requestedBy,
  dateRequested,
  approvedByDate,
  supplier,
  category,
  item_group,
}) => {
  const userRole = useRecoilValue(userRoleState);

  const renderItemHeader = () => {
    if (
      userRole === "department head" ||
      userRole === "administrator" ||
      userRole === "consultant" ||
      userRole === "comptroller"
    ) {
      return (
        <View>
          <Text style={styles.modalTextInfo}>
            PR No:
            <Text style={{ fontWeight: "400" }}> {prNum}</Text>
          </Text>
          <Text style={styles.modalTextInfo}>
            Name:
            <Text style={{ fontWeight: "400" }}> {name}</Text>
          </Text>
          <Text style={styles.modalTextInfo}>
            Department:
            <Text style={{ fontWeight: "400" }}> {warehouse}</Text>
          </Text>
          <Text style={styles.modalTextInfo}>
            Requested By:
            <Text style={{ fontWeight: "400" }}> {requestedBy}</Text>
          </Text>
          <Text style={styles.modalTextInfo}>
            Date Requested:
            <Text style={{ fontWeight: "400" }}> {dateRequested}</Text>
          </Text>
          {userRole === "administrator" || userRole === "consultant" ? (
            <Text style={styles.modalTextInfo}>
              Approved by Department Head:
              <Text style={{ fontWeight: "400" }}> {approvedByDate}</Text>
            </Text>
          ) : null}
        </View>
      );
    } else if (userRole === "corporate admin") {
      <View>
        <Text style={styles.modalTextInfo}>
          PO No:
          <Text style={{ fontWeight: "400" }}> {prNum}</Text>
        </Text>
        <Text style={styles.modalTextInfo}>
          Department:
          <Text style={{ fontWeight: "400" }}> {warehouse}</Text>
        </Text>
        <Text style={styles.modalTextInfo}>
          Item Group:
          <Text style={{ fontWeight: "400" }}> {item_group}</Text>
        </Text>
        <Text style={styles.modalTextInfo}>
          Category:
          <Text style={{ fontWeight: "400" }}> {category}</Text>
        </Text>
        <Text style={styles.modalTextInfo}>
          Supplier:
          <Text style={{ fontWeight: "400" }}> {supplier}</Text>
        </Text>
        <Text style={styles.modalTextInfo}>
          Requested By:
          <Text style={{ fontWeight: "400" }}> {requestedBy}</Text>
        </Text>
        <Text style={styles.modalTextInfo}>
          Date Requested:
          <Text style={{ fontWeight: "400" }}> {dateRequested}</Text>
        </Text>
      </View>;
    }
  };

  return <>{renderItemHeader()}</>;
};

const styles = StyleSheet.create({
  modalTextInfo: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
  },
});

export default ItemHeader;
