import { View, Text, StyleSheet } from "react-native";
import { useRecoilValue } from "recoil";
import { userRoleState } from "../../atoms/userRoleState";

const POModalHeader = ({
  prNum,
  warehouse,
  requestedBy,
  dateRequested,
  supplier,
  item_group,
}) => {
  const userRole = useRecoilValue(userRoleState);

  const renderItemHeader = () => {
    if (
      userRole === "corporate admin" ||
      userRole === "administrator" ||
      userRole === "comptroller" ||
      userRole === "president"
    ) {
      return (
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
        </View>
      );
    } else {
      null;
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

export default POModalHeader;
