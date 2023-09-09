import { View, Text } from 'react-native'
import React from 'react'
import { useRecoilValue } from 'recoil'
import { userRoleState } from '../../atoms/userRoleState'
import AdminDashboard from "./admin/AdminDashboard"
import DepartmentHead from "./departmentHead/DepartmentHead"


const Dashboard = () => {
  const userRole = useRecoilValue(userRoleState);

  return (
    <View>
      {userRole === "administrator" && <AdminDashboard />}
      {userRole === "department head" && <DepartmentHead />}
    </View>
  )
}

export default Dashboard;