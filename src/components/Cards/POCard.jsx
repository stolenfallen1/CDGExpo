import { Text, StyleSheet } from "react-native";
import { Card } from "react-native-elements";
import { customStyles } from "../../styles/customStyles";
import { useRecoilValue } from "recoil";
import { userRoleState } from "../../atoms/userRoleState";

const POCard = ({
  cardKey,
  prId,
  transactionDate,
  requestingName,
  warehouse,
  pr_status = "Pending",
  justification,
  poId,
  supplier,
}) => {
  const userRole = useRecoilValue(userRoleState);

  const renderCard = () => {
    if (
      userRole === "corporate admin" ||
      userRole === "administrator" ||
      userRole === "president" ||
      userRole === "comptroller"
    ) {
      return (
        <Card containerStyle={customStyles.cardContainer}>
          <Text style={styles.prId}>PO No: {poId} </Text>
          <Text style={styles.prId}>PR No: {prId} </Text>
          <Text style={styles.cardText}>Supplier: {supplier} </Text>
          <Text style={styles.cardText}>Department: {warehouse} </Text>
          <Text style={styles.cardText}>
            Trans. Date: {new Date(transactionDate).toLocaleDateString()}
          </Text>
          <Text style={styles.cardText}>Requestee: {requestingName} </Text>
          <Text style={styles.cardText}>Status: {pr_status} </Text>
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

export default POCard;
