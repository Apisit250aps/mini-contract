'use client'

import UserDataTable from '@/components/app/user/user-data-table'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function UserView() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Users</CardTitle>
          <Button>Add User</Button>
        </div>
        <CardDescription>List of all users in the system</CardDescription>
      </CardHeader>
      <CardContent>
        <UserDataTable />
      </CardContent>
    </Card>
  )
}
