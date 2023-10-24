import { View, Text, StyleSheet } from "react-native";
import { useRecoilValue } from "recoil";
import { userRoleState } from "../../atoms/userRoleState";

const PRModalHeader = ({
  prNum,
  name,
  warehouse,
  requestedBy,
  dateRequested,
  approvedByDate,
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

export default PRModalHeader;
